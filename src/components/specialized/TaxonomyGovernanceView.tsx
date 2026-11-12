/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Panel de Gestión Taxonómica y Utilidad Administrativa
 * Gobernanza de categorías, ciclo de vida, reglas de inferencia y vacíos territoriales (§33, §58)
 */

import React, { useState } from 'react';
import { 
  TAXONOMY_METADATA, 
  CORE_PROFILES, 
  EXPERIMENTAL_PROFILES, 
  PENDING_PROFILES, 
  FORBIDDEN_INFERENCES 
} from '../../data/specializedTaxonomy';
import { 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  TrendingUp,
  Lock,
  GitBranch
} from 'lucide-react';

export const TaxonomyGovernanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'rules' | 'voids' | 'analytics'>('categories');

  // Datos agregados de vacíos territoriales (§33)
  const territorialVoids = [
    { zone: 'Sierra Norte (Buitrago / Rascafría)', profile: 'Daño cerebral adquirido (DCA)', radiusNeeded: '>45 km', note: 'Sin plazas A1/A2 en radio <30 km; cobertura dependiente de Madrid Capital.' },
    { zone: 'Cuenca del Alberche (San Martín / Villa del Prado)', profile: 'Trastorno del espectro del autismo (TEA)', radiusNeeded: '>40 km', note: 'Requiere desplazamiento a Móstoles o Alcorcón para plazas concertadas de centro de día.' },
    { zone: 'Sureste (Chinchón / Colmenar de Oreja)', profile: 'Parálisis cerebral grave', radiusNeeded: '>35 km', note: 'Falta de unidades residenciales monográficas en el entorno inmediato.' }
  ];

  // Términos ciudadanos recurrentes propuestos para revisión experta (§57)
  const candidateProfiles = [
    { user_term: 'ELA', normalized: 'Esclerosis lateral amiotrófica', query_count: 86, explicit_results: 1, related_centres: 4, status: 'pending_expert_review' },
    { user_term: 'Párkinson precoz', normalized: 'Enfermedad de Párkinson en adultos jóvenes', query_count: 54, explicit_results: 1, related_centres: 5, status: 'pending_expert_review' },
    { user_term: 'Disfagia infantil', normalized: 'Trastorno de deglución en la primera infancia', query_count: 38, explicit_results: 2, related_centres: 6, status: 'pending_expert_review' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Cabecera */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-stone-900 text-white font-bold">
                Taxonomía v{TAXONOMY_METADATA.version}
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Liberada: {TAXONOMY_METADATA.released_at} · Estado: {TAXONOMY_METADATA.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1">
              Gobernanza Taxonómica y Utilidad Administrativa (§33, §58)
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
              La taxonomía es un subsistema externo, versionable y gobernado por profesionales sociales y sanitarios. No se generan categorías por asociaciones libres de IA ni se recalculan resultados históricos silenciosamente.
            </p>
          </div>

          {/* Estadísticas de gobernanza */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-center">
              <div className="font-mono font-bold text-stone-900 text-sm">4</div>
              <div className="text-[10px] text-stone-500 uppercase">Perfiles Núcleo</div>
            </div>
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-center">
              <div className="font-mono font-bold text-stone-900 text-sm">2</div>
              <div className="text-[10px] text-stone-500 uppercase">Experimentales</div>
            </div>
            <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-center">
              <div className="font-mono font-bold text-stone-900 text-sm">7</div>
              <div className="text-[10px] text-stone-500 uppercase">En revisión</div>
            </div>
          </div>
        </div>

        {/* Pestañas de gobernanza */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto text-xs font-semibold" role="tablist" aria-label="Secciones de gobernanza taxonómica">
          {[
            { id: 'categories', label: 'Catálogo y Ciclo de Vida' },
            { id: 'rules', label: 'Reglas Negativas de Inferencia' },
            { id: 'voids', label: 'Vacíos Territoriales' },
            { id: 'analytics', label: 'Propuestas desde Búsquedas Agregadas' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={activeTab === t.id}
              aria-controls={`tabpanel-${t.id}`}
              aria-label={`Sección: ${t.label}`}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pestaña 1: Catálogo y Ciclo de vida (§51, §52) */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
            <strong>Puerta de Aceptación (§25.3):</strong> Un perfil solo puede pasar al estado <em>aprobado</em> si cuenta con al menos 3 centros explícitos de nivel A, una precisión A &ge; 95%, precisión B &ge; 85%, reglas negativas documentadas y revisión médica y social colegiada.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Núcleo MVP */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Perfiles Núcleo (Aprobados)</span>
                <span className="font-mono text-emerald-700">4 / 4 activos</span>
              </h3>
              {Object.values(CORE_PROFILES).map((prof) => (
                <div key={prof.id} className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{prof.preferred_label}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                      approved
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {prof.description}
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span>Precisión A: {(prof.evidence_thresholds.level_a_precision * 100).toFixed(0)}%</span>
                    <span>Revisado: {prof.review_date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Experimentales / Reserva */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Perfiles Experimentales</span>
                <span className="font-mono text-amber-700">2 en muestra</span>
              </h3>
              {Object.values(EXPERIMENTAL_PROFILES).map((prof) => (
                <div key={prof.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950">{prof.preferred_label}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                      experimental
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {prof.description}
                  </p>
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span>Muestra en testeo: 2 centros</span>
                    <span>Revisión: {prof.review_date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pendientes de revisión experta */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>En Cola de Revisión</span>
                <span className="font-mono text-stone-500">7 candidatos</span>
              </h3>
              {Object.values(PENDING_PROFILES).slice(0, 4).map((prof) => (
                <div key={prof.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1.5 text-xs opacity-85">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">{prof.preferred_label}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-200 text-stone-700">
                      pending
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {prof.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pestaña 2: Reglas Negativas de Inferencia (§26.1) */}
      {activeTab === 'rules' && (
        <div className="space-y-3">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
            Las <strong>reglas negativas obligatorias</strong> impiden que el motor de coincidencia extrapole competencias clínicas sin evidencia expresa. Su cumplimiento es auditado por la suite canónica antes de cualquier despliegue.
          </div>

          <div className="border border-stone-200 rounded-xl bg-white overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
                  <th className="p-3 w-24">Código</th>
                  <th className="p-3">Regla Negativa de Inferencia</th>
                  <th className="p-3">Consecuencia Estricta en el Motor</th>
                  <th className="p-3 w-28 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {FORBIDDEN_INFERENCES.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-900">{item.id}</td>
                    <td className="p-3 font-medium text-stone-800">{item.rule}</td>
                    <td className="p-3 text-stone-600">{item.consequence}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Blindada</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pestaña 3: Vacíos Territoriales (§33) */}
      {activeTab === 'voids' && (
        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
            <strong>Indicador diferencial (§16, §33):</strong> Distinguir la <em>falta real de oferta asistencial</em> de la <em>falta de información estructurada en los registros</em>. Este módulo agrega las zonas de la Comunidad de Madrid donde no existen recursos con especialización A1/A2 en un radio razonable.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {territorialVoids.map((voidItem, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 text-xs">
                <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{voidItem.zone}</span>
                </div>
                <div className="text-stone-700">
                  <strong>Perfil desatendido:</strong> {voidItem.profile}
                </div>
                <div className="text-amber-900 font-mono font-bold">
                  Distancia a recurso A1 más próximo: {voidItem.radiusNeeded}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed pt-1 border-t border-amber-200/50">
                  {voidItem.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pestaña 4: Propuestas desde búsquedas agregadas (§57) */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
            <strong>Privacidad de Búsquedas Agregadas (§43, §57):</strong> Solo se registran términos normalizados con umbral mínimo de cinco consultas. Nunca se almacena texto libre que pueda contener diagnósticos personales, coordenadas exactas ni identificadores de sesión.
          </div>

          <div className="border border-stone-200 rounded-xl bg-white overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
                  <th className="p-3">Término ciudadano buscado</th>
                  <th className="p-3">Normalización técnica</th>
                  <th className="p-3 text-center">Consultas mensuales</th>
                  <th className="p-3">Centros potencialmente relacionados</th>
                  <th className="p-3">Estado en gobernanza</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {candidateProfiles.map((c, i) => (
                  <tr key={i} className="hover:bg-stone-50/50">
                    <td className="p-3 font-semibold text-stone-900">«{c.user_term}»</td>
                    <td className="p-3 text-stone-700">{c.normalized}</td>
                    <td className="p-3 font-mono font-bold text-stone-900 text-center">{c.query_count}</td>
                    <td className="p-3 text-stone-600">{c.related_centres} centros identificados</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
