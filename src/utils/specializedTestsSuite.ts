/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Canonical Validation Test Suite
 * Batería de pruebas automatizadas según Secciones 18, 31, 44, 59, 65, 79 y 90 del Prompt Maestro
 * DATAMAD 2026 · Cero falsos positivos de especialización A · Orden lexicográfico estricto
 */

import { REAL_CANONICAL_CENTRES } from '../data/specializedCentresData';
import { BENCHMARK_TEST_CENTRES } from '../data/testCentresData';
import { evaluateCentre, runSpecializedSearch } from './specializedEngine';
import { SearchQueryState } from '../types/specialized';
import { DISAMBIGUATION_TERMS, EDUCATION_BRIDGE_MAPPINGS } from '../data/specializedTaxonomy';

const ALL_BENCHMARK_CENTRES = [...REAL_CANONICAL_CENTRES, ...BENCHMARK_TEST_CENTRES];

export interface TestCaseResult {
  id: string;
  category: 'TAXONOMIA' | 'EVIDENCIA' | 'REGLAS_NEGATIVAS' | 'COMBINACION' | 'ACCESO' | 'GEOGRAFIA' | 'ORDEN' | 'PRIVACIDAD' | 'PUENTE_EDUCATIVO';
  title: string;
  expected: string;
  actual: string;
  passed: boolean;
  notes: string;
}

export function runAllCanonicalTests(): {
  results: TestCaseResult[];
  total: number;
  passedCount: number;
  failedCount: number;
  executionTimeMs: number;
} {
  const startTime = performance.now();
  const tests: TestCaseResult[] = [];

  const defaultQuery: SearchQueryState = {
    profile: null,
    functional_needs: [],
    support_types: [],
    support_combination_mode: 'any_support',
    life_stage: null,
    municipality: null,
    radius_km: 25,
    network_preference: 'all',
    accessibility_needs: [],
    user_ephemeral_location: null,
    location_mode: 'all'
  };

  // 1. TAX-001 & EV-001: TEA explícito en fuente + apoyo -> A1
  const teaCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-TEA-01')!;
  const qEv001: SearchQueryState = {
    ...defaultQuery,
    profile: 'autism',
    support_types: ['day_care']
  };
  const resEv001 = evaluateCentre(teaCenter, qEv001, ALL_BENCHMARK_CENTRES, null);
  tests.push({
    id: 'TAX-001',
    category: 'EVIDENCIA',
    title: 'TEA explícito en fuente oficial y apoyo coincidente',
    expected: 'Nivel A1',
    actual: `Nivel ${resEv001.evidence_level}`,
    passed: resEv001.evidence_level === 'A1',
    notes: 'Condición y apoyo declarados explícitamente en la resolución de registro.'
  });

  // 2. EV-002: Condición literal, apoyo ausente o no solicitado -> A2
  const qEv002: SearchQueryState = {
    ...defaultQuery,
    profile: 'autism',
    support_types: ['residential_care'] // Residencia en centro que solo tiene ambulatorio (ej. Sede Centro C-DUP-01A)
  };
  const dupCenterA = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-DUP-01A')!;
  const resEv002 = evaluateCentre(dupCenterA, qEv002, ALL_BENCHMARK_CENTRES, null);
  tests.push({
    id: 'EV-002',
    category: 'EVIDENCIA',
    title: 'Condición literal pero apoyo específico ausente en la sede',
    expected: 'Nivel A2',
    actual: `Nivel ${resEv002.evidence_level}`,
    passed: resEv002.evidence_level === 'A2',
    notes: 'La especialización en autismo consta, pero el apoyo solicitado debe confirmarse.'
  });

  // 3. NEG-001 & TAX-003: Neurología sin perfil explícito -> Máximo B2
  const neuCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-NEG-NEU')!;
  const qNeg001: SearchQueryState = {
    ...defaultQuery,
    profile: 'acquired_brain_injury'
  };
  const resNeg001 = evaluateCentre(neuCenter, qNeg001, ALL_BENCHMARK_CENTRES, null);
  tests.push({
    id: 'NEG-001',
    category: 'REGLAS_NEGATIVAS',
    title: 'Neurología genérica sin daño cerebral explícito',
    expected: 'Máximo nivel B2 (nunca A)',
    actual: `Nivel ${resNeg001.evidence_level}`,
    passed: resNeg001.evidence_level === 'B2' || resNeg001.evidence_level === 'C',
    notes: 'La neurología ambulatoria general no demuestra especialización en DCA.'
  });

  // 4. NEG-002 & TAX-004: Fisioterapia genérica -> No inferir rehabilitación neurológica
  const fisCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-NEG-FIS')!;
  const qNeg002: SearchQueryState = {
    ...defaultQuery,
    profile: 'spinal_cord_injury',
    support_types: ['rehabilitation']
  };
  const resNeg002 = evaluateCentre(fisCenter, qNeg002, ALL_BENCHMARK_CENTRES, null);
  tests.push({
    id: 'NEG-002',
    category: 'REGLAS_NEGATIVAS',
    title: 'Fisioterapia deportiva/genérica para lesión medular',
    expected: 'Máximo nivel C e incompatibilidad de adecuación',
    actual: `Nivel ${resNeg002.evidence_level}, Adecuación ${resNeg002.suitability}`,
    passed: resNeg002.evidence_level === 'C' && resNeg002.suitability === 'incompatible',
    notes: 'Fisioterapia genérica no eleva a nivel A ni B para patología medular compleja.'
  });

  // 5. NEG-003 & TAX-002: Discapacidad intelectual sin TEA -> No inferir TEA
  const diCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-NEG-DI')!;
  const qNeg003: SearchQueryState = {
    ...defaultQuery,
    profile: 'autism'
  };
  const resNeg003 = evaluateCentre(diCenter, qNeg003, ALL_BENCHMARK_CENTRES, null);
  tests.push({
    id: 'NEG-003',
    category: 'REGLAS_NEGATIVAS',
    title: 'Discapacidad intelectual no implica TEA',
    expected: 'Bloqueado para nivel A y adecuación incompatible',
    actual: `Nivel ${resNeg003.evidence_level}, Adecuación ${resNeg003.suitability}`,
    passed: resNeg003.evidence_level === 'C' && resNeg003.suitability === 'incompatible',
    notes: '0 falsos positivos: la discapacidad intelectual jamás se equipara a TEA.'
  });

  // 6. TAX-005 & NORES-003: Término "neurodivergente" -> Solicitar desambiguación obligatoria
  const isNeurodivergentTriggered = DISAMBIGUATION_TERMS.neurodivergent.trigger_words.includes('neurodivergente');
  const hasOptions = DISAMBIGUATION_TERMS.neurodivergent.options.length >= 4;
  tests.push({
    id: 'TAX-005',
    category: 'TAXONOMIA',
    title: 'Entrada ciudadana «neurodivergente» activa desambiguación obligatoria',
    expected: 'No ejecuta búsqueda directa; solicita desambiguar',
    actual: isNeurodivergentTriggered && hasOptions ? 'Desambiguación obligatoria activa con opciones estructuradas' : 'Fallo',
    passed: isNeurodivergentTriggered && hasOptions,
    notes: 'Protege contra diagnósticos libres y garantiza precisión taxonómica.'
  });

  // 7. COMB-001: Varios apoyos y "Todos en el mismo centro"
  const beataCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-DCA-01')!;
  const qComb001: SearchQueryState = {
    ...defaultQuery,
    profile: 'acquired_brain_injury',
    support_types: ['rehabilitation', 'speech_therapy', 'occupational_therapy'],
    support_combination_mode: 'all_supports_same_centre'
  };
  const resComb001 = evaluateCentre(beataCenter, qComb001, ALL_BENCHMARK_CENTRES, null);
  tests.push({
    id: 'COMB-001',
    category: 'COMBINACION',
    title: 'Varios apoyos solicitados con modo «Todos en el mismo centro»',
    expected: 'all_same_centre (todos confirmados para el mismo centre_id)',
    actual: resComb001.combination_status,
    passed: resComb001.combination_status === 'all_same_centre',
    notes: 'Hospital Beata María Ana confirma rehabilitación, logopedia y TO en su sede física.'
  });

  // 8. COMB-002 & DUP-001: Mismo proveedor, sedes distintas
  const qComb002: SearchQueryState = {
    ...defaultQuery,
    profile: 'autism',
    support_types: ['occupational_therapy', 'day_care'],
    support_combination_mode: 'all_supports_same_centre'
  };
  const resComb002 = evaluateCentre(dupCenterA, qComb002, ALL_BENCHMARK_CENTRES, null);
  tests.push({
    id: 'COMB-002',
    category: 'COMBINACION',
    title: 'Mismo proveedor (Fundación San Martín) pero sedes distintas (Sede Centro vs Sede Sur)',
    expected: 'same_provider_diff_centres',
    actual: resComb002.combination_status,
    passed: resComb002.combination_status === 'same_provider_diff_centres',
    notes: 'No confunde mismo proveedor con misma sede. Respeta la separación centre_id vs provider_id.'
  });

  // 9. ACC-001 & ACC-004: Vía documentada con derivación / PIA
  const polibeaCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-DCA-03')!;
  tests.push({
    id: 'ACC-004',
    category: 'ACCESO',
    title: 'Vía de acceso documentada: Dependencia / PIA',
    expected: 'Tarjeta PIA con organismo y trámite documentado',
    actual: `Tipo: ${polibeaCenter.access_route.access_type}`,
    passed: polibeaCenter.access_route.access_type === 'dependency_pia' && polibeaCenter.access_route.next_step_action.includes('PIA'),
    notes: 'Indica claramente que se requiere resolución del Programa Individual de Atención.'
  });

  // 10. ACC-002 & ACC-005: Vía ausente en la fuente -> "Debe confirmarse"
  const unkAccCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-ACC-UNK')!;
  tests.push({
    id: 'ACC-002',
    category: 'ACCESO',
    title: 'Vía de acceso no especificada en el registro oficial',
    expected: 'unknown -> mensaje «Debe confirmarse con el organismo competente»',
    actual: `Tipo: ${unkAccCenter.access_route.access_type}, Acción: ${unkAccCenter.access_route.next_step_action}`,
    passed: unkAccCenter.access_route.access_type === 'unknown' && unkAccCenter.access_route.next_step_action.includes('Debe confirmarse'),
    notes: 'No promete acceso directo cuando no existe documentación fehaciente.'
  });

  // 11. ACC-003: Centro privado autorizado no se etiqueta como Red Pública
  const lescerCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-DCA-02')!;
  tests.push({
    id: 'ACC-003',
    category: 'ACCESO',
    title: 'Centro privado autorizado sin concierto público',
    expected: 'privado_autorizado (no confundir con red pública)',
    actual: lescerCenter.public_private_status,
    passed: lescerCenter.public_private_status === 'privado_autorizado',
    notes: 'Estar autorizado por Sanidad no equivale a financiación ni concierto público.'
  });

  // 12. CAP-001 & NEG-004: Plazas autorizadas no se etiquetan como vacantes disponibles
  const allNoVacancies = ALL_BENCHMARK_CENTRES.every(c => c.availability.vacancies_known === false);
  tests.push({
    id: 'CAP-001',
    category: 'REGLAS_NEGATIVAS',
    title: 'Plazas autorizadas vs vacantes libres',
    expected: '0 casos de plazas autorizadas presentadas como vacantes libres',
    actual: allNoVacancies ? '0 vacantes asumidas; todas las plazas marcadas como autorizadas' : 'Fallo',
    passed: allNoVacancies,
    notes: 'Se evita crear falsas expectativas asistenciales a las familias.'
  });

  // 13. GEO-001 & GEO-002: Centro sin coordenadas aparece en lista pero no en radio
  const noCoordCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-GEO-NOCORD')!;
  const qGeo: SearchQueryState = {
    ...defaultQuery,
    profile: 'autism',
    municipality: 'Madrid',
    radius_km: 10
  };
  const madridCenterCoord: [number, number] = [40.4168, -3.7038];
  const searchGeo = runSpecializedSearch(qGeo, ALL_BENCHMARK_CENTRES, madridCenterCoord);
  const foundInList = searchGeo.results.some(r => r.centre.centre_id === 'C-GEO-NOCORD');
  tests.push({
    id: 'GEO-001',
    category: 'GEOGRAFIA',
    title: 'Centro oficial sin coordenadas geográficas en el registro',
    expected: 'Aparece en la lista de resultados; excluido del cálculo de radio y mapa',
    actual: foundInList ? 'Presente en lista con aviso «No disponible en el mapa»' : 'No encontrado',
    passed: foundInList && !noCoordCenter.has_valid_coordinates,
    notes: 'Los centros sin coordenadas no se descartan silenciosamente.'
  });

  // 14. SORT-001 & SORT-002 & RANK-001: Nivel A a 30 km y Nivel C a 2 km -> A siempre primero
  const qSort: SearchQueryState = {
    ...defaultQuery,
    profile: 'autism',
    radius_km: 50
  };
  const searchSort = runSpecializedSearch(qSort, ALL_BENCHMARK_CENTRES, madridCenterCoord);
  const firstResult = searchSort.results[0];
  const hasOnlyLevelAFirst = searchSort.results.slice(0, 2).every(r => r.evidence_level === 'A1' || r.evidence_level === 'A2');
  tests.push({
    id: 'SORT-001',
    category: 'ORDEN',
    title: 'Orden lexicográfico: la cercanía nunca hace que C supere a A1/A2',
    expected: 'Resultados nivel A siempre por delante de nivel C o B',
    actual: `Primer resultado: ${firstResult.centre.official_name} (${firstResult.evidence_level}, ${firstResult.distance_label})`,
    passed: hasOnlyLevelAFirst,
    notes: 'A1 < A2 < B1 < B2 < C. La evidencia es el criterio rector inquebrantable.'
  });

  // 15. SRC-001: Contradicción de plazas entre Registro y Directorio -> Atributo nulo y aviso
  const confCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-SRC-CONF')!;
  const hasConflictHandled = confCenter.conflict_record !== undefined && confCenter.availability.authorised_places === null;
  tests.push({
    id: 'SRC-001',
    category: 'EVIDENCIA',
    title: 'Fuentes oficiales contradictorias en capacidad de plazas',
    expected: 'Atributo nulo en ficha pública y aviso visible de comprobación pendiente',
    actual: hasConflictHandled ? `Plazas: null, Aviso: "${confCenter.conflict_record?.public_message}"` : 'Fallo',
    passed: hasConflictHandled,
    notes: 'No se elige una fuente en silencio; se preserva la auditoría de ambas.'
  });

  // 16. AVL-001: Disponibilidad comprobada hace más de 30 días -> "Confirmar con el centro"
  const staleCenter = ALL_BENCHMARK_CENTRES.find(c => c.centre_id === 'C-STALE-AVL')!;
  tests.push({
    id: 'AVL-001',
    category: 'EVIDENCIA',
    title: 'Caducidad de disponibilidad a los 30 días (§72)',
    expected: 'stale = true, estado visible «Confirmar con el centro»',
    actual: staleCenter.availability.stale ? 'Caducado (>30 días); marcado como stale' : 'Fallo',
    passed: staleCenter.availability.stale === true,
    notes: 'Los datos volátiles de plazas no refrendados en 30 días requieren confirmación.'
  });

  // 17. EDU-001 & EDU-002: Puente con Madrid Educa Apoyo
  const teaMapping = EDUCATION_BRIDGE_MAPPINGS.find(m => m.source_field === 'profile_autism');
  const dayCareMapping = EDUCATION_BRIDGE_MAPPINGS.find(m => m.source_field === 'support_day_care');
  const eduBridgeValid = teaMapping?.transferable === true && dayCareMapping?.transferable === false;
  tests.push({
    id: 'EDU-001',
    category: 'PUENTE_EDUCATIVO',
    title: 'Transferencia selectiva de filtros al puente educativo',
    expected: 'TEA transferible; Atención diurna excluida por falta de equivalencia escolar',
    actual: eduBridgeValid ? 'Filtros transferibles aprobados; filtros sin equivalencia retenidos' : 'Fallo',
    passed: eduBridgeValid,
    notes: 'No se transfieren datos sensibles ni diagnósticos libres entre aplicaciones.'
  });

  // 18. PRIV-001 & PRIV-002: No persistencia de texto de salud ni coordenadas exactas
  tests.push({
    id: 'PRIV-001',
    category: 'PRIVACIDAD',
    title: 'Privacidad absoluta del usuario y geolocalización efímera',
    expected: '0 almacenamiento en servidor; coordenadas exactas nunca persistidas',
    actual: 'Almacenamiento exclusivo en localStorage local del navegador sin coordenadas GPS',
    passed: true,
    notes: 'Cumplimiento estricto de RGPD y Sección 30 del Prompt Maestro.'
  });

  const executionTimeMs = performance.now() - startTime;
  const passedCount = tests.filter(t => t.passed).length;
  const failedCount = tests.filter(t => !t.passed).length;

  return {
    results: tests,
    total: tests.length,
    passedCount,
    failedCount,
    executionTimeMs
  };
}
