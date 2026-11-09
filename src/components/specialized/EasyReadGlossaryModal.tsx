/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Glosario en Lectura Fácil
 * Definiciones breves y claras de conceptos administrativos y sociosanitarios (§30)
 */

import React, { useState } from 'react';
import { X, BookOpen, Search } from 'lucide-react';

interface EasyReadGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GLOSSARY_TERMS = [
  {
    term: 'Nivel A1 (Evidencia oficial completa)',
    simple: 'El centro tiene publicado en los registros de la Comunidad de Madrid que atiende exactamente su condición y dispone del servicio concreto que busca.',
    technical: 'Coincidencia explícita literal en condición y oferta asistencial en fuente estructurada oficial.'
  },
  {
    term: 'Nivel A2 (Especialización publicada, apoyo a confirmar)',
    simple: 'El centro declara oficialmente la condición (por ejemplo daño cerebral), pero debe confirmar por teléfono si tiene el servicio específico que usted pide.',
    technical: 'Condición explícita publicada; apoyo concreto no desglosado en registro.'
  },
  {
    term: 'Nivel B1 (Servicios relacionados)',
    simple: 'El centro no menciona el nombre exacto de la enfermedad, pero tiene servicios que ayudan (como rehabilitación o logopedia) y acepta a personas de su edad.',
    technical: 'Dos o más servicios funcionalmente relacionados con etapa vital compatible.'
  },
  {
    term: 'PIA (Programa Individual de Atención)',
    simple: 'Es el documento oficial de la Ley de Dependencia donde la trabajadora social escribe a qué centro de día o residencia tiene derecho la persona.',
    technical: 'Resolución administrativa que determina las modalidades de intervención y servicios del Catálogo de Dependencia.'
  },
  {
    term: 'Plazas autorizadas vs Vacantes',
    simple: 'Plazas autorizadas es el número máximo de personas que caben en el edificio según la ley. NO significa que haya plazas libres hoy.',
    technical: 'Capacidad máxima de ocupación registral; no equivale a vacantes disponibles en tiempo real.'
  },
  {
    term: 'Centro de Día',
    simple: 'Lugar donde las personas acuden durante el día (por ejemplo de 9 a 17h) para recibir apoyo, talleres y rehabilitación, y vuelven a dormir a su casa.',
    technical: 'Servicio socioasistencial diurno para fomento de autonomía personal y respiro familiar.'
  },
  {
    term: 'Centro de Atención Temprana (CAT)',
    simple: 'Centros para niños de 0 a 6 años que necesitan ayuda con el lenguaje, el movimiento o la conducta.',
    technical: 'Dispositivo ambulatorio para el tratamiento integral de trastornos del neurodesarrollo en la primera infancia.'
  },
  {
    term: 'CRECOVI',
    simple: 'Oficina oficial de la Comunidad de Madrid que revisa a los niños pequeños y decide si necesitan atención temprana gratuita.',
    technical: 'Centro Regional de Coordinación y Valoración Infantil de la Comunidad de Madrid.'
  },
  {
    term: 'Misma sede (centre_id)',
    simple: 'Todos los servicios están dentro del mismo edificio o dirección. No tiene que viajar a otro sitio para hacer la logopedia o la fisioterapia.',
    technical: 'Identificador físico unívoco de establecimiento, diferenciado de la entidad gestora o proveedor.'
  },
  {
    term: 'REGCESS',
    simple: 'El registro oficial donde están apuntados todos los hospitales, clínicas y consultas de salud autorizadas por los inspectores.',
    technical: 'Registro General de Centros, Servicios y Establecimientos Sanitarios.'
  }
];

export const EasyReadGlossaryModal: React.FC<EasyReadGlossaryModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = GLOSSARY_TERMS.filter(t => 
    t.term.toLowerCase().includes(filter.toLowerCase()) ||
    t.simple.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-stone-700" />
            <h2 className="text-base font-bold text-stone-900">
              Glosario en Lectura Fácil y Siglas Oficiales
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador de términos */}
        <div className="p-4 border-b border-stone-200 bg-stone-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar término o sigla (ej. PIA, Vacantes, Nivel A1)..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        {/* Lista de términos */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {filtered.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-1.5">
              <h3 className="font-bold text-stone-900 text-sm">
                {item.term}
              </h3>
              <p className="text-stone-800 leading-relaxed font-medium bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                {item.simple}
              </p>
              <div className="text-[11px] text-stone-500 pt-1">
                <strong>Definición administrativa:</strong> {item.technical}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
