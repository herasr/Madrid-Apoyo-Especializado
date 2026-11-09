/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Dataset Snapshot Differences
 * Subsistema «Qué ha cambiado» (§84)
 * Compara snapshot anterior (2026-09-15) vs snapshot actual (2026-11-09)
 */

import { SnapshotDifference } from '../types/specialized';

export const CURRENT_SNAPSHOT_DATE = '2026-11-09';
export const PREVIOUS_SNAPSHOT_DATE = '2026-09-15';

export const SNAPSHOT_DIFFERENCES: SnapshotDifference[] = [
  {
    change_id: 'DIFF-001',
    change_type: 'centre_added',
    centre_id: 'C-AT-01',
    centre_name: 'Centro de Atención Temprana Crean Aragón (Alcalá de Henares)',
    previous_snapshot: PREVIOUS_SNAPSHOT_DATE,
    current_snapshot: CURRENT_SNAPSHOT_DATE,
    detail: 'Alta en catálogo oficial tras publicación en BOCM del nuevo concierto de plazas de atención temprana y psicomotricidad.',
    reason: 'Resolución de autorización definitiva de la Consejería de Familia, Juventud y Asuntos Sociales.',
    category: 'alta'
  },
  {
    change_id: 'DIFF-002',
    change_type: 'service_added',
    centre_id: 'C-DCA-01',
    centre_name: 'Hospital Beata María Ana - Unidad de Daño Cerebral',
    previous_snapshot: PREVIOUS_SNAPSHOT_DATE,
    current_snapshot: CURRENT_SNAPSHOT_DATE,
    detail: 'Incorporación formal del servicio U.68 de Terapia Ocupacional y Robótica de Extremidad Superior en REGCESS.',
    reason: 'Ampliación de oferta asistencial registrada en inspección sanitaria de octubre 2026.',
    category: 'servicio'
  },
  {
    change_id: 'DIFF-003',
    change_type: 'access_route_changed',
    centre_id: 'C-TEA-01',
    centre_name: 'Centro de Día y Residencia Nuevo Horizonte (Las Rozas)',
    previous_snapshot: PREVIOUS_SNAPSHOT_DATE,
    current_snapshot: CURRENT_SNAPSHOT_DATE,
    detail: 'Actualización del protocolo de derivación: documentado el enlace de tramitación directa con el centro de servicios sociales municipal.',
    reason: 'Publicación de la nueva Guía de Acceso a Recursos de Dependencia CAM 2026.',
    category: 'acceso'
  },
  {
    change_id: 'DIFF-004',
    change_type: 'availability_expired',
    centre_id: 'C-STALE-AVL',
    centre_name: 'Residencia Asistida Los Rosales (Moratalaz)',
    previous_snapshot: PREVIOUS_SNAPSHOT_DATE,
    current_snapshot: CURRENT_SNAPSHOT_DATE,
    detail: 'El dato de plazas autorizadas y disponibilidad superó los 30 días sin refrendo de inspección. El estado pasa a «Confirmar con el centro».',
    reason: 'Aplicación estricta de la regla de vigencia §72 (stale_after_days: 30).',
    category: 'vigencia'
  },
  {
    change_id: 'DIFF-005',
    change_type: 'source_broken',
    centre_id: 'C-DCA-03',
    centre_name: 'Centro Polibea Sur (Carabanchel)',
    previous_snapshot: PREVIOUS_SNAPSHOT_DATE,
    current_snapshot: CURRENT_SNAPSHOT_DATE,
    detail: 'Incidencia técnica de enlace: la URL de la ficha del registro social devolvió código HTTP 404 por reestructuración del portal institucional.',
    reason: 'Regla de seguridad CHG-002: una fuente rota se clasifica como incidencia técnica documental, NUNCA como cierre o desaparición del centro.',
    category: 'incidencia_fuente'
  },
  {
    change_id: 'DIFF-006',
    change_type: 'merged_record',
    centre_id: 'C-TEA-02',
    centre_name: 'Centro CEPRI Autismo (Majadahonda)',
    previous_snapshot: PREVIOUS_SNAPSHOT_DATE,
    current_snapshot: CURRENT_SNAPSHOT_DATE,
    detail: 'Fusión deduplicada: se unificaron la ficha del centro de día con la del servicio ambulatorio en una única sede con ID estable C-TEA-02.',
    reason: 'Regla CHG-003: una deduplicación registral no se muestra como baja asistencial; preserva historiales de origen.',
    category: 'deduplicacion'
  }
];
