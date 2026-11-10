/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Aplicación Principal
 * Buscador transversal de recursos sociales y sanitarios autorizados de la Comunidad de Madrid
 * DATAMAD 2026 · Código abierto · Orientación, no diagnóstico
 * Cumple estrictamente con el Prompt Maestro v1.7 y la Universal Frontend Design Constitution
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  SearchQueryState, 
  EvaluatedCentreResult, 
  SavedSearch, 
  CitizenCorrection 
} from './types/specialized';
import { SPECIALIZED_CENTRES } from './data/specializedCentresData';
import { runSpecializedSearch } from './utils/specializedEngine';
import { resolveSearchOrigin, OriginReference } from './data/municipalitiesData';
import { SpecializedHeader } from './components/specialized/SpecializedHeader';
import { SpecializedSearchFilters } from './components/specialized/SpecializedSearchFilters';
import { SpecializedResultsList } from './components/specialized/SpecializedResultsList';
import { SpecializedMapView } from './components/specialized/SpecializedMapView';
import { SpecializedComparatorView } from './components/specialized/SpecializedComparatorView';
import { WhyAppearsModal } from './components/specialized/WhyAppearsModal';
import { PrintableContactCardModal } from './components/specialized/PrintableContactCardModal';
import { SavedSearchesModal } from './components/specialized/SavedSearchesModal';
import { WhatChangedModal } from './components/specialized/WhatChangedModal';
import { DisambiguationModal } from './components/specialized/DisambiguationModal';
import { CitizenCorrectionModal } from './components/specialized/CitizenCorrectionModal';
import { EasyReadGlossaryModal } from './components/specialized/EasyReadGlossaryModal';
import { TaxonomyGovernanceView } from './components/specialized/TaxonomyGovernanceView';
import { SpecializedTestsRunnerView } from './components/specialized/SpecializedTestsRunnerView';
import { LifeStageTransitionBanner } from './components/specialized/LifeStageTransitionBanner';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Layers, 
  BookOpen, 
  Building2,
  FileText
} from 'lucide-react';

const DEFAULT_QUERY: SearchQueryState = {
  profile: null,
  functional_needs: [],
  support_types: [],
  support_combination_mode: 'any_support',
  life_stage: null,
  municipality: null,
  radius_km: 25,
  network_preference: 'all',
  accessibility_needs: [],
  user_ephemeral_location: null,
  location_mode: 'all'
};

export default function App() {
  // Pestañas de Madrid Apoyo Especializado: 'search' | 'map' | 'comparator' | 'what_changed' | 'governance' | 'tests'
  const [activeTab, setActiveTab] = useState<string>('search');

  // Estado accesible
  const [easyReadMode, setEasyReadMode] = useState<boolean>(false);

  // Estado acumulativo de la búsqueda con soporte completo de reproducción por URL (§62.1, §62.2)
  const [query, setQuery] = useState<SearchQueryState>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const profile = params.get('profile');
      const municipality = params.get('municipality');
      const radius = params.get('radius');
      const supports = params.get('supports')?.split(',').filter(Boolean) || [];
      const needs = params.get('needs')?.split(',').filter(Boolean) || [];
      const stage = params.get('stage');
      const net = params.get('net');
      const comb = params.get('comb');
      const access = params.get('access')?.split(',').filter(Boolean) || [];
      const locMode = params.get('loc');

      return {
        ...DEFAULT_QUERY,
        profile: profile || null,
        municipality: municipality || null,
        radius_km: radius ? parseInt(radius, 10) : 25,
        support_types: supports as any,
        functional_needs: needs as any,
        life_stage: (stage as any) || null,
        network_preference: (net as any) || 'all',
        support_combination_mode: (comb as any) || 'any_support',
        accessibility_needs: access,
        location_mode: (locMode as any) || 'all'
      };
    }
    return DEFAULT_QUERY;
  });

  // Sincronización transparente de todas las dimensiones en la URL sin almacenar salud ni datos personales (§62.2, LOC-006)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      if (query.profile) params.set('profile', query.profile);
      if (query.municipality) params.set('municipality', query.municipality);
      if (query.radius_km !== 25) params.set('radius', query.radius_km.toString());
      if (query.support_types.length > 0) params.set('supports', query.support_types.join(','));
      if (query.functional_needs.length > 0) params.set('needs', query.functional_needs.join(','));
      if (query.life_stage) params.set('stage', query.life_stage);
      if (query.network_preference !== 'all') params.set('net', query.network_preference);
      if (query.support_combination_mode !== 'any_support') params.set('comb', query.support_combination_mode);
      if (query.accessibility_needs.length > 0) params.set('access', query.accessibility_needs.join(','));
      if (query.location_mode !== 'all') params.set('loc', query.location_mode);
      
      const newQs = params.toString();
      const newUrl = newQs ? `${window.location.pathname}?${newQs}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [
    query.profile, 
    query.municipality, 
    query.radius_km, 
    query.support_types,
    query.functional_needs,
    query.life_stage,
    query.network_preference,
    query.support_combination_mode,
    query.accessibility_needs,
    query.location_mode
  ]);

  // Selección de centros para comparar (hasta 3 centros §15)
  const [comparedCentreIds, setComparedCentreIds] = useState<string[]>([]);
  const [selectedMapCentreId, setSelectedMapCentreId] = useState<string | null>(null);

  // Modales
  const [whyAppearsItem, setWhyAppearsItem] = useState<EvaluatedCentreResult | null>(null);
  const [printableContactItem, setPrintableContactItem] = useState<EvaluatedCentreResult | null>(null);
  const [reportErrorItem, setReportErrorItem] = useState<EvaluatedCentreResult | null>(null);
  const [isSavedSearchesOpen, setIsSavedSearchesOpen] = useState(false);
  const [isWhatChangedOpen, setIsWhatChangedOpen] = useState(false);
  const [isDisambiguationOpen, setIsDisambiguationOpen] = useState<'neurodivergent' | 'psychomotor' | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [dismissedTransition, setDismissedTransition] = useState(false);

  // Contador de búsquedas guardadas
  const [savedCount, setSavedCount] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('madrid_apoyo_saved_searches_v17');
      if (raw) setSavedCount(JSON.parse(raw).length);
    } catch (e) {}
  }, [isSavedSearchesOpen]);

  // Origen de coordenadas para cálculo de distancia garantizado (§67)
  const resolvedOrigin = useMemo<OriginReference>(() => {
    return resolveSearchOrigin(query.user_ephemeral_location, query.municipality, query.location_mode);
  }, [query.user_ephemeral_location, query.municipality, query.location_mode]);

  // Ejecución del motor de búsqueda verificable (§27, §41, §78)
  const searchOutput = useMemo(() => {
    return runSpecializedSearch(query, SPECIALIZED_CENTRES, resolvedOrigin.coordinates);
  }, [query, resolvedOrigin]);

  // Centros en el comparador
  const comparedCentres = useMemo(() => {
    return searchOutput.results.filter(r => comparedCentreIds.includes(r.centre.centre_id));
  }, [searchOutput.results, comparedCentreIds]);

  const toggleCompare = (id: string) => {
    setComparedCentreIds(prev => {
      if (prev.includes(id)) return prev.filter(cId => cId !== id);
      if (prev.length >= 3) {
        alert('Puede comparar un máximo de 3 centros a la vez (§15).');
        return prev;
      }
      return [...prev, id];
    });
  };

  const resetAllFilters = () => {
    setQuery(DEFAULT_QUERY);
    setDismissedTransition(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FBF9F5] text-stone-900 antialiased">
      {/* 1. Header con contrato de barra superior de 3 zonas (§2 de frontend-design) */}
      <SpecializedHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        easyReadMode={easyReadMode}
        setEasyReadMode={setEasyReadMode}
        savedSearchesCount={savedCount}
        openSavedSearches={() => setIsSavedSearchesOpen(true)}
        openGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* 2. Banner institucional de rigor metodológico y no diagnóstico */}
      <section className="bg-stone-900 text-stone-100 py-3.5 px-4 text-xs border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-200">DATAMAD 2026:</span>
            <span className="text-stone-300">
              Buscador transversal por necesidad funcional en registros oficiales de la Comunidad de Madrid.
            </span>
          </div>
          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <span>Orientación verificable · No diagnóstico ni recomendación médica</span>
            <span>·</span>
            <span className="font-mono text-stone-300">Taxonomía v1.7.0</span>
          </div>
        </div>
      </section>

      {/* 3. Contenedor principal de vistas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* PESTAÑA: BÚSQUEDA Y RESULTADOS */}
        {activeTab === 'search' && (
          <div>
            {/* Aviso de transición vital si la etapa seleccionada lo prevé (§85) */}
            {!dismissedTransition && (
              <LifeStageTransitionBanner
                currentLifeStage={query.life_stage}
                onTransitionToNextStage={(next) => {
                  setQuery(prev => ({ ...prev, life_stage: next }));
                }}
                onDismiss={() => setDismissedTransition(true)}
              />
            )}

            {/* Filtros acumulativos con lógica AND entre dimensiones y OR en apoyos */}
            <SpecializedSearchFilters
              query={query}
              setQuery={setQuery}
              totalResults={searchOutput.total_results}
              onOpenDisambiguation={(term) => setIsDisambiguationOpen(term)}
              onResetFilters={resetAllFilters}
            />

            {/* Lista de resultados agrupados por nivel de evidencia A1/A2, B1/B2 y C */}
            <SpecializedResultsList
              results={searchOutput.results}
              incompatibleResults={searchOutput.incompatible_results}
              query={query}
              onWhyAppears={(item) => setWhyAppearsItem(item)}
              onPrepareContact={(item) => setPrintableContactItem(item)}
              onReportError={(item) => setReportErrorItem(item)}
              comparedIds={comparedCentreIds}
              onToggleCompare={toggleCompare}
              onResetFilters={resetAllFilters}
              easyReadMode={easyReadMode}
            />
          </div>
        )}

        {/* PESTAÑA: MAPA SINCRONIZADO (§63) */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Mapa territorial sincronizado con los filtros
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Los marcadores reflejan exactamente los recursos filtrados. La cercanía nunca sitúa un resultado C por delante de un nivel A (§63).
                </p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Volver a la lista
              </button>
            </div>

            <SpecializedMapView
              results={searchOutput.results}
              selectedCentreId={selectedMapCentreId}
              onSelectCentre={(id) => setSelectedMapCentreId(id)}
              onWhyAppears={(item) => setWhyAppearsItem(item)}
              originCoords={resolvedOrigin.coordinates}
              originName={resolvedOrigin.name}
              radiusKm={query.radius_km}
            />
          </div>
        )}

        {/* PESTAÑA: COMPARADOR CIUDADANO (§15) */}
        {activeTab === 'comparator' && (
          <SpecializedComparatorView
            comparedCentres={comparedCentres}
            onRemoveFromCompare={toggleCompare}
            onClearCompare={() => setComparedCentreIds([])}
            onGoToSearch={() => setActiveTab('search')}
            onWhyAppears={(item) => setWhyAppearsItem(item)}
          />
        )}

        {/* PESTAÑA: QUÉ HA CAMBIADO (§84) */}
        {activeTab === 'what_changed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Auditoría de cambios entre snapshots del registro oficial
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Trazabilidad de altas, servicios incorporados, vigencia de disponibilidad caducada e incidencias técnicas.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Ir al buscador
              </button>
            </div>
            <WhatChangedModal isOpen={true} onClose={() => setActiveTab('search')} />
          </div>
        )}

        {/* PESTAÑA: GOBERNANZA TAXONÓMICA Y UTILIDAD ADMINISTRATIVA (§33, §58) */}
        {activeTab === 'governance' && (
          <TaxonomyGovernanceView />
        )}

        {/* PESTAÑA: PRUEBAS CANÓNICAS EN VIVO (§31, §44, §79, §90) */}
        {activeTab === 'tests' && (
          <SpecializedTestsRunnerView />
        )}
      </main>

      {/* 4. Modales del sistema */}
      {whyAppearsItem && (
        <WhyAppearsModal
          item={whyAppearsItem}
          onClose={() => setWhyAppearsItem(null)}
        />
      )}

      {printableContactItem && (
        <PrintableContactCardModal
          item={printableContactItem}
          onClose={() => setPrintableContactItem(null)}
        />
      )}

      {reportErrorItem && (
        <CitizenCorrectionModal
          item={reportErrorItem}
          onClose={() => setReportErrorItem(null)}
          onSuccess={(corr) => {
            // Guardar en log local
          }}
        />
      )}

      <SavedSearchesModal
        isOpen={isSavedSearchesOpen}
        onClose={() => setIsSavedSearchesOpen(false)}
        currentQuery={query}
        onLoadSearch={(filters) => {
          setQuery(prev => ({
            ...prev,
            ...filters,
            user_ephemeral_location: null,
            location_mode: filters.municipality ? 'municipality' : 'all'
          }));
        }}
        onOpenWhatChanged={() => {
          setIsSavedSearchesOpen(false);
          setIsWhatChangedOpen(true);
        }}
      />

      <WhatChangedModal
        isOpen={isWhatChangedOpen}
        onClose={() => setIsWhatChangedOpen(false)}
      />

      <DisambiguationModal
        term={isDisambiguationOpen}
        onClose={() => setIsDisambiguationOpen(null)}
        setQuery={setQuery}
      />

      <EasyReadGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* 5. Pie de página institucional sobrio (Zero-Pill Discipline) */}
      <footer className="mt-auto border-t border-stone-200 bg-white text-stone-600 text-xs py-8 px-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-bold text-stone-900 text-sm">
              Madrid Apoyo Especializado v1.7 · DATAMAD 2026
            </div>
            <p className="text-stone-500 max-w-2xl leading-relaxed">
              Buscador transversal de recursos sociales y sanitarios autorizados de la Comunidad de Madrid. Código abierto bajo licencia EUPL-1.2 / Apache-2.0. Sin cookies de seguimiento, sin perfiles personales ni almacenamiento de datos de salud (Sección 30).
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-stone-700">
            <button
              onClick={() => setActiveTab('governance')}
              className="hover:text-stone-950 underline underline-offset-2"
            >
              Gobernanza Taxonómica
            </button>
            <button
              onClick={() => setActiveTab('what_changed')}
              className="hover:text-stone-950 underline underline-offset-2"
            >
              Histórico de Cambios
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className="hover:text-stone-950 underline underline-offset-2 font-mono"
            >
              Suite Canónica (35 tests)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
