/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Verified Centre Result Card
 * Disciplina Zero-Pill, orden lexicográfico y explicabilidad estricta (§14, §27, §42)
 */

import React from 'react';
import { EvaluatedCentreResult } from '../../types/specialized';
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  Printer, 
  FileCheck2, 
  ShieldAlert, 
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { LIFE_STAGES } from '../../data/specializedTaxonomy';

interface CentreCardProps {
  item: EvaluatedCentreResult;
  onWhyAppears: (item: EvaluatedCentreResult) => void;
  onPrepareContact: (item: EvaluatedCentreResult) => void;
  onReportError: (item: EvaluatedCentreResult) => void;
  isCompared: boolean;
  onToggleCompare: (centreId: string) => void;
  easyReadMode: boolean;
}

export const SpecializedCentreCard: React.FC<CentreCardProps> = ({
  item,
  onWhyAppears,
  onPrepareContact,
  onReportError,
  isCompared,
  onToggleCompare,
  easyReadMode
}) => {
  const { centre, match_assessment, evidence_level, suitability, combination_status, distance_label } = item;

  // Texto oficial por nivel de evidencia (§27)
  const evidenceConfig: Record<string, { label: string; textClass: string; bgClass: string; borderClass: string; icon: any }> = {
    A1: {
      label: 'Nivel A1 · Especialización y apoyo publicados',
      textClass: 'text-emerald-900',
      bgClass: 'bg-emerald-50/80',
      borderClass: 'border-emerald-200',
      icon: CheckCircle2
    },
    A2: {
      label: 'Nivel A2 · Especialización publicada (apoyo a confirmar)',
      textClass: 'text-teal-900',
      bgClass: 'bg-teal-50/80',
      borderClass: 'border-teal-200',
      icon: CheckCircle2
    },
    B1: {
      label: 'Nivel B1 · Servicios relacionados (especialización no confirmada)',
      textClass: 'text-sky-900',
      bgClass: 'bg-sky-50/80',
      borderClass: 'border-sky-200',
      icon: HelpCircle
    },
    B2: {
      label: 'Nivel B2 · Posible recurso (requiere confirmación)',
      textClass: 'text-indigo-900',
      bgClass: 'bg-indigo-50/80',
      borderClass: 'border-indigo-200',
      icon: HelpCircle
    },
    C: {
      label: 'Nivel C · Orientación general (no consta especialización)',
      textClass: 'text-stone-700',
      bgClass: 'bg-stone-50',
      borderClass: 'border-stone-200',
      icon: HelpCircle
    }
  };

  const evConfig = evidenceConfig[evidence_level] || evidenceConfig.C;
  const EvIcon = evConfig.icon;

  return (
    <article className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
      {/* 1. Cabecera de la tarjeta: Título oficial directo (Zero-Pill Discipline) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
            {centre.official_name}
          </h3>
          
          {/* Metadatos sin cajas de píldoras: texto limpio con separadores tipográficos '·' (§1.A) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 flex-wrap">
            <span className="font-semibold text-stone-700">{centre.municipality}</span>
            {centre.district && (
              <>
                <span aria-hidden="true">·</span>
                <span>Distrito {centre.district}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{centre.subtype || centre.centre_type}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium">
              {centre.public_private_status === 'red_publica'
                ? 'Red Pública Directa CAM'
                : centre.public_private_status === 'concertado'
                ? 'Red Pública Concertada'
                : 'Privado autorizado'}
            </span>
            {distance_label && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-stone-900 font-bold inline-flex items-center gap-1 bg-stone-100/80 px-1.5 py-0.5 rounded">
                  <MapPin className="w-3 h-3 text-stone-500 inline" />
                  {distance_label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Checkbox comparador (hasta 3 centros) */}
        <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer self-start shrink-0 p-1 rounded hover:bg-stone-50">
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => onToggleCompare(centre.centre_id)}
            className="rounded border-stone-300 accent-stone-900 cursor-pointer"
          />
          <span className="select-none font-medium">Comparar</span>
        </label>
      </div>

      {/* 2. Barra de Evidencia y Adecuación (con texto e icono para accesibilidad A11Y-001) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
        {/* Nivel de Evidencia */}
        <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${evConfig.bgClass} ${evConfig.borderClass}`}>
          <EvIcon className={`w-4 h-4 shrink-0 ${evConfig.textClass}`} />
          <div className="text-xs">
            <div className={`font-bold ${evConfig.textClass}`}>{evConfig.label}</div>
            <div className="text-[11px] text-stone-600 mt-0.5 line-clamp-1">
              {match_assessment.because[0] || 'Registro oficial contrastado'}
            </div>
          </div>
        </div>

        {/* Adecuación a la búsqueda (§70) */}
        <div className="p-2.5 rounded-lg border border-stone-200 bg-stone-50/70 flex items-center gap-2.5">
          <FileCheck2 className="w-4 h-4 text-stone-600 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-stone-800">
              {suitability === 'complete' && 'Coincidencia completa con los filtros'}
              {suitability === 'partial' && 'Coincidencia parcial · Verifique pendientes'}
              {suitability === 'incompatible' && 'Incompatibilidad de criterios'}
              {suitability === 'unknown' && 'Adecuación pendiente de comprobación'}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Etapas autorizadas: {centre.allowed_life_stages.map(s => LIFE_STAGES[s]?.label).join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Novedad v1.7: Estado de combinación de apoyos en esta sede (§82.2) */}
      {combination_status !== 'all_same_centre' && (
        <div className="mb-3 p-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-stone-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-500" />
            <span>
              {combination_status === 'same_provider_diff_centres' && (
                <strong>Servicios en sedes distintas:</strong>
              )}
              {combination_status === 'partial_same_centre' && (
                <strong>Combinación parcial en esta sede:</strong>
              )}
              {combination_status === 'same_provider_diff_centres' 
                ? ' La entidad dispone de los apoyos pero repartidos en diferentes centros físicos.'
                : ' No todos los apoyos solicitados constan formalmente en esta misma sede.'}
            </span>
          </span>
          <button
            onClick={() => onWhyAppears(item)}
            className="text-[11px] font-semibold text-stone-900 underline hover:text-stone-700 shrink-0 ml-2"
          >
            Ver detalle
          </button>
        </div>
      )}

      {/* 4. Aviso de conflicto si las fuentes oficiales no coinciden (§39, SRC-001) */}
      {centre.conflict_record && centre.conflict_record.status === 'unresolved' && (
        <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Aviso de discrepancia oficial:</strong> {centre.conflict_record.public_message}
          </div>
        </div>
      )}

      {/* 5. Tarjeta de Siguiente Paso y Vía de Acceso (§42) */}
      <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg mb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-stone-600" />
            <span>Vía de acceso oficial y siguiente paso</span>
          </span>
          <span className="text-[11px] font-mono text-stone-500">
            {centre.access_route.access_type === 'dependency_pia' && 'Trámite Dependencia'}
            {centre.access_route.access_type === 'referral' && 'Requiere derivación'}
            {centre.access_route.access_type === 'direct' && 'Acceso directo'}
            {centre.access_route.access_type === 'private_contact' && 'Admisión privada'}
            {centre.access_route.access_type === 'unknown' && 'Sin documentar'}
          </span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed">
          {centre.access_route.next_step_action}
        </p>

        {/* Advertencia obligatoria de plazas (§10.17, CAP-001) */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-200/60 text-[11px] text-stone-500">
          <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>
            {centre.availability.authorised_places !== null 
              ? `${centre.availability.authorised_places} plazas autorizadas en registro oficial (cupo máximo; no equivale a vacantes disponibles).` 
              : 'Capacidad registral no publicada o en comprobación.'}
            {centre.availability.stale && ' · Dato con más de 30 días: confirme con el centro.'}
          </span>
        </div>
      </div>

      {/* 6. Modo lectura fácil explicativo si está activo (§30) */}
      {easyReadMode && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg mb-3 text-xs text-amber-950">
          <div className="font-bold mb-1 flex items-center gap-1">
            <span>Lectura fácil: ¿Qué significa este resultado?</span>
          </div>
          <p className="leading-relaxed">
            Este centro aparece porque figura en los registros de la Comunidad de Madrid. Tiene permiso oficial para prestar ayuda. Para conseguir plaza pública, primero debe acudir a su trabajadora social o médico para que autoricen el ingreso.
          </p>
        </div>
      )}

      {/* 7. Barra de acciones operativas (sin botones muertos) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onWhyAppears(item)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          >
            <span>¿Por qué aparece?</span>
          </button>

          <button
            type="button"
            onClick={() => onPrepareContact(item)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Preparar contacto</span>
          </button>

          <button
            type="button"
            onClick={() => onReportError(item)}
            className="text-xs text-stone-500 hover:text-stone-900 px-2 py-1.5 transition-colors"
          >
            Informar dato incorrecto
          </button>
        </div>

        {/* Contacto telefónico y enlace oficial */}
        <div className="flex items-center gap-3 text-xs text-stone-600">
          {centre.phone && (
            <a 
              href={`tel:${centre.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 hover:text-stone-900 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>{centre.phone}</span>
            </a>
          )}
          {centre.website && (
            <a 
              href={centre.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-900 p-1"
              title="Abrir web oficial del centro"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
