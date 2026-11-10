/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Core Matching Engine
 * Algoritmo de ordenación lexicográfica explicable:
 * A1 < A2 < B1 < B2 < C. La distancia nunca supera la evidencia (§41, §78).
 * Separación estricta entre especialización, adecuación, disponibilidad y cercanía (§70).
 */

import { 
  SpecializedCentre, 
  SearchQueryState, 
  EvaluatedCentreResult, 
  EvidenceLevel, 
  SuitabilityStatus, 
  CombinationStatus, 
  CriterionEvidence, 
  MatchExplanation, 
  SupportTypeId 
} from '../types/specialized';
import { 
  CORE_PROFILES, 
  EXPERIMENTAL_PROFILES, 
  PENDING_PROFILES, 
  SUPPORT_TYPES, 
  FUNCTIONAL_NEEDS,
  LIFE_STAGES 
} from '../data/specializedTaxonomy';
import { resolveSearchOrigin, OriginReference, calculateHaversineDistanceKm } from '../data/municipalitiesData';

export const ACCESSIBILITY_MAP: Record<string, { label: string; keywords: string[] }> = {
  wheelchair_access: {
    label: 'Acceso silla de ruedas',
    keywords: [
      'silla', 'rueda', 'cota cero', 'rampa', 'elevador', 'nivel de calle', 
      'pie llano', 'planta baja', 'accesibilidad total', 'accesibilidad universal', 
      'pmr', 'adaptad', 'movilidad reducida'
    ]
  },
  magnetic_loops: {
    label: 'Bucles magnéticos',
    keywords: ['bucle', 'magnétic', 'auditiv', 'bucle magnético']
  },
  braille_signage: {
    label: 'Señalética braille',
    keywords: ['braille', 'señalización accesible', 'pictograma']
  }
};

/**
 * Comprueba si un centro declara una característica de accesibilidad física oficial
 */
export function centreHasAccessibilityFeature(centre: SpecializedCentre, needId: string): boolean {
  const rule = ACCESSIBILITY_MAP[needId];
  if (!rule) return false;
  const featuresText = (centre.accessibility_features || []).join(' ').toLowerCase();
  return rule.keywords.some(kw => featuresText.includes(kw));
}

/**
 * Calcula estimación realista de tiempo de traslado en transporte público (Metro, EMT, Cercanías)
 */
export function calculatePublicTransitTime(distanceKm: number): { minutes: number; label: string } {
  let minutes: number;
  if (distanceKm <= 1.2) {
    minutes = Math.round(5 + distanceKm * 8);
  } else if (distanceKm <= 8) {
    minutes = Math.round(10 + distanceKm * 2.6);
  } else {
    minutes = Math.round(14 + distanceKm * 2.2);
  }
  return {
    minutes,
    label: `~${minutes} min en transporte público`
  };
}

/**
 * Normaliza cadenas de búsqueda
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Obtiene la definición de un perfil en cualquier estado
 */
export function getProfileDefinition(profileId: string) {
  if (profileId in CORE_PROFILES) return CORE_PROFILES[profileId as keyof typeof CORE_PROFILES];
  if (profileId in EXPERIMENTAL_PROFILES) return EXPERIMENTAL_PROFILES[profileId as keyof typeof EXPERIMENTAL_PROFILES];
  if (profileId in PENDING_PROFILES) return PENDING_PROFILES[profileId as keyof typeof PENDING_PROFILES];
  return null;
}

/**
 * Evalúa si un centro ofrece un tipo de apoyo específico en su propia sede
 */
export function centreHasSupportInSite(centre: SpecializedCentre, supportId: SupportTypeId): boolean {
  if (centre.supports.includes(supportId)) return true;
  return centre.services_offered.some(s => s.service_type === supportId);
}

/**
 * Evalúa la combinación de apoyos según el modelo Proveedor/Centro/Sede (§82)
 */
export function evaluateSupportCombination(
  centre: SpecializedCentre,
  requestedSupports: SupportTypeId[],
  allCentres: SpecializedCentre[]
): {
  status: CombinationStatus;
  details: {
    support_id: SupportTypeId;
    support_label: string;
    status: 'confirmed' | 'no_consta' | 'incompatible';
    checked_at: string;
  }[];
} {
  if (requestedSupports.length === 0) {
    return { status: 'all_same_centre', details: [] };
  }

  const details = requestedSupports.map(supId => {
    const hasIt = centreHasSupportInSite(centre, supId);
    const label = SUPPORT_TYPES[supId]?.label || supId;
    return {
      support_id: supId,
      support_label: label,
      status: hasIt ? ('confirmed' as const) : ('no_consta' as const),
      checked_at: centre.last_checked
    };
  });

  const confirmedCount = details.filter(d => d.status === 'confirmed').length;

  if (confirmedCount === requestedSupports.length) {
    return { status: 'all_same_centre', details };
  }

  if (confirmedCount > 0) {
    // Check if missing supports are offered by other centres of the SAME provider (COMB-002)
    const sameProviderCentres = allCentres.filter(c => c.provider_id === centre.provider_id && c.centre_id !== centre.centre_id);
    const missingSupports = requestedSupports.filter(supId => !centreHasSupportInSite(centre, supId));
    
    const coveredByOtherSedes = missingSupports.every(supId => 
      sameProviderCentres.some(otherC => centreHasSupportInSite(otherC, supId))
    );

    if (coveredByOtherSedes && sameProviderCentres.length > 0) {
      return { status: 'same_provider_diff_centres', details };
    }

    return { status: 'partial_same_centre', details };
  }

  return { status: 'not_confirmed', details };
}

/**
 * Motor central de evaluación de un centro frente a una búsqueda
 */
export function evaluateCentre(
  centre: SpecializedCentre,
  query: SearchQueryState,
  allCentres: SpecializedCentre[],
  originCoords: [number, number] | null = null,
  originRef?: OriginReference
): EvaluatedCentreResult {
  const because: string[] = [];
  const does_not_confirm: string[] = [
    'Plazas disponibles en tiempo real (las plazas autorizadas son cupo máximo registral, no vacantes).',
    'Admisión directa inmediata (sujeta a derivación médica, reconocimiento de dependencia o valoración interna).',
    'Adecuación clínica individual (requiere valoración facultativa).'
  ];
  const suitability_reasons: string[] = [];
  const criterion_matrix: CriterionEvidence[] = [];

  // Resolución robusta del punto de origen de referencia geográfica (§67)
  const resolvedOrigin = originRef || resolveSearchOrigin(
    query.user_ephemeral_location,
    query.municipality,
    query.location_mode
  );
  const effectiveOrigin = originCoords || resolvedOrigin.coordinates;

  // 1. Evaluación de Distancia y Radio
  let distance_km: number | null = null;
  let distance_label = 'Sin coordenadas registrales';
  let transit_time_minutes: number | null = null;
  let transit_time_label: string | null = null;
  let is_in_radius = true;

  if (centre.has_valid_coordinates && centre.coordinates) {
    distance_km = calculateHaversineDistanceKm(effectiveOrigin, centre.coordinates);
    distance_label = `${distance_km.toFixed(1)} km`;

    const transit = calculatePublicTransitTime(distance_km);
    transit_time_minutes = transit.minutes;
    transit_time_label = transit.label;

    // Si el usuario eligió un origen específico (GPS o municipio), se aplica el radio estricto
    if (resolvedOrigin.isCustom) {
      if (query.radius_km > 0 && distance_km > query.radius_km) {
        is_in_radius = false;
      }
    } else {
      // Si está en modo global Madrid, se muestran todos los centros salvo que reduzca el radio a menos de 25km
      if (query.radius_km < 25 && distance_km > query.radius_km) {
        is_in_radius = false;
      }
    }

    criterion_matrix.push({
      criterion_id: 'geo.proximity',
      criterion_label: 'Proximidad y transporte público',
      requested: true,
      status: 'calculated',
      note: `Distancia: ${distance_label} · Transporte público: ${transit_time_label} (referencia: ${resolvedOrigin.name}${resolvedOrigin.isCustom ? `, radio: ${query.radius_km} km` : ''})`
    });
  } else {
    distance_km = null;
    distance_label = 'Sin coordenadas registrales';
    transit_time_minutes = null;
    transit_time_label = null;
    is_in_radius = true; // Section 63: Centros sin coordenadas permanecen en lista y no participan en cálculo de radio (GEO-001/002)
    criterion_matrix.push({
      criterion_id: 'geo.proximity',
      criterion_label: 'Proximidad geográfica',
      requested: true,
      status: 'not_stated',
      note: 'Centro sin coordenadas geográficas en el registro oficial. Se muestra en lista con advertencia (GEO-001/002).'
    });
  }

  // 2. Evaluación de Perfil / Condición y Reglas Negativas
  let hasExplicitProfile = false;
  let hasRelatedServicesOnly = false;
  let isForbiddenInference = false;

  if (query.profile) {
    const profileDef = getProfileDefinition(query.profile);
    const profileLabel = profileDef?.preferred_label || query.profile;

    // Chequeo explícito
    if (centre.explicit_specialisations.includes(query.profile)) {
      hasExplicitProfile = true;
      because.push(`La fuente oficial del registro declara expresamente especialización en ${profileLabel}.`);
      criterion_matrix.push({
        criterion_id: `profile.${query.profile}`,
        criterion_label: `Perfil: ${profileLabel}`,
        requested: true,
        status: 'confirmed',
        source_url: centre.provenance_records.find(p => p.attribute_name === 'specialisation')?.source_url,
        source_fragment: `Especialización autorizada: ${centre.subtype || centre.centre_type}`,
        checked_at: centre.last_checked
      });
    } else {
      // Reglas negativas (§26.1, §44)
      if (query.profile === 'autism') {
        const mentionsDI = centre.subtype?.toLowerCase().includes('discapacidad intelectual') || 
                           centre.sector?.toLowerCase().includes('discapacidad intelectual');
        if (mentionsDI) {
          isForbiddenInference = true;
          suitability_reasons.push('Regla negativa NEG-003: Discapacidad Intelectual no infiere TEA.');
        }
      }

      if (query.profile === 'acquired_brain_injury') {
        const hasGeneralNeurology = centre.related_services.some(s => s.toLowerCase().includes('neurolog'));
        if (hasGeneralNeurology) {
          hasRelatedServicesOnly = true;
          because.push('El centro dispone de neurología ambulatoria general, pero no consta en el registro unidad específica de daño cerebral adquirido.');
        }
      }

      if (query.profile === 'spinal_cord_injury' || query.profile === 'cerebral_palsy') {
        const hasGenFisio = centre.related_services.some(s => s.toLowerCase().includes('fisioterapia general'));
        if (hasGenFisio) {
          isForbiddenInference = true;
          suitability_reasons.push('Regla negativa NEG-002: Fisioterapia o discapacidad física general no demuestra lesión medular ni parálisis cerebral.');
        }
      }

      // Comprobar si al menos tiene servicios relacionados
      if (profileDef && !isForbiddenInference) {
        const matchedServices = profileDef.related_services.filter(rel => 
          centre.related_services.some(cRel => cRel.toLowerCase().includes(rel.toLowerCase())) ||
          centre.supports.some(sup => sup.toLowerCase().includes(rel.toLowerCase()))
        );
        if (matchedServices.length >= 2) {
          hasRelatedServicesOnly = true;
          because.push(`Declara servicios relacionados (${matchedServices.slice(0, 3).join(', ')}), aunque la condición concreta no está expresada en el título.`);
        } else if (matchedServices.length === 1) {
          hasRelatedServicesOnly = true;
          because.push(`Declara el servicio relacionado de ${matchedServices[0]}.`);
        }
      }

      criterion_matrix.push({
        criterion_id: `profile.${query.profile}`,
        criterion_label: `Perfil: ${profileLabel}`,
        requested: true,
        status: hasRelatedServicesOnly ? 'confirm_required' : 'not_stated',
        note: hasRelatedServicesOnly ? 'Servicio relacionado presente; especialización no confirmada' : 'Especialización no declarada en el registro'
      });
    }
  }

  // 3. Evaluación de Apoyos y Combinación en la misma sede (§82)
  const combinationResult = evaluateSupportCombination(centre, query.support_types, allCentres);
  const requestedSupportsConfirmedInThisCentre = query.support_types.every(st => centreHasSupportInSite(centre, st));
  const someSupportsConfirmed = query.support_types.some(st => centreHasSupportInSite(centre, st));

  if (query.support_types.length > 0) {
    query.support_types.forEach(st => {
      const supLabel = SUPPORT_TYPES[st]?.label || st;
      const isConfirmed = centreHasSupportInSite(centre, st);
      criterion_matrix.push({
        criterion_id: `support.${st}`,
        criterion_label: `Apoyo: ${supLabel}`,
        requested: true,
        status: isConfirmed ? 'confirmed' : 'not_stated',
        note: isConfirmed ? 'Servicio autorizado y comprobado en esta sede' : 'No consta en la oferta asistencial registrada de este centro'
      });
    });

    if (requestedSupportsConfirmedInThisCentre) {
      because.push(`Ofrece todos los apoyos solicitados (${query.support_types.map(s => SUPPORT_TYPES[s]?.label).join(', ')}) en esta misma sede.`);
    } else if (someSupportsConfirmed) {
      because.push('Ofrece parte de los apoyos solicitados en esta sede física.');
    }
  }

  // 4. Evaluación de Etapa Vital (§3.3, §70, §78)
  let lifeStageCompatible = true;
  if (query.life_stage) {
    const stageLabel = LIFE_STAGES[query.life_stage]?.label || query.life_stage;
    if (centre.allowed_life_stages.includes(query.life_stage)) {
      criterion_matrix.push({
        criterion_id: `lifestage.${query.life_stage}`,
        criterion_label: `Etapa vital: ${stageLabel}`,
        requested: true,
        status: 'confirmed',
        note: 'Etapa vital admitida por la acreditación oficial del centro.'
      });
    } else {
      lifeStageCompatible = false;
      suitability_reasons.push(`El centro no está acreditado para ${stageLabel} (rango autorizado: ${centre.allowed_life_stages.map(s => LIFE_STAGES[s]?.label).join(', ')}).`);
      criterion_matrix.push({
        criterion_id: `lifestage.${query.life_stage}`,
        criterion_label: `Etapa vital: ${stageLabel}`,
        requested: true,
        status: 'incompatible',
        note: 'Incompatibilidad de etapa vital según resolución de autorización.'
      });
    }
  }

  // 5. Preferencia de Red (Pública / Concertada / Privada autorizada)
  if (query.network_preference !== 'all') {
    const prefLabel = query.network_preference === 'public_network' ? 'Red Pública / Concertada' : 'Privado autorizado';
    const isPublicMatch = query.network_preference === 'public_network' && (centre.public_private_status === 'red_publica' || centre.public_private_status === 'concertado');
    const isPrivateMatch = query.network_preference === 'private_authorised' && centre.public_private_status === 'privado_autorizado';
    const matchesNet = isPublicMatch || isPrivateMatch;

    criterion_matrix.push({
      criterion_id: 'network.preference',
      criterion_label: `Titularidad: ${prefLabel}`,
      requested: true,
      status: matchesNet ? 'confirmed' : 'confirm_required',
      note: `Titularidad oficial registrada: ${centre.public_private_status === 'red_publica' ? 'Red Pública directa' : centre.public_private_status === 'concertado' ? 'Plazas públicas concertadas' : 'Centro privado autorizado'}`
    });
  }

  // 5b. Evaluación de Accesibilidad Física Oficial
  let accessibilityCompatible = true;
  if (query.accessibility_needs && query.accessibility_needs.length > 0) {
    query.accessibility_needs.forEach(needId => {
      const featRule = ACCESSIBILITY_MAP[needId];
      const featLabel = featRule?.label || needId;
      const isConfirmed = centreHasAccessibilityFeature(centre, needId);

      criterion_matrix.push({
        criterion_id: `accessibility.${needId}`,
        criterion_label: `Accesibilidad: ${featLabel}`,
        requested: true,
        status: isConfirmed ? 'confirmed' : 'not_stated',
        note: isConfirmed 
          ? 'Requisito de accesibilidad física oficial confirmado en el centro.' 
          : 'No consta este requisito de accesibilidad en los datos registrados del centro.'
      });

      if (!isConfirmed) {
        accessibilityCompatible = false;
        suitability_reasons.push(`El centro no acredita el requisito de accesibilidad: ${featLabel}.`);
      }
    });

    if (accessibilityCompatible) {
      because.push(`Cumple todos los requisitos de accesibilidad física solicitados (${query.accessibility_needs.map(n => ACCESSIBILITY_MAP[n]?.label || n).join(', ')}).`);
    }
  }

  // 5c. Evaluación de Necesidades Funcionales Observables (§50.1)
  if (query.functional_needs && query.functional_needs.length > 0) {
    query.functional_needs.forEach(needId => {
      const needLabel = FUNCTIONAL_NEEDS[needId]?.label || needId;
      criterion_matrix.push({
        criterion_id: `functional.${needId}`,
        criterion_label: `Necesidad funcional: ${needLabel}`,
        requested: true,
        status: 'confirmed',
        note: `Criterio observable activo considerado en el plan de apoyos.`
      });
    });
  }

  // 6. Clasificación de Nivel de Evidencia (§27)
  let evidence_level: EvidenceLevel = 'C';

  if (hasExplicitProfile) {
    if (query.support_types.length === 0 || requestedSupportsConfirmedInThisCentre) {
      evidence_level = 'A1';
    } else if (someSupportsConfirmed || query.support_types.length > 0) {
      evidence_level = 'A2';
    } else {
      evidence_level = 'A2';
    }
  } else if (hasRelatedServicesOnly && !isForbiddenInference) {
    const isGeneralNeurologyOnly = query.profile === 'acquired_brain_injury' && 
      centre.related_services.some(s => s.toLowerCase().includes('neurolog')) && 
      !hasExplicitProfile;
    const relCount = centre.related_services.length;
    if (relCount >= 2 && lifeStageCompatible && !isGeneralNeurologyOnly) {
      evidence_level = 'B1';
    } else {
      evidence_level = 'B2';
    }
  } else {
    evidence_level = 'C';
    because.push('Orientación general: el centro pertenece al sector asistencial pero no declara la especialización concreta en fuentes estructuradas.');
  }

  // 7. Adecuación a la búsqueda (§70)
  let suitability: SuitabilityStatus = 'complete';

  if (!lifeStageCompatible || isForbiddenInference || !accessibilityCompatible) {
    suitability = 'incompatible';
  } else if (
    (query.support_combination_mode === 'all_supports_same_centre' && !requestedSupportsConfirmedInThisCentre && query.support_types.length > 1) ||
    (!hasExplicitProfile && hasRelatedServicesOnly) ||
    (query.network_preference !== 'all' && (
      (query.network_preference === 'public_network' && centre.public_private_status === 'privado_autorizado') ||
      (query.network_preference === 'private_authorised' && centre.public_private_status === 'red_publica')
    ))
  ) {
    suitability = 'partial';
  } else if (query.profile && !hasExplicitProfile && !hasRelatedServicesOnly) {
    suitability = 'unknown';
  }

  // 8. Cálculo de Puntuación Lexicográfica de Ordenación (§41, §78)
  // Regla: A1 < A2 < B1 < B2 < C. Ninguna distancia hace que C supere a A o B.
  const evidenceRankMap: Record<EvidenceLevel, number> = {
    A1: 1000000,
    A2: 2000000,
    B1: 3000000,
    B2: 4000000,
    C:  5000000
  };

  const suitabilityRankMap: Record<SuitabilityStatus, number> = {
    complete: 0,
    partial: 100000,
    unknown: 200000,
    incompatible: 900000
  };

  const combinationRank = (query.support_combination_mode === 'all_supports_same_centre' && !requestedSupportsConfirmedInThisCentre) ? 50000 : 0;
  const distRank = distance_km !== null ? Math.min(Math.round(distance_km * 10), 9999) : 5000;

  const sort_rank = evidenceRankMap[evidence_level] + suitabilityRankMap[suitability] + combinationRank + distRank;

  // 9. Construcción de Fuentes y Explicación
  const sources = centre.provenance_records.map(p => ({
    attribute: p.attribute_name,
    source_dataset: p.source_dataset,
    source_url: p.source_url,
    fragment: p.value
  }));

  const match_assessment: MatchExplanation = {
    level: evidence_level,
    suitability,
    because,
    does_not_confirm,
    sources,
    suitability_reasons
  };

  return {
    centre,
    match_assessment,
    evidence_level,
    suitability,
    combination_status: combinationResult.status,
    combination_details: combinationResult.details,
    distance_km,
    distance_label,
    transit_time_minutes,
    transit_time_label,
    is_in_radius,
    criterion_matrix,
    sort_rank
  };
}

/**
 * Ejecuta la búsqueda completa sobre el conjunto de centros
 */
export function runSpecializedSearch(
  query: SearchQueryState,
  centres: SpecializedCentre[],
  originCoords: [number, number] | null = null
): {
  results: EvaluatedCentreResult[];
  total_results: number;
  incompatible_results: EvaluatedCentreResult[];
  map_stats: { visible_results: number; without_coordinates: number };
  applied_filters_count: number;
  resolved_origin: OriginReference;
} {
  const resolvedOrigin = resolveSearchOrigin(
    query.user_ephemeral_location,
    query.municipality,
    query.location_mode
  );
  const effectiveOrigin = originCoords || resolvedOrigin.coordinates;

  const evaluated = centres.map(c => evaluateCentre(c, query, centres, effectiveOrigin, resolvedOrigin));

  // Separar incompatibles según §78 ("Orden 1: excluir incompatibilidades de la lista principal")
  const primaryCandidates: EvaluatedCentreResult[] = [];
  const incompatibleList: EvaluatedCentreResult[] = [];

  for (const item of evaluated) {
    if (item.suitability === 'incompatible') {
      incompatibleList.push(item);
    } else {
      // Filtrar por radio si procede (centros sin coordenadas permanecen en lista: GEO-001/002)
      if (item.is_in_radius) {
        primaryCandidates.push(item);
      }
    }
  }

  // Filtrado de combinación en misma sede si el usuario lo exige de forma estricta
  let filtered = primaryCandidates;

  // Orden lexicográfico estricto (§41, §78)
  filtered.sort((a, b) => a.sort_rank - b.sort_rank);
  incompatibleList.sort((a, b) => a.sort_rank - b.sort_rank);

  let withoutCoords = 0;
  let visibleInMap = 0;
  filtered.forEach(r => {
    if (r.centre.has_valid_coordinates) visibleInMap++;
    else withoutCoords++;
  });

  let activeFilters = 0;
  if (query.profile) activeFilters++;
  if (query.support_types.length > 0) activeFilters += query.support_types.length;
  if (query.life_stage) activeFilters++;
  if (query.municipality || (query.location_mode === 'browser' && query.user_ephemeral_location)) activeFilters++;
  if (query.network_preference !== 'all') activeFilters++;
  if (query.accessibility_needs.length > 0) activeFilters += query.accessibility_needs.length;

  return {
    results: filtered,
    total_results: filtered.length,
    incompatible_results: incompatibleList,
    map_stats: { visible_results: visibleInMap, without_coordinates: withoutCoords },
    applied_filters_count: activeFilters,
    resolved_origin: resolvedOrigin
  };
}
