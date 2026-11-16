/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.8 - Verified Centre Result Card (Simplified)
 * Disciplina Zero-Pill y diseño compacto y limpio (§14, §27, §42)
 */

import React from 'react';
import { EvaluatedCentreResult } from '../../types/specialized';
import { auditCentreAgainstSnapshot } from '../../utils/specializedEngine';
import { 
  MapPin, 
  Phone, 
  ExternalLink, 
  Printer, 
  ArrowRight,
  Bus,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface CentreCardProps {
  item: EvaluatedCentreResult;
  onWhyAppears: (item: EvaluatedCentreResult) => void;
  onPrepareContact: (item: EvaluatedCentreResult) => void;
  isCompared: boolean;
  onToggleCompare: (centreId: string) => void;
  easyReadMode: boolean;
}

export const SpecializedCentreCard: React.FC<CentreCardProps> = ({
  item,
  onWhyAppears,
  onPrepareContact,
  isCompared,
  onToggleCompare,
  easyReadMode
}) => {
  const { centre, evidence_level, evidence_sublevel, suitability, distance_label, transit_time_label } = item;
  const auditResult = auditCentreAgainstSnapshot(centre);

  const a2Label =
    evidence_sublevel === 'A2_entity'
      ? 'Nivel A2 · Lo declara la entidad titular'
      : 'Nivel A2 · Confirme el apoyo';

  const evidenceLabels: Record<string, { label: string; dotClass: string }> = {
    A1: { label: 'Nivel A1 · Especialización publicada', dotClass: 'bg-emerald-600' },
    A2: { label: a2Label, dotClass: 'bg-teal-600' },
    B1: { label: 'Nivel B1 · Servicios relacionados', dotClass: 'bg-sky-600' },
    B2: { label: 'Nivel B2 · Posible recurso', dotClass: 'bg-indigo-600' },
    C: { label: 'Nivel C · Orientación general', dotClass: 'bg-stone-400' }
  };

  const evInfo = evidenceLabels[evidence_level] || evidenceLabels.C;

  return (
    <article className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs transition-shadow hover:shadow-sm space-y-3">
      {/* 1. Header: Name & Meta & Compare */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-stone-900 leading-snug">
            {centre.official_name}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 mt-1.5">
            <span className="font-semibold text-stone-700">{centre.municipality}</span>
            {centre.district && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Distrito {centre.district}</span>
              </>
            )}
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{centre.subtype || centre.centre_type}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>
              {centre.public_private_status === 'red_publica'
                ? 'Red Pública'
                : centre.public_private_status === 'concertado'
                ? 'Red Concertada'
                : centre.public_private_status === 'no_especificado'
                ? 'Titularidad no especificada'
                : 'Privado'}
            </span>
            {distance_label && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono text-stone-800 font-semibold inline-flex items-center gap-1 whitespace-nowrap">
                  <MapPin className="w-3 h-3 text-stone-500 shrink-0" aria-hidden="true" />
                  {distance_label}
                </span>
              </>
            )}
            {transit_time_label && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono text-blue-800 font-semibold inline-flex items-center gap-1 whitespace-nowrap">
                  <Bus className="w-3 h-3 text-blue-600 shrink-0" aria-hidden="true" />
                  {transit_time_label}
                </span>
              </>
            )}
          </div>
        </div>

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

      {/* 2. Compact Status & Evidence Row + Audit Verification Badge */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-stone-100">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 font-medium text-stone-800">
          <span className={`w-2 h-2 rounded-full ${evInfo.dotClass}`} />
          {evInfo.label}
        </span>

        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-50 text-stone-600 border border-stone-200">
          {suitability === 'complete' ? '✓ Coincidencia completa' : suitability === 'partial' ? '○ Coincidencia parcial' : 'Orientación'}
        </span>

        {auditResult.audit_status === 'verified_official' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium" title={auditResult.audit_note}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Verificado en CSV oficial (datos.madrid.es)</span>
          </span>
        )}

        {auditResult.audit_status === 'verified_regional' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 font-medium" title={auditResult.audit_note}>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Verificado en CSV oficial (Comunidad de Madrid)</span>
          </span>
        )}

        {auditResult.audit_status === 'discrepancy' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 text-rose-950 border border-rose-300 font-semibold" title={auditResult.audit_note}>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
            <span>Discrepancia respecto al CSV oficial: {auditResult.discrepancies.join(', ')}</span>
          </span>
        )}

        {auditResult.audit_status === 'unverified' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-950 border border-amber-300 font-semibold" title={auditResult.audit_note}>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>No proviene del CSV oficial</span>
          </span>
        )}

        {typeof centre.availability.authorised_places === 'number' && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-50 text-stone-700 border border-stone-200 font-mono text-[11px]" title="Cupo máximo registral (no indica vacantes libres)">
            {centre.availability.authorised_places} plazas autorizadas
          </span>
        )}

        {centre.allowed_life_stages.length === 0 && (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50/70 text-amber-900 border border-amber-200 text-[11px] font-medium"
            title="El registro oficial no especifica rango de edad ni etapa vital para este recurso"
          >
            Edad: no consta, confirmar
          </span>
        )}
      </div>

      {/* 3. Access Route & Next Step (Simplified) */}
      <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200 flex items-start gap-2">
        <ArrowRight className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-stone-900">Acceso: </span>
          {centre.access_route.next_step_action}
        </div>
      </div>

      {/* Lectura fácil si está activado */}
      {easyReadMode && (
        <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-lg text-xs text-amber-950 leading-relaxed">
          <span className="font-bold">Lectura fácil: </span>
          {centre.centre_id.startsWith('MAD-PK')
            ? 'Recurso publicado en el catálogo oficial del Ayuntamiento de Madrid (datos.madrid.es).'
            : 'Centro o servicio con autorización oficial de la Comunidad de Madrid.'}{' '}
          {centre.public_private_status === 'red_publica' || centre.public_private_status === 'concertado'
            ? 'Puede contar con plazas públicas o concertadas; consulte en sus servicios sociales cómo solicitar acceso.'
            : centre.public_private_status === 'no_especificado'
            ? 'Consulte directamente con la entidad o en sus servicios sociales las vías de acceso y condiciones.'
            : 'Entidad privada autorizada; consulte directamente con el centro las condiciones de admisión.'}
        </div>
      )}

      {/* 4. Bottom Actions & Contact */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onWhyAppears(item)}
            aria-label={`¿Por qué aparece ${centre.official_name}? Ver informe de trazabilidad y nivel de evidencia`}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            ¿Por qué aparece?
          </button>

          <button
            type="button"
            onClick={() => onPrepareContact(item)}
            aria-label={`Preparar contacto con ${centre.official_name} e imprimir ficha`}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
            <span>Preparar contacto</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-600">
          {centre.phone && (
            <a 
              href={`tel:${centre.phone.replace(/\s+/g, '')}`}
              aria-label={`Llamar a ${centre.official_name} al teléfono ${centre.phone}`}
              className="flex items-center gap-1 hover:text-stone-900 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
              <span>{centre.phone}</span>
            </a>
          )}
          {centre.website && (
            <a 
              href={centre.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-900 p-1"
              title="Web oficial"
              aria-label={`Visitar web oficial de ${centre.official_name} (se abre en nueva pestaña)`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
