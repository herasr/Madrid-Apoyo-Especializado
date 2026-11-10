/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Verified Centre Result Card (Simplified)
 * Disciplina Zero-Pill y diseño compacto y limpio (§14, §27, §42)
 */

import React from 'react';
import { EvaluatedCentreResult } from '../../types/specialized';
import { 
  MapPin, 
  Phone, 
  ExternalLink, 
  Printer, 
  ArrowRight,
  Bus
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
  const { centre, evidence_level, suitability, distance_label, transit_time_label } = item;

  const evidenceLabels: Record<string, { label: string; dotClass: string }> = {
    A1: { label: 'Nivel A1 · Especialización publicada', dotClass: 'bg-emerald-600' },
    A2: { label: 'Nivel A2 · Especialización publicada', dotClass: 'bg-teal-600' },
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
            <span>
              {centre.public_private_status === 'red_publica'
                ? 'Red Pública'
                : centre.public_private_status === 'concertado'
                ? 'Red Concertada'
                : 'Privado'}
            </span>
            {distance_label && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-stone-900 font-semibold inline-flex items-center gap-1 bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  {distance_label}
                </span>
                {transit_time_label && (
                  <span className="font-mono text-blue-900 font-semibold inline-flex items-center gap-1 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded text-[11px]">
                    <Bus className="w-3 h-3 text-blue-700" />
                    {transit_time_label}
                  </span>
                )}
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

      {/* 2. Compact Status & Evidence Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-stone-100">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 font-medium text-stone-800">
          <span className={`w-2 h-2 rounded-full ${evInfo.dotClass}`} />
          {evInfo.label}
        </span>

        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-50 text-stone-600 border border-stone-200">
          {suitability === 'complete' ? '✓ Coincidencia completa' : suitability === 'partial' ? '○ Coincidencia parcial' : 'Orientación'}
        </span>
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
          Centro con autorización oficial de la Comunidad de Madrid. Ofrece ayuda especializada y requiere derivación o trámite administrativo para plaza pública.
        </div>
      )}

      {/* 4. Bottom Actions & Contact */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onWhyAppears(item)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            ¿Por qué aparece?
          </button>

          <button
            type="button"
            onClick={() => onPrepareContact(item)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Preparar contacto</span>
          </button>
        </div>

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
              title="Web oficial"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
