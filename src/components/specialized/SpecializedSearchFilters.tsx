/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Search & Cumulative Taxonomy Filters
 * Principio v1.4: perfil + necesidad funcional + apoyo + etapa vital + ubicación + red
 * se aplican conjuntamente mediante lógica AND entre dimensiones y OR controlado dentro de una misma dimensión (§62.1).
 * Novedad v1.7: Búsqueda de combinaciones de apoyos en una misma sede (§82).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  SearchQueryState, 
  ProfileId, 
  SupportTypeId, 
  FunctionalNeedId, 
  LifeStage, 
  NetworkPreference, 
  CombinationMode 
} from '../../types/specialized';
import { 
  CORE_PROFILES, 
  EXPERIMENTAL_PROFILES, 
  PENDING_PROFILES,
  SUPPORT_TYPES, 
  FUNCTIONAL_NEEDS, 
  LIFE_STAGES 
} from '../../data/specializedTaxonomy';

const ACCESSIBILITY_FEATURES = [
  { id: 'wheelchair_access', label: 'Acceso silla de ruedas', icon: Accessibility },
  { id: 'magnetic_loops', label: 'Bucles magnéticos', icon: Ear },
  { id: 'braille_signage', label: 'Señalética braille', icon: Type }
];
import { getProfileDefinition } from '../../utils/specializedEngine';
import { 
  MapPin, 
  Navigation, 
  X, 
  Search, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Building2,
  Accessibility,
  Ear,
  Type
} from 'lucide-react';

import { MADRID_MUNICIPALITIES, findMunicipalityByName, resolveSearchOrigin } from '../../data/municipalitiesData';

interface MunicipalityOption {
  code: string;
  name: string;
  search_name: string;
  lat: number;
  lon: number;
}

interface SearchFiltersProps {
  query: SearchQueryState;
  setQuery: React.Dispatch<React.SetStateAction<SearchQueryState>>;
  totalResults: number;
  onOpenDisambiguation: (term: 'neurodivergent' | 'psychomotor') => void;
  onResetFilters: () => void;
}

export const SpecializedSearchFilters: React.FC<SearchFiltersProps> = ({
  query,
  setQuery,
  totalResults,
  onOpenDisambiguation,
  onResetFilters
}) => {
  const [municipalities, setMunicipalities] = useState<MunicipalityOption[]>(MADRID_MUNICIPALITIES);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'timeout'>('idle');
  const [showAdvancedNeeds, setShowAdvancedNeeds] = useState(false);

  // Carga del catálogo oficial de municipios de la Comunidad de Madrid
  useEffect(() => {
    fetch('/data/municipalities.json')
      .then(res => res.json())
      .then((data: MunicipalityOption[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setMunicipalities(data);
        }
      })
      .catch(() => {});

    // Solicitud/activación inicial de ubicación de referencia por defecto
    if (query.location_mode === 'browser' && !query.municipality) {
      requestBrowserLocation();
    }
  }, []);

  // Geolocalización efímera del navegador (§67) - con requisito de asignación de municipio alternativa para desactivar
  const requestBrowserLocation = () => {
    // Si ya está activo, informamos o reactivamos GPS; la única forma de cambiar es mediante el desplegable de municipios
    setGeoStatus('requesting');
    setQuery(prev => ({
      ...prev,
      municipality: null,
      location_mode: 'browser'
    }));

    if (!navigator.geolocation) {
      setGeoStatus('granted');
      setQuery(prev => ({
        ...prev,
        municipality: null,
        user_ephemeral_location: [40.4168, -3.7038],
        location_mode: 'browser'
      }));
      return;
    }

    const timer = setTimeout(() => {
      setGeoStatus('granted');
      setQuery(prev => ({
        ...prev,
        municipality: null,
        user_ephemeral_location: prev.user_ephemeral_location || [40.4168, -3.7038],
        location_mode: 'browser'
      }));
    }, 2500);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        setGeoStatus('granted');
        setQuery(prev => ({
          ...prev,
          user_ephemeral_location: [pos.coords.latitude, pos.coords.longitude],
          location_mode: 'browser',
          municipality: null
        }));
      },
      () => {
        clearTimeout(timer);
        setGeoStatus('granted');
        setQuery(prev => ({
          ...prev,
          user_ephemeral_location: [40.4168, -3.7038],
          location_mode: 'browser',
          municipality: null
        }));
      },
      { timeout: 2500, maximumAge: 60000, enableHighAccuracy: false }
    );
  };

  const handleSelectMunicipality = (muniName: string) => {
    setGeoStatus('idle');
    if (!muniName) {
      // Si selecciona la opción vacía, vuelve a Madrid Centro por defecto
      setQuery(prev => ({
        ...prev,
        municipality: null,
        user_ephemeral_location: [40.4168, -3.7038],
        location_mode: 'all'
      }));
      return;
    }
    const selected = municipalities.find(m => m.name === muniName);
    if (!selected) return;
    // Seleccionar un municipio desactiva obligatoriamente el GPS y asigna el nuevo origen municipal
    setQuery(prev => ({
      ...prev,
      municipality: selected.name,
      user_ephemeral_location: [selected.lat, selected.lon],
      location_mode: 'municipality'
    }));
  };

  const toggleSupport = (id: SupportTypeId) => {
    setQuery(prev => {
      const exists = prev.support_types.includes(id);
      return {
        ...prev,
        support_types: exists 
          ? prev.support_types.filter(s => s !== id)
          : [...prev.support_types, id]
      };
    });
  };

  const toggleFunctionalNeed = (id: FunctionalNeedId) => {
    setQuery(prev => {
      const exists = prev.functional_needs.includes(id);
      return {
        ...prev,
        functional_needs: exists
          ? prev.functional_needs.filter(n => n !== id)
          : [...prev.functional_needs, id]
      };
    });
  };

  // Definición del perfil seleccionado para filtrado dinámico contextual
  const activeProfileDef = useMemo(() => {
    if (!query.profile) return null;
    return getProfileDefinition(query.profile);
  }, [query.profile]);

  // Tipos de apoyo dinámicos adaptados a la taxonomía seleccionada
  const displayedSupportTypes = useMemo(() => {
    if (!activeProfileDef || !activeProfileDef.typical_supports || activeProfileDef.typical_supports.length === 0) {
      return Object.values(SUPPORT_TYPES);
    }
    return activeProfileDef.typical_supports
      .map(id => SUPPORT_TYPES[id])
      .filter(Boolean);
  }, [activeProfileDef]);

  // Etapas vitales dinámicas autorizadas para el perfil seleccionado
  const displayedLifeStages = useMemo(() => {
    if (!activeProfileDef || !activeProfileDef.allowed_life_stages || activeProfileDef.allowed_life_stages.length === 0) {
      return Object.entries(LIFE_STAGES);
    }
    return Object.entries(LIFE_STAGES).filter(([key]) => 
      activeProfileDef.allowed_life_stages.includes(key as LifeStage)
    );
  }, [activeProfileDef]);

  // Necesidades funcionales dinámicas observables pertinentes a la condición seleccionada
  const displayedFunctionalNeeds = useMemo(() => {
    if (!activeProfileDef || !activeProfileDef.typical_needs || activeProfileDef.typical_needs.length === 0) {
      return Object.values(FUNCTIONAL_NEEDS);
    }
    return activeProfileDef.typical_needs
      .map(id => FUNCTIONAL_NEEDS[id])
      .filter(Boolean);
  }, [activeProfileDef]);

  // Auto-limpieza preventiva: si el usuario cambia de perfil, retira apoyos o necesidades no pertinentes
  useEffect(() => {
    if (!activeProfileDef) return;

    setQuery(prev => {
      let changed = false;
      let nextSupports = prev.support_types;
      let nextNeeds = prev.functional_needs;
      let nextStage = prev.life_stage;

      if (activeProfileDef.typical_supports && activeProfileDef.typical_supports.length > 0) {
        const filtered = prev.support_types.filter(s => activeProfileDef.typical_supports!.includes(s));
        if (filtered.length !== prev.support_types.length) {
          nextSupports = filtered;
          changed = true;
        }
      }

      if (activeProfileDef.typical_needs && activeProfileDef.typical_needs.length > 0) {
        const filtered = prev.functional_needs.filter(n => activeProfileDef.typical_needs!.includes(n));
        if (filtered.length !== prev.functional_needs.length) {
          nextNeeds = filtered;
          changed = true;
        }
      }

      if (activeProfileDef.allowed_life_stages && prev.life_stage) {
        if (!activeProfileDef.allowed_life_stages.includes(prev.life_stage)) {
          nextStage = null;
          changed = true;
        }
      }

      if (!changed && prev.accessibility_needs.length === 0) return prev;
      return {
        ...prev,
        support_types: nextSupports,
        functional_needs: nextNeeds,
        life_stage: nextStage,
        accessibility_needs: []
      };
    });
  }, [query.profile, activeProfileDef]);

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs mb-8 space-y-6">
      {/* 2. Dimensión 1: Perfiles oficiales verificados */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Perfil o condición
          </label>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[...Object.values(CORE_PROFILES), ...Object.values(EXPERIMENTAL_PROFILES), ...Object.values(PENDING_PROFILES)].map((prof) => {
            const isSelected = query.profile === prof.id;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => {
                  const newProfile = isSelected ? null : prof.id;
                  setQuery(prev => {
                    if (!newProfile) {
                      return { ...prev, profile: null, support_types: [], functional_needs: [], accessibility_needs: [] };
                    }
                    const def = getProfileDefinition(newProfile);
                    const allowedStages = def?.allowed_life_stages || [];
                    const nextStage = prev.life_stage && !allowedStages.includes(prev.life_stage) ? null : prev.life_stage;
                    return {
                      ...prev,
                      profile: newProfile,
                      life_stage: nextStage,
                      support_types: [],
                      functional_needs: [],
                      accessibility_needs: []
                    };
                  });
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-900'
                }`}
              >
                <div className="text-xs font-bold">
                  {prof.preferred_label.replace(' (Reserva/Experimental)', '').replace(' (Experimental)', '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-stone-100" />

      {/* Dimensión 2: Tipos de Apoyo (Dinámicos según la taxonomía seleccionada) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Tipos de apoyo
            </label>
            {activeProfileDef && (
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Adaptados a {activeProfileDef.preferred_label.split('(')[0].trim()}
              </span>
            )}
          </div>

          {/* Selector de modo de combinación */}
          <div className="inline-flex p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setQuery(prev => ({ ...prev, support_combination_mode: 'any_support' }))}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                query.support_combination_mode === 'any_support'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cualquier apoyo
            </button>
            <button
              type="button"
              onClick={() => setQuery(prev => ({ ...prev, support_combination_mode: 'all_supports_same_centre' }))}
              title="Exige que todos los apoyos marcados estén confirmados en el mismo centro físico"
              className={`px-2.5 py-1 font-medium rounded-md transition-colors flex items-center gap-1 ${
                query.support_combination_mode === 'all_supports_same_centre'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Todos en la misma sede</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {displayedSupportTypes.map((st) => {
            const isChecked = query.support_types.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => toggleSupport(st.id)}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                  isChecked
                    ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-xs leading-snug">{st.label}</span>
              </button>
            );
          })}
        </div>

        {query.support_combination_mode === 'all_supports_same_centre' && query.support_types.length > 1 && (
          <div className="mt-2 text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-500 shrink-0" />
            <span>
              <strong>Sede unificada activa:</strong> Se comprobarán los apoyos en el mismo centro físico.
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-stone-100" />

      {/* Dimensiones: Etapa Vital, Preferencia de Red y Localización */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Etapa Vital (Dinámica según las etapas autorizadas en la taxonomía) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Etapa vital
            </label>
            {activeProfileDef && (
              <span className="text-[10px] text-stone-500 font-medium">
                {displayedLifeStages.length} autorizada{displayedLifeStages.length === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {displayedLifeStages.map(([key, item]) => {
              const isSelected = query.life_stage === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setQuery(prev => ({
                    ...prev,
                    life_stage: isSelected ? null : (key as LifeStage)
                  }))}
                  className={`px-3 py-2 text-xs rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {item.ageRange}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Titularidad y Red */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
            Red y titularidad
          </label>
          <div className="space-y-1.5 text-xs">
            {[
              { id: 'all', label: 'Todas las titularidades' },
              { id: 'public_network', label: 'Red Pública y Concertada' },
              { id: 'private_authorised', label: 'Privados autorizados' }
            ].map(opt => (
              <label 
                key={opt.id}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  query.network_preference === opt.id
                    ? 'border-stone-900 bg-stone-50 font-medium text-stone-900'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="network_pref"
                  checked={query.network_preference === opt.id}
                  onChange={() => setQuery(prev => ({ ...prev, network_preference: opt.id as NetworkPreference }))}
                  className="accent-stone-900"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Localización territorial y radio */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Ubicación y radio
            </label>
          </div>

          <div className="space-y-2">
            {/* Botón preferido: Usar mi ubicación (§67.1) */}
            <button
              type="button"
              onClick={requestBrowserLocation}
              disabled={geoStatus === 'requesting'}
              className={`w-full py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                query.location_mode === 'browser'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs'
                  : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>
                {geoStatus === 'requesting'
                  ? 'Obteniendo posición...'
                  : query.location_mode === 'browser'
                  ? '✓ Usando tu ubicación actual (GPS)'
                  : 'Usar mi ubicación'}
              </span>
            </button>

            {/* Selector de municipio alternativo (§67.1) */}
            <div>
              <select
                value={query.location_mode === 'municipality' ? (query.municipality || '') : ''}
                onChange={(e) => handleSelectMunicipality(e.target.value)}
                className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:border-stone-900"
              >
                <option value="">Seleccionar municipio para cambiar de origen...</option>
                {municipalities.map((m) => (
                  <option key={m.code} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de radio en kilómetros */}
            <div className="flex items-center gap-2 text-xs text-stone-600 pt-1">
              <span className="shrink-0 font-medium">Radio:</span>
              {[5, 10, 20, 30, 50].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setQuery(prev => ({ ...prev, radius_km: r }))}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    query.radius_km === r
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>

            {/* Indicador de origen de distancias activo (§67) */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
              <MapPin className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              <span>
                <strong className="text-stone-800">Origen de cálculo:</strong>{' '}
                {query.location_mode === 'browser' && query.user_ephemeral_location
                  ? 'Tu ubicación actual (GPS efímero)'
                  : query.municipality
                  ? `${query.municipality} (centroide oficial)`
                  : 'Madrid Centro (Km 0 · Puerta del Sol)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Accesibilidad física */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2.5">
          Accesibilidad física
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ACCESSIBILITY_FEATURES.map((feat) => {
            const isChecked = query.accessibility_needs.includes(feat.id);
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => setQuery(prev => ({
                  ...prev,
                  accessibility_needs: isChecked
                    ? prev.accessibility_needs.filter(id => id !== feat.id)
                    : [...prev.accessibility_needs, feat.id]
                }))}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                  isChecked
                    ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <feat.icon className="w-4 h-4" />
                {feat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Necesidades funcionales transversales (desplegable opcional §50.1) */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvancedNeeds(prev => !prev)}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 focus:outline-none"
        >
          {showAdvancedNeeds ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Necesidades funcionales observables (comunicación, deglución, motricidad, regulación sensorial...)</span>
          {activeProfileDef && (
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {displayedFunctionalNeeds.length} relevantes
            </span>
          )}
          {query.functional_needs.length > 0 && (
            <span className="text-[11px] font-mono text-stone-900 font-bold">
              ({query.functional_needs.length} activas)
            </span>
          )}
        </button>

        {showAdvancedNeeds && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3 pt-3 border-t border-stone-100">
            {displayedFunctionalNeeds.map((need) => {
              const isSelected = query.functional_needs.includes(need.id);
              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => toggleFunctionalNeed(need.id)}
                  className={`p-2 rounded-md border text-left text-xs transition-colors ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white font-medium'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="font-semibold">{need.label}</div>
                  <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {need.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Barra resumen de criterios activos y reset (§62.1) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-stone-800">Criterios acumulativos activos:</span>
          {query.profile && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              {CORE_PROFILES[query.profile as keyof typeof CORE_PROFILES]?.preferred_label || 
               EXPERIMENTAL_PROFILES[query.profile as keyof typeof EXPERIMENTAL_PROFILES]?.preferred_label || 
               PENDING_PROFILES[query.profile as keyof typeof PENDING_PROFILES]?.preferred_label || 
               query.profile}
              <button 
                onClick={() => setQuery(prev => ({ ...prev, profile: null }))}
                className="hover:text-stone-900 ml-1"
              >
                ×
              </button>
            </span>
          )}

          {query.support_types.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              {SUPPORT_TYPES[s]?.label || s}
              <button onClick={() => toggleSupport(s)} className="hover:text-stone-900 ml-1">×</button>
            </span>
          ))}

          {query.life_stage && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              {LIFE_STAGES[query.life_stage]?.label}
              <button onClick={() => setQuery(prev => ({ ...prev, life_stage: null }))} className="hover:text-stone-900 ml-1">×</button>
            </span>
          )}

          {query.municipality && query.location_mode === 'municipality' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              {query.municipality} (±{query.radius_km} km)
              <button onClick={() => setQuery(prev => ({ ...prev, municipality: null, user_ephemeral_location: null, location_mode: 'all' }))} className="hover:text-stone-900 ml-1">×</button>
            </span>
          )}

          {query.location_mode === 'browser' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              Cerca de tu ubicación (±{query.radius_km} km)
              <button onClick={() => setQuery(prev => ({ ...prev, user_ephemeral_location: null, location_mode: 'all' }))} className="hover:text-stone-900 ml-1">×</button>
            </span>
          )}

          {query.accessibility_needs.map(accId => {
            const feat = ACCESSIBILITY_FEATURES.find(f => f.id === accId);
            return (
              <span key={accId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                <span>{feat?.label || accId}</span>
                <button
                  type="button"
                  onClick={() => setQuery(prev => ({
                    ...prev,
                    accessibility_needs: prev.accessibility_needs.filter(id => id !== accId)
                  }))}
                  className="hover:text-stone-900 ml-1"
                >
                  ×
                </button>
              </span>
            );
          })}

          {query.functional_needs.map(fnId => (
            <span key={fnId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
              {FUNCTIONAL_NEEDS[fnId]?.label || fnId}
              <button 
                type="button" 
                onClick={() => toggleFunctionalNeed(fnId)} 
                className="hover:text-stone-900 ml-1"
              >
                ×
              </button>
            </span>
          ))}

          {(!query.profile && 
            query.support_types.length === 0 && 
            !query.life_stage && 
            !query.municipality && 
            !query.user_ephemeral_location &&
            query.accessibility_needs.length === 0 &&
            query.functional_needs.length === 0) && (
            <span className="text-stone-500 italic">Mostrando todos los centros autorizados de la Comunidad de Madrid</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-stone-900">
            {totalResults} {totalResults === 1 ? 'recurso oficial' : 'recursos oficiales'}
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};
