/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Función «Qué ha cambiado»
 * Detección de cambios entre snapshots del registro oficial (§84, §110)
 */

import React from 'react';
import { 
  SNAPSHOT_DIFFERENCES, 
  CURRENT_SNAPSHOT_DATE, 
  PREVIOUS_SNAPSHOT_DATE 
} from '../../data/snapshotDiffsData';
import { 
  X, 
  History, 
  PlusCircle, 
  AlertCircle, 
  FileCheck2, 
  Link2Off, 
  Layers, 
  Clock,
  Sparkles
} from 'lucide-react';

interface WhatChangedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatChangedModal: React.FC<WhatChangedModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-stone-700" />
            <div>
              <h2 className="text-base font-bold text-stone-900">
                ¿Qué ha cambiado entre versiones del registro oficial? (§84)
              </h2>
              <div className="text-[11px] text-stone-500 font-mono">
                Comparativa: Snapshot {PREVIOUS_SNAPSHOT_DATE} ➔ Snapshot {CURRENT_SNAPSHOT_DATE}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con reglas de veracidad CHG-002 y CHG-003 */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 bg-stone-100/70 border border-stone-200 rounded-lg text-stone-700 leading-relaxed">
            <strong>Reglas de integridad y veracidad (§84.2):</strong> Toda diferencia incluye snapshot anterior, snapshot actual y motivo justificado. Una fuente institucional caída o enlace roto se reporta como <em>incidencia técnica</em> y nunca como cierre del centro (CHG-002). Las fusiones de registros duplicados se identifican claramente sin confundirlas con bajas asistenciales (CHG-003).
          </div>

          <div className="space-y-3">
            {SNAPSHOT_DIFFERENCES.map((diff) => {
              let badgeColor = 'bg-stone-100 text-stone-800 border-stone-200';
              let Icon = FileCheck2;

              if (diff.category === 'alta') {
                badgeColor = 'bg-emerald-50 text-emerald-900 border-emerald-200';
                Icon = PlusCircle;
              } else if (diff.category === 'servicio') {
                badgeColor = 'bg-sky-50 text-sky-900 border-sky-200';
                Icon = FileCheck2;
              } else if (diff.category === 'vigencia') {
                badgeColor = 'bg-amber-50 text-amber-900 border-amber-200';
                Icon = Clock;
              } else if (diff.category === 'incidencia_fuente') {
                badgeColor = 'bg-rose-50 text-rose-900 border-rose-200';
                Icon = Link2Off;
              } else if (diff.category === 'deduplicacion') {
                badgeColor = 'bg-indigo-50 text-indigo-900 border-indigo-200';
                Icon = Layers;
              }

              return (
                <div
                  key={diff.change_id}
                  className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${badgeColor}`}>
                        {diff.category}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm">
                        {diff.centre_name}
                      </h4>
                    </div>
                    <span className="font-mono text-[11px] text-stone-400 shrink-0">
                      {diff.change_id}
                    </span>
                  </div>

                  <p className="text-stone-700 leading-relaxed">
                    {diff.detail}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <div>
                      <strong>Motivo registral:</strong> {diff.reason}
                    </div>
                    <div className="font-mono">
                      {diff.previous_snapshot} ➔ {diff.current_snapshot}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            {SNAPSHOT_DIFFERENCES.length} cambios oficiales auditados y documentados
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
