/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Correcciones Ciudadanas Controladas
 * Genera tareas de comprobación sin alterar directamente el registro público (§76)
 */

import React, { useState } from 'react';
import { EvaluatedCentreResult, CitizenCorrection } from '../../types/specialized';
import { X, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface CitizenCorrectionModalProps {
  item: EvaluatedCentreResult | null;
  onClose: () => void;
  onSuccess: (correction: CitizenCorrection) => void;
}

export const CitizenCorrectionModal: React.FC<CitizenCorrectionModalProps> = ({
  item,
  onClose,
  onSuccess
}) => {
  const [reason, setReason] = useState<CitizenCorrection['reason']>('phone');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!item) return null;

  const reasonsList: { id: CitizenCorrection['reason']; label: string; desc: string }[] = [
    { id: 'phone', label: 'Teléfono erróneo o dado de baja', desc: 'El número de teléfono oficial no responde o pertenece a otra entidad.' },
    { id: 'address', label: 'Dirección o ubicación incorrecta', desc: 'La dirección postal, calle o número difiere de la sede real.' },
    { id: 'service_not_provided', label: 'Servicio no prestado en esta sede', desc: 'El centro no presta en esta sede física alguno de los apoyos listados.' },
    { id: 'closed', label: 'Centro cerrado o traslado definitivo', desc: 'El centro ha cesado su actividad o se ha trasladado.' },
    { id: 'broken_link', label: 'Enlace web oficial roto', desc: 'La página web o enlace a la resolución institucional no funciona.' },
    { id: 'duplicate', label: 'Posible duplicado en el catálogo', desc: 'Existen dos fichas para el mismo centro físico.' },
    { id: 'age_incorrect', label: 'Rango de edad o etapa vital incorrecta', desc: 'Discrepancia en la atención a menores, adultos o mayores.' },
    { id: 'other', label: 'Otra incidencia documental', desc: 'Otro dato administrativo susceptible de contraste.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCorr: CitizenCorrection = {
      correction_id: `CORR-${Date.now()}`,
      centre_id: item.centre.centre_id,
      centre_name: item.centre.official_name,
      reason,
      reason_label: reasonsList.find(r => r.id === reason)?.label || reason,
      user_details: details.trim(),
      created_at: new Date().toISOString(),
      status: 'received'
    };
    onSuccess(newCorr);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Informar de un dato incorrecto
            </h2>
            <div className="text-[11px] text-stone-500 font-mono">
              Centro: {item.centre.official_name}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">
              Incidencia registrada correctamente
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              Se ha creado una tarea técnica de contraste documental con la Consejería. El registro público no se altera automáticamente hasta su validación por el equipo revisor (§76).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-stone-700">
            <div className="p-2.5 bg-stone-100 rounded-lg text-stone-700 leading-relaxed text-[11px]">
              <strong>Garantía de privacidad (§76):</strong> Por favor, NO incluya datos de salud, diagnósticos personales ni nombres de pacientes. Indique únicamente la referencia administrativa a contrastar.
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Motivo estructurado:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:border-stone-900"
              >
                {reasonsList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Detalle u observación (datos institucionales):
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Indique el dato oficial correcto o la URL institucional donde puede contrastarse..."
                required
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-stone-500 hover:text-stone-800 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar propuesta de comprobación</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
