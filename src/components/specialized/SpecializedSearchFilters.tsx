/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Search & Cumulative Taxonomy Filters
 * Principio v1.4: perfil + necesidad funcional + apoyo + etapa vital + ubicación + red
 * se aplican conjuntamente mediante lógica AND entre dimensiones y OR controlado dentro de una misma dimensión (§62.1).
 * Novedad v1.7: Búsqueda de combinaciones de apoyos en una misma sede (§82).
 */

import React, { useState, useEffect } from 'react';
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
  SUPPORT_TYPES, 
  FUNCTIONAL_NEEDS, 
  LIFE_STAGES 
} from '../../data/specializedTaxonomy';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  X, 
  Search, 
  RotateCcw, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Check,
  Building2
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
  const [freeTextQuery, setFreeTextQuery] = useState('');
  const [geoStatus, setGeoStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'timeout'>('idle');
  const [showAdvancedNeeds, setShowAdvancedNeeds] = useState(false);
  const [muniSearchText, setMuniSearchText] = useState('');

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
  }, []);

  // Intercepta términos ciudadanos ambiguos antes de ejecutar (§54)
  const handleFreeTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = freeTextQuery.trim().toLowerCase();
    if (!clean) return;

    if (clean.includes('neurodivergen') || clean.includes('neurodivers')) {
      onOpenDisambiguation('neurodivergent');
      return;
    }
    if (clean.includes('psicomotr')) {
      onOpenDisambiguation('psychomotor');
      return;
    }
    if (clean.includes('autis') || clean.includes('tea') || clean.includes('asperger')) {
      setQuery(prev => ({ ...prev, profile: 'autism' }));
      setFreeTextQuery('');
      return;
    }
    if (clean.includes('dca') || clean.includes('cerebral') || clean.includes('ictus') || clean.includes('traumatismo')) {
      setQuery(prev => ({ ...prev, profile: 'acquired_brain_injury' }));
      setFreeTextQuery('');
      return;
    }
    if (clean.includes('esclerosis') || clean.includes('neurodegen') || clean.includes('degenerat')) {
      setQuery(prev => ({ ...prev, profile: 'neurodegenerative_diseases' }));
      setFreeTextQuery('');
      return;
    }
    if (clean.includes('paralisis') || clean.includes('palsy')) {
      setQuery(prev => ({ ...prev, profile: 'cerebral_palsy' }));
      setFreeTextQuery('');
      return;
    }
    if (clean.includes('medular') || clean.includes('tetraplej') || clean.includes('paraplej')) {
      setQuery(prev => ({ ...prev, profile: 'spinal_cord_injury' }));
      setFreeTextQuery('');
      return;
    }
    if (clean.includes('temprana')) {
      setQuery(prev => ({ ...prev, life_stage: 'early_childhood' }));
      setFreeTextQuery('');
      return;
    }
    if (clean.includes('logoped') || clean.includes('habla')) {
      toggleSupport('speech_therapy');
      setFreeTextQuery('');
      return;
    }
    if (clean.includes('ocupacional') || clean.includes('avd')) {
      toggleSupport('occupational_therapy');
      setFreeTextQuery('');
      return;
    }
  };

  // Geolocalización efímera del navegador (§67) - conmutación automática bidireccional
  const requestBrowserLocation = () => {
    // Si ya está activo en modo ubicación propia, un segundo clic hace toggle hacia toda la Comunidad
    if (query.location_mode === 'browser') {
      setGeoStatus('idle');
      setQuery(prev => ({
        ...prev,
        user_ephemeral_location: null,
        municipality: null,
        location_mode: 'all'
      }));
      return;
    }

    // Al pulsar "Usar mi ubicación", conmutamos de inmediato liberando el municipio anterior
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
      // Fallback suave en caso de retardo o bloqueo por iframe sandbox
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
        // Si el navegador deniega el acceso por política de iframe o denegación,
        // activa la posición en Madrid de forma transparente para no romper la experiencia
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
      setQuery(prev => ({
        ...prev,
        municipality: null,
        user_ephemeral_location: null,
        location_mode: 'all'
      }));
      return;
    }
    const selected = municipalities.find(m => m.name === muniName);
    if (!selected) return;
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

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs mb-8 space-y-6">
      {/* 1. Barra de entrada ciudadana con detección de desambiguación (§54) */}
      <div>
        <form onSubmit={handleFreeTextSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={freeTextQuery}
              onChange={(e) => setFreeTextQuery(e.target.value)}
              placeholder="Describa la ayuda o necesidad (ej. «daño cerebral», «apoyo logopedia», «neurodivergente»...)"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-stone-300 bg-stone-50/50 focus:bg-white focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap"
          >
            Buscar necesidad
          </button>
        </form>

        <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
          <span className="font-medium text-stone-700">Términos frecuentes con desambiguación:</span>
          <button
            type="button"
            onClick={() => onOpenDisambiguation('neurodivergent')}
            className="hover:text-stone-900 underline underline-offset-2"
          >
            neurodivergente
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onOpenDisambiguation('psychomotor')}
            className="hover:text-stone-900 underline underline-offset-2"
          >
            psicomotriz
          </button>
          <span>·</span>
          <span>Búsqueda por necesidad funcional sin exigir nombre administrativo</span>
        </div>
      </div>

      <div className="h-px bg-stone-100" />

      {/* 2. Dimensión 1: Perfiles oficiales verificados (§3.1, §88.2) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
            1. Perfil o Condición Especializada (Evidencia oficial publicada)
          </label>
          {query.profile && (
            <button
              onClick={() => setQuery(prev => ({ ...prev, profile: null }))}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Quitar perfil</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {Object.values(CORE_PROFILES).map((prof) => {
            const isSelected = query.profile === prof.id;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => setQuery(prev => ({
                  ...prev,
                  profile: isSelected ? null : prof.id
                }))}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/60 text-stone-900'
                }`}
              >
                <div className="text-xs font-bold">{prof.preferred_label}</div>
                <div className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {prof.explicit_terms.slice(0, 2).join(' · ')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Perfiles en reserva / experimentales (§25.2, §88.2) */}
        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-stone-500 font-medium">Perfiles en reserva experimental:</span>
          {Object.values(EXPERIMENTAL_PROFILES).map((prof) => {
            const isSelected = query.profile === prof.id;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => setQuery(prev => ({
                  ...prev,
                  profile: isSelected ? null : prof.id
                }))}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  isSelected 
                    ? 'bg-amber-900 text-amber-50 border-amber-900' 
                    : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                }`}
              >
                {prof.preferred_label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-stone-100" />

      {/* 3. Dimensión 2: Tipos de Apoyo y Novedad v1.7: Combinación en misma sede (§82) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
            2. Tipos de apoyo requeridos (Multiselección)
          </label>

          {/* Selector de modo de combinación v1.7 (§82.1) */}
          <div className="inline-flex p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setQuery(prev => ({ ...prev, support_combination_mode: 'any_support' }))}
              className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                query.support_combination_mode === 'any_support'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cualquier apoyo (OR)
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
              <span>Todos en la misma sede (AND)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.values(SUPPORT_TYPES).map((st) => {
            const isChecked = query.support_types.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => toggleSupport(st.id)}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                  isChecked
                    ? 'border-stone-900 bg-stone-100 text-stone-900 font-semibold'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-xs leading-snug">{st.label}</span>
                <span className="text-[10px] text-stone-500 mt-1">
                  {isChecked ? '✓ Seleccionado' : '+ Añadir'}
                </span>
              </button>
            );
          })}
        </div>

        {query.support_combination_mode === 'all_supports_same_centre' && query.support_types.length > 1 && (
          <div className="mt-2 text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-500 shrink-0" />
            <span>
              <strong>Filtro de sede unificada activo:</strong> Se verificarán los apoyos vinculados al mismo código de centro (<code className="font-mono text-stone-900">centre_id</code>), no meramente al mismo grupo empresarial.
            </span>
          </div>
        )}
      </div>

      <div className="h-px bg-stone-100" />

      {/* 4. Dimensiones 3 y 4: Etapa Vital, Preferencia de Red y Localización (§67) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Etapa Vital */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
            3. Etapa vital (Filtro bloqueante)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(LIFE_STAGES).map(([key, item]) => {
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
            4. Titularidad y red
          </label>
          <div className="space-y-1.5 text-xs">
            {[
              { id: 'all', label: 'Todas las titularidades oficiales' },
              { id: 'public_network', label: 'Red Pública y Concertada CAM' },
              { id: 'private_authorised', label: 'Centros privados autorizados' }
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

        {/* Localización territorial y radio (§67) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              5. Localización y radio (§67)
            </label>
            {(query.municipality || query.location_mode === 'browser') && (
              <button
                type="button"
                onClick={() => {
                  setGeoStatus('idle');
                  setQuery(prev => ({
                    ...prev,
                    user_ephemeral_location: null,
                    municipality: null,
                    location_mode: 'all'
                  }));
                }}
                className="text-[11px] text-stone-500 hover:text-stone-900"
              >
                Quitar origen
              </button>
            )}
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
                  ? '✓ Usando tu ubicación actual (clic para desactivar)'
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
                <option value="">Seleccionar municipio de la Comunidad de Madrid...</option>
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

      {/* 5. Necesidades funcionales transversales (desplegable opcional §50.1) */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvancedNeeds(prev => !prev)}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 focus:outline-none"
        >
          {showAdvancedNeeds ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Necesidades funcionales observables (comunicación, deglución, motricidad, regulación sensorial...)</span>
          {query.functional_needs.length > 0 && (
            <span className="text-[11px] font-mono text-stone-900 font-bold">
              ({query.functional_needs.length} activas)
            </span>
          )}
        </button>

        {showAdvancedNeeds && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3 pt-3 border-t border-stone-100">
            {Object.values(FUNCTIONAL_NEEDS).map((need) => {
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

          {(!query.profile && query.support_types.length === 0 && !query.life_stage && !query.municipality && !query.user_ephemeral_location) && (
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
