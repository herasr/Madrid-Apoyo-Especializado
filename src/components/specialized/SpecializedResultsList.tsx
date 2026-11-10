/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Results List Container
 * Resultados agrupados por fuerza de evidencia A1/A2, B1/B2 y C (§37.1)
 * Manejo estricto de incertidumbre y cero resultados sin relajar en silencio (§38).
 */

import React, { useState } from 'react';
import { EvaluatedCentreResult, SearchQueryState } from '../../types/specialized';
import { SpecializedCentreCard } from './SpecializedCentreCard';
import { 
  AlertCircle, 
  RotateCcw, 
  MapPin, 
  List, 
  Layers, 
  ShieldAlert, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  Download,
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface ResultsListProps {
  results: EvaluatedCentreResult[];
  incompatibleResults: EvaluatedCentreResult[];
  query: SearchQueryState;
  onWhyAppears: (item: EvaluatedCentreResult) => void;
  onPrepareContact: (item: EvaluatedCentreResult) => void;
  comparedIds: string[];
  onToggleCompare: (centreId: string) => void;
  onResetFilters: () => void;
  easyReadMode: boolean;
}

export const SpecializedResultsList: React.FC<ResultsListProps> = ({
  results,
  incompatibleResults,
  query,
  onWhyAppears,
  onPrepareContact,
  comparedIds,
  onToggleCompare,
  onResetFilters,
  easyReadMode
}) => {
  const [showIncompatibles, setShowIncompatibles] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Copiar enlace reproducibilidad de la búsqueda completa
  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Descarga CSV de resultados con trazabilidad y procedencia de atributos
  const handleExportCSV = () => {
    const headers = [
      'ID Centro',
      'Nombre Oficial',
      'Municipio',
      'Distrito',
      'Nivel Evidencia',
      'Adecuación',
      'Distancia (km)',
      'Titularidad',
      'Tipo Centro',
      'Subtipo',
      'Apoyos Confirmados',
      'Trazabilidad Registral'
    ];

    const rows = results.map(r => [
      `"${r.centre.centre_id}"`,
      `"${r.centre.official_name.replace(/"/g, '""')}"`,
      `"${r.centre.municipality}"`,
      `"${r.centre.district || ''}"`,
      `"${r.evidence_level}"`,
      `"${r.suitability}"`,
      `"${r.distance_km !== null ? r.distance_km.toFixed(1) : 'Sin coords'}"`,
      `"${r.centre.public_private_status}"`,
      `"${r.centre.centre_type}"`,
      `"${r.centre.subtype || ''}"`,
      `"${r.centre.supports.join('; ')}"`,
      `"${r.centre.provenance_records.map(p => `${p.attribute_name}:${p.source_dataset}`).join('; ')}"`
    ]);

    const csvStr = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `madrid_apoyo_especializado_resultados_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descarga JSON estructurado con datos completos
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `madrid_apoyo_especializado_resultados_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Agrupación permanente por nivel de evidencia (§37.1, §77)
  const groupA = results.filter(r => r.evidence_level === 'A1' || r.evidence_level === 'A2');
  const groupB = results.filter(r => r.evidence_level === 'B1' || r.evidence_level === 'B2');
  const groupC = results.filter(r => r.evidence_level === 'C');

  // Si no hay resultados (§38: Diseño para incertidumbre y ausencia de resultados)
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-xs text-center max-w-xl mx-auto my-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900">
          No consta especialización en las fuentes consultadas
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
          Ningún centro autorizado de la Comunidad de Madrid cumple simultáneamente todos los criterios seleccionados con los filtros actuales.
        </p>

        {/* Alternativas estructuradas (§38) */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-2 text-stone-700">
          <div className="font-bold text-stone-800">Alternativas recomendadas:</div>
          <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
            {query.radius_km < 50 && (
              <li>Ampliar el radio geográfico de búsqueda (actualmente en {query.radius_km} km).</li>
            )}
            {query.support_combination_mode === 'all_supports_same_centre' && (
              <li>Cambiar el modo de combinación a «Cualquier apoyo» para permitir servicios coordinados en distintas sedes.</li>
            )}
            <li>Retirar el filtro de titularidad para incluir centros privados autorizados o de la red pública.</li>
          </ul>
        </div>

        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer criterios de búsqueda</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de cabecera de la lista con exportaciones y compartir */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-stone-900">
            Resultados de la búsqueda
          </h2>
          <span className="text-xs font-mono font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
            {results.length} {results.length === 1 ? 'recurso' : 'recursos'}
          </span>
        </div>

        {/* Acciones de exportación y enlace compartible */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <button
            onClick={handleCopyShareLink}
            className="px-2.5 py-1 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1"
            title="Copiar enlace URL con todos los criterios de esta búsqueda"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3 text-stone-600" />}
            <span>{copiedLink ? '¡Enlace copiado!' : 'Compartir búsqueda'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg font-medium transition-colors flex items-center gap-1"
            title="Exportar resultados en formato CSV con fuentes y procedencia"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-stone-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-2.5 py-1 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg font-medium transition-colors flex items-center gap-1"
            title="Exportar estructurado completo en JSON"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Grupo A: Especialización publicada (A1 y A2) */}
        {groupA.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900">
                  Especialización Publicada ({groupA.length})
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">
                Mención en registro oficial
              </span>
            </div>

            <div className="space-y-4">
              {groupA.map((item) => (
                <SpecializedCentreCard
                  key={item.centre.centre_id}
                  item={item}
                  onWhyAppears={onWhyAppears}
                  onPrepareContact={onPrepareContact}
                  isCompared={comparedIds.includes(item.centre.centre_id)}
                  onToggleCompare={onToggleCompare}
                  easyReadMode={easyReadMode}
                />
              ))}
            </div>
          </section>
        )}

        {/* Grupo B: Servicios relacionados (B1 y B2) */}
        {groupB.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <h3 className="text-sm font-bold text-stone-900">
                  Servicios Relacionados ({groupB.length})
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">
                Recursos del sector relacionado
              </span>
            </div>

            <div className="space-y-4">
              {groupB.map((item) => (
                <SpecializedCentreCard
                  key={item.centre.centre_id}
                  item={item}
                  onWhyAppears={onWhyAppears}
                  onPrepareContact={onPrepareContact}
                  isCompared={comparedIds.includes(item.centre.centre_id)}
                  onToggleCompare={onToggleCompare}
                  easyReadMode={easyReadMode}
                />
              ))}
            </div>
          </section>
        )}

        {/* Grupo C: Orientación potencial */}
        {groupC.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                <h3 className="text-sm font-bold text-stone-900">
                  Orientación General ({groupC.length})
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">
                Sector asistencial compatible
              </span>
            </div>

            <div className="space-y-4">
              {groupC.map((item) => (
                <SpecializedCentreCard
                  key={item.centre.centre_id}
                  item={item}
                  onWhyAppears={onWhyAppears}
                  onPrepareContact={onPrepareContact}
                  isCompared={comparedIds.includes(item.centre.centre_id)}
                  onToggleCompare={onToggleCompare}
                  easyReadMode={easyReadMode}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Nota de trazabilidad registral discreta */}
      <div className="pt-4 pb-2 border-t border-stone-200 text-center">
        <span className="text-[11px] text-stone-400 font-mono">
          DATAMAD 2026 · Registros RECESS / Red Social CAM
        </span>
      </div>

      {/* 4. Sección de Centros Incompatibles Excluidos de la Lista Principal (§78) */}
      {incompatibleResults.length > 0 && (
        <div className="pt-6 border-t border-stone-200">
          <button
            type="button"
            onClick={() => setShowIncompatibles(prev => !prev)}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center justify-between w-full p-3 rounded-lg bg-stone-100 border border-stone-200"
          >
            <span>
              Recursos excluidos por incompatibilidad de criterios ({incompatibleResults.length})
            </span>
            {showIncompatibles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showIncompatibles && (
            <div className="space-y-3 mt-3">
              {incompatibleResults.map((item) => (
                <div key={item.centre.centre_id} className="opacity-75">
                  <SpecializedCentreCard
                    item={item}
                    onWhyAppears={onWhyAppears}
                    onPrepareContact={onPrepareContact}
                    isCompared={comparedIds.includes(item.centre.centre_id)}
                    onToggleCompare={onToggleCompare}
                    easyReadMode={easyReadMode}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
