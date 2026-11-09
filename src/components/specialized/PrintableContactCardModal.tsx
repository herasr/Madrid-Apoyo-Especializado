/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Ficha para Preparar el Contacto
 * Documento imprimible con preguntas clave, vía de acceso y advertencias (§32.1, §81.1)
 */

import React from 'react';
import { EvaluatedCentreResult } from '../../types/specialized';
import { 
  X, 
  Printer, 
  Phone, 
  Mail, 
  MapPin, 
  CheckSquare, 
  AlertCircle, 
  Calendar,
  Building2,
  FileText
} from 'lucide-react';
import { LIFE_STAGES } from '../../data/specializedTaxonomy';

interface PrintableContactCardProps {
  item: EvaluatedCentreResult | null;
  onClose: () => void;
}

export const PrintableContactCardModal: React.FC<PrintableContactCardProps> = ({ item, onClose }) => {
  if (!item) return null;

  const { centre, evidence_level, match_assessment } = item;
  const today = new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Cabecera modal con botón Imprimir */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-stone-700" />
            <h2 className="text-base font-bold text-stone-900">
              Ficha para Preparar el Contacto con el Centro
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo de la ficha imprimible */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-800 print:p-0 print:m-0">
          {/* Membrete institucional */}
          <div className="border-b border-stone-300 pb-3 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                Madrid Apoyo Especializado v1.7 · DATAMAD 2026
              </div>
              <h1 className="text-lg font-bold text-stone-900 mt-1">
                {centre.official_name}
              </h1>
              <div className="text-stone-600 mt-0.5">
                {centre.subtype || centre.centre_type} · {centre.municipality}
              </div>
            </div>
            <div className="text-right text-[11px] text-stone-500 font-mono">
              Fecha de consulta: {today}
              <div>ID oficial: {centre.centre_id}</div>
            </div>
          </div>

          {/* Datos de contacto oficiales */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div>
              <span className="font-semibold text-stone-600 block">Dirección oficial:</span>
              <span className="font-medium">{centre.address}, {centre.postal_code} {centre.municipality}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-600 block">Teléfono y web:</span>
              <span className="font-medium">{centre.phone || 'No publicado'}</span>
              {centre.website && <div className="text-stone-500 truncate">{centre.website}</div>}
            </div>
          </div>

          {/* Bloque 1: Qué declara oficialmente */}
          <div>
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-1.5">
              1. Qué declara oficialmente el centro en el registro
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1">
              {match_assessment.because.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
              <li>
                Titularidad y gestión: {centre.management_type} ({centre.public_private_status === 'red_publica' ? 'Pública directa' : centre.public_private_status === 'concertado' ? 'Plazas públicas concertadas' : 'Privado autorizado'}).
              </li>
              <li>
                Etapas vitales autorizadas: {centre.allowed_life_stages.map(s => LIFE_STAGES[s]?.label).join(', ')}.
              </li>
            </ul>
          </div>

          {/* Bloque 2: Vía de acceso requerida */}
          <div className="p-3 bg-stone-100/70 border border-stone-200 rounded-lg">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-1">
              2. Procedimiento oficial de acceso o derivación
            </h3>
            <p className="text-stone-800 leading-relaxed font-medium">
              {centre.access_route.next_step_action}
            </p>
            <div className="mt-2 text-[11px] text-stone-600">
              Organismo competente: <strong>{centre.access_route.competent_body}</strong>
            </div>
          </div>

          {/* Bloque 3: Advertencia de vacantes y disponibilidad */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950">
            <h3 className="font-bold uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>3. Qué debe confirmarse antes de desplazarse</span>
            </h3>
            <ul className="list-disc list-inside space-y-0.5 text-stone-700 pl-1 text-[11px]">
              <li>
                <strong>Plazas disponibles:</strong> El centro cuenta con {centre.availability.authorised_places || 'capacidad no fijada'} plazas autorizadas, pero este dato NO significa que existan plazas libres de ingreso inmediato.
              </li>
              <li>
                <strong>Adecuación al caso concreto:</strong> Confirme si el servicio específico requerido tiene disponibilidad horaria y equipo especializado disponible.
              </li>
              <li>
                <strong>Condiciones de admisión:</strong> Si es plaza pública concertada, requiere resolución de PIA o derivación del SERMAS. Si es plaza privada, consulte tarifas vigentes.
              </li>
            </ul>
          </div>

          {/* Bloque 4: Lista de preguntas recomendadas para hacer en la llamada */}
          <div>
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2">
              4. Preguntas recomendadas para la llamada o entrevista inicial
            </h3>
            <div className="space-y-1.5 text-stone-700">
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5" />
                <span>¿Tienen actualmente plazas libres en el servicio o existe lista de espera?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5" />
                <span>¿El acceso a la plaza que necesito es por concierto público (PIA / derivación médica) o privada?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5" />
                <span>¿Disponen de todos los apoyos de fisioterapia, logopedia y terapia ocupacional en esta misma sede o requieren acudir a otro centro?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5" />
                <span>¿Qué informes médicos o sociales debo aportar en la primera entrevista de valoración?</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5" />
                <span>¿Disponen de servicio de transporte adaptado o comedor en el centro de día?</span>
              </label>
            </div>
          </div>

          {/* Notas para la familia */}
          <div className="border-t border-dashed border-stone-300 pt-3">
            <span className="font-semibold text-stone-600 block mb-1">Anotaciones de la conversación / Fecha de contacto:</span>
            <div className="h-16 border border-stone-200 rounded-lg bg-stone-50/50 p-2 text-stone-400">
              Escriba aquí el nombre de la persona de contacto, fecha y acuerdos...
            </div>
          </div>
        </div>

        {/* Pie modal */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between no-print">
          <span className="text-[11px] text-stone-500">
            Documento generado por Madrid Apoyo Especializado · Código abierto DATAMAD 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
