/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Comparador Ciudadano
 * Matriz comparativa objetiva de hasta 3 centros sin rankings asistenciales, podios ni estrellas (§15)
 */

import React from 'react';
import { SpecializedCentre, EvaluatedCentreResult } from '../../types/specialized';
import { SUPPORT_TYPES, LIFE_STAGES } from '../../data/specializedTaxonomy';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  Phone, 
  ExternalLink,
  Plus,
  Printer
} from 'lucide-react';

interface ComparatorViewProps {
  comparedCentres: EvaluatedCentreResult[];
  onRemoveFromCompare: (centreId: string) => void;
  onClearCompare: () => void;
  onGoToSearch: () => void;
  onWhyAppears: (item: EvaluatedCentreResult) => void;
}

export const SpecializedComparatorView: React.FC<ComparatorViewProps> = ({
  comparedCentres,
  onRemoveFromCompare,
  onClearCompare,
  onGoToSearch,
  onWhyAppears
}) => {
  if (comparedCentres.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
        <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <h3 className="text-base font-bold text-stone-900 mb-1">
          No hay centros seleccionados para comparar
        </h3>
        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          En la lista de resultados de búsqueda, marque la casilla «Comparar» en hasta 3 centros autorizados para contrastar sus evidencias oficiales, apoyos y vías de acceso.
        </p>
        <button
          onClick={onGoToSearch}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-xs font-semibold transition-colors"
        >
          Ir al buscador de recursos
        </button>
      </div>
    );
  }

  const dimensions = [
    {
      title: 'Nivel de evidencia asignado',
      render: (item: EvaluatedCentreResult) => (
        <div>
          <span className="font-bold text-stone-900 font-mono text-sm">{item.evidence_level}</span>
          <div className="text-[11px] text-stone-600 mt-0.5">
            {item.evidence_level === 'A1' && 'Especialización y apoyo publicados'}
            {item.evidence_level === 'A2' && 'Especialización publicada (apoyo a confirmar)'}
            {item.evidence_level === 'B1' && 'Servicios relacionados (especialización no confirmada)'}
            {item.evidence_level === 'B2' && 'Posible recurso (requiere confirmación)'}
            {item.evidence_level === 'C' && 'Orientación general compatible'}
          </div>
        </div>
      )
    },
    {
      title: 'Adecuación a la búsqueda',
      render: (item: EvaluatedCentreResult) => (
        <div>
          <span className="font-semibold text-stone-800">
            {item.suitability === 'complete' && 'Coincidencia completa'}
            {item.suitability === 'partial' && 'Coincidencia parcial'}
            {item.suitability === 'incompatible' && 'Incompatible'}
            {item.suitability === 'unknown' && 'Sin datos suficientes'}
          </span>
          <div className="text-[11px] font-mono font-medium text-stone-600 mt-0.5 space-y-0.5">
            <div>{item.distance_label}</div>
            {item.transit_time_label && (
              <div className="text-blue-800 font-semibold">{item.transit_time_label}</div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Apoyos confirmados en esta sede',
      render: (item: EvaluatedCentreResult) => (
        <div className="space-y-1">
          {item.centre.supports.map(s => (
            <div key={s} className="text-stone-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
              <span>{SUPPORT_TYPES[s]?.label || s}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Plazas autorizadas en registro',
      render: (item: EvaluatedCentreResult) => (
        <div>
          <span className="font-mono font-bold text-stone-900">
            {item.centre.availability.authorised_places !== null 
              ? `${item.centre.availability.authorised_places} plazas` 
              : 'No publicadas'}
          </span>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Capacidad oficial máxima. No confundir con vacantes disponibles.
          </div>
        </div>
      )
    },
    {
      title: 'Titularidad y Red',
      render: (item: EvaluatedCentreResult) => (
        <div>
          <span className="font-semibold text-stone-800">
            {item.centre.public_private_status === 'red_publica'
              ? 'Red Pública Directa'
              : item.centre.public_private_status === 'concertado'
              ? 'Plazas Públicas Concertadas'
              : 'Privado autorizado'}
          </span>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {item.centre.provider_name}
          </div>
        </div>
      )
    },
    {
      title: 'Vía de acceso oficial',
      render: (item: EvaluatedCentreResult) => (
        <div>
          <span className="font-semibold text-stone-900">
            {item.centre.access_route.access_type === 'dependency_pia' && 'Resolución de PIA (Dependencia)'}
            {item.centre.access_route.access_type === 'referral' && 'Derivación médica / hospitalaria'}
            {item.centre.access_route.access_type === 'direct' && 'Acceso directo'}
            {item.centre.access_route.access_type === 'private_contact' && 'Admisión privada'}
            {item.centre.access_route.access_type === 'unknown' && 'Debe confirmarse'}
          </span>
          <p className="text-[11px] text-stone-600 mt-1 leading-snug">
            {item.centre.access_route.next_step_action}
          </p>
        </div>
      )
    },
    {
      title: 'Etapas vitales autorizadas',
      render: (item: EvaluatedCentreResult) => (
        <div className="text-stone-700">
          {item.centre.allowed_life_stages.map(s => LIFE_STAGES[s]?.label).join(', ')}
        </div>
      )
    },
    {
      title: 'Cobertura territorial',
      render: (item: EvaluatedCentreResult) => (
        <div className="text-stone-700">
          {item.centre.geographic_coverage.type === 'community_wide' && 'Toda la Comunidad de Madrid'}
          {item.centre.geographic_coverage.type === 'multiple_municipalities' && 'Varios municipios asignados'}
          {item.centre.geographic_coverage.type === 'district' && 'Distrito o área sanitaria'}
          {item.centre.geographic_coverage.type === 'municipality' && `Municipio de ${item.centre.municipality}`}
          {item.centre.geographic_coverage.type === 'on_site_only' && 'Presencial en el centro'}
        </div>
      )
    },
    {
      title: 'Contacto oficial',
      render: (item: EvaluatedCentreResult) => (
        <div className="space-y-1">
          <div className="font-medium text-stone-800">{item.centre.address}</div>
          <div className="text-stone-600">{item.centre.phone}</div>
          {item.centre.website && (
            <a 
              href={item.centre.website}
              target="_blank" 
              rel="noreferrer"
              className="text-stone-900 underline inline-flex items-center gap-1 hover:text-stone-700"
            >
              <span>Sitio web oficial</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabecera del comparador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            Comparador Ciudadano de Recursos
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Contraste de atributos oficiales según registro vigente. Sin rankings asistenciales, valoraciones privadas ni asignación de notas (§15).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white border border-stone-300 text-stone-800 rounded-lg text-xs font-semibold hover:bg-stone-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
            title="Imprimir o guardar como informe PDF profesional para familias u organismos"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Imprimir / Exportar Informe (PDF)</span>
          </button>

          <button
            onClick={onClearCompare}
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            Limpiar comparación
          </button>

          <button
            onClick={onGoToSearch}
            className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Añadir más centros
          </button>
        </div>
      </div>

      {/* Matriz comparativa */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="p-4 w-1/4 min-w-[180px] font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Dimensión objetiva
              </th>
              {comparedCentres.map((item) => (
                <th key={item.centre.centre_id} className="p-4 w-1/3 min-w-[240px] align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm leading-snug">
                        {item.centre.official_name}
                      </h4>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.centre.municipality} · {item.centre.centre_id}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCompare(item.centre.centre_id)}
                      className="text-stone-400 hover:text-stone-700 p-1"
                      title="Quitar del comparador"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => onWhyAppears(item)}
                    className="mt-2 text-[11px] text-stone-800 font-semibold underline hover:text-stone-600 block"
                  >
                    Ver por qué aparece
                  </button>
                </th>
              ))}
              {comparedCentres.length < 3 && (
                <th className="p-4 bg-stone-50/50 border-l border-dashed border-stone-200 text-center align-middle">
                  <button
                    onClick={onGoToSearch}
                    className="p-4 rounded-lg border border-dashed border-stone-300 text-stone-500 hover:text-stone-800 hover:border-stone-400 text-center inline-flex flex-col items-center gap-1 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Añadir 3er centro</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {dimensions.map((dim, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}>
                <td className="p-4 font-bold text-stone-800 bg-stone-50/60 border-r border-stone-200">
                  {dim.title}
                </td>
                {comparedCentres.map((item) => (
                  <td key={item.centre.centre_id} className="p-4 align-top">
                    {dim.render(item)}
                  </td>
                ))}
                {comparedCentres.length < 3 && <td className="p-4 bg-stone-50/30 border-l border-dashed border-stone-200" />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
