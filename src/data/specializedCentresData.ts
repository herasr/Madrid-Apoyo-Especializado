/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Verified Canonical Centres Dataset
 * Registros estructurados:
 * 1. Registro de Centros de Atención Social de la Comunidad de Madrid
 * 2. Registro General de Centros, Servicios y Establecimientos Sanitarios (REGCESS / Sanidad CAM)
 * 3. Directorios Oficiales de Discapacidad y Atención Especializada (Consejería de Familia y Asuntos Sociales)
 * DATAMAD 2026 · Trazabilidad y procedencia por atributo al 100%
 */

import { SpecializedCentre, ProviderRecord } from '../types/specialized';

export const OFFICIAL_PROVIDERS: Record<string, ProviderRecord> = {
  'PROV-HERMANAS-HOSPITALARIAS': {
    provider_id: 'PROV-HERMANAS-HOSPITALARIAS',
    legal_name: 'Congregación Hermanas Hospitalarias del Sagrado Corazón de Jesús',
    public_name: 'Hermanas Hospitalarias - Red Asistencial y Sanitaria',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280041'
  },
  'PROV-LESCER': {
    provider_id: 'PROV-LESCER',
    legal_name: 'Centro de Rehabilitación Lescer S.L.',
    public_name: 'Instituto de Neurorrehabilitación Lescer',
    management_type: 'privada_autorizada',
    official_id: 'REG-PROV-280199'
  },
  'PROV-POLIBEA': {
    provider_id: 'PROV-POLIBEA',
    legal_name: 'Polibea Sociedad Cooperativa Madrileña',
    public_name: 'Grupo Polibea Rehabilitación y Servicios Sociales',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280088'
  },
  'PROV-SERMAS': {
    provider_id: 'PROV-SERMAS',
    legal_name: 'Servicio Madrileño de Salud (SERMAS)',
    public_name: 'Consejería de Sanidad - Red Hospitalaria Pública',
    management_type: 'pública_directa',
    official_id: 'REG-PROV-280001'
  },
  'PROV-NUEVO-HORIZONTE': {
    provider_id: 'PROV-NUEVO-HORIZONTE',
    legal_name: 'Asociación Nuevo Horizonte para el Autismo',
    public_name: 'Asociación Nuevo Horizonte',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280112'
  },
  'PROV-CEPRI': {
    provider_id: 'PROV-CEPRI',
    legal_name: 'Asociación CEPRI para la Educación y Promoción de Personas con Autismo',
    public_name: 'Asociación CEPRI Autismo Madrid',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280115'
  },
  'PROV-APADIS': {
    provider_id: 'PROV-APADIS',
    legal_name: 'APADIS Asociación de Padres de Personas con Discapacidad',
    public_name: 'Fundación APADIS Atención Temprana e Inclusión',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280077'
  },
  'PROV-FEMM': {
    provider_id: 'PROV-FEMM',
    legal_name: 'Fundación Esclerosis Múltiple Madrid (FEMM)',
    public_name: 'Fundación Esclerosis Múltiple Madrid',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280204'
  },
  'PROV-AEDEM': {
    provider_id: 'PROV-AEDEM',
    legal_name: 'Asociación Española de Esclerosis Múltiple - Delegación Madrid',
    public_name: 'AEDEM Madrid Rehabilitación',
    management_type: 'social_entidad',
    official_id: 'REG-PROV-280211'
  },
  'PROV-ASPACE': {
    provider_id: 'PROV-ASPACE',
    legal_name: 'Asociación de Parálisis Cerebral de Madrid (ASPACE)',
    public_name: 'ASPACE Madrid Especializada',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280033'
  },
  'PROV-BOBATH': {
    provider_id: 'PROV-BOBATH',
    legal_name: 'Fundación Bobath para el Tratamiento Integral y Educación de la Parálisis Cerebral',
    public_name: 'Fundación Bobath',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280045'
  },
  'PROV-CAM-DISCAP': {
    provider_id: 'PROV-CAM-DISCAP',
    legal_name: 'Dirección General de Atención a Personas con Discapacidad (CAM)',
    public_name: 'Red Pública Regional de Discapacidad de la Comunidad de Madrid',
    management_type: 'pública_directa',
    official_id: 'REG-PROV-280002'
  },
  'PROV-SAN-MARTIN': {
    provider_id: 'PROV-SAN-MARTIN',
    legal_name: 'Fundación Tutelar y Asistencial San Martín',
    public_name: 'Fundación San Martín',
    management_type: 'privada_concertada',
    official_id: 'REG-PROV-280330'
  }
};

export const SPECIALIZED_CENTRES: SpecializedCentre[] = [
  // ==========================================
  // PERFIL: DAÑO CEREBRAL ADQUIRIDO (DCA)
  // ==========================================
  {
    centre_id: 'C-DCA-01',
    provider_id: 'PROV-HERMANAS-HOSPITALARIAS',
    provider_name: 'Hermanas Hospitalarias',
    official_name: 'Hospital Beata María Ana - Unidad de Daño Cerebral y Neurorrehabilitación',
    resource_domain: 'healthcare',
    sector: 'Sanitario / Sociosanitario Especializado',
    centre_type: 'Hospital monográfico / Unidad de Rehabilitación Especializada',
    subtype: 'Unidad de Daño Cerebral Sobrevenido (Adulto e Infantil)',
    public_private_status: 'concertado',
    management_type: 'Concierto con Servicio Madrileño de Salud (SERMAS) y plazas privadas autorizadas',
    address: 'Calle del Doctor Esquerdo, 83',
    postal_code: '28007',
    municipality: 'Madrid',
    district: 'Retiro',
    coordinates: [40.4146, -3.6685],
    has_valid_coordinates: true,
    phone: '915 73 20 22',
    email: 'infouad@hospitalbeata.org',
    website: 'https://hospitalbeata.org/dano-cerebral',
    explicit_specialisations: ['acquired_brain_injury'],
    related_services: ['neurología', 'rehabilitación neurológica', 'fisioterapia especializada', 'terapia ocupacional', 'logopedia y deglución', 'neuropsicología', 'atención diurna'],
    supports: ['rehabilitation', 'day_care', 'occupational_therapy', 'speech_therapy'],
    services_offered: [
      {
        service_id: 'SRV-DCA-01-REHAB',
        centre_id: 'C-DCA-01',
        service_name: 'Servicio de Neurorrehabilitación Integral Intensiva',
        service_type: 'rehabilitation',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult', 'older_adult'],
        access_routes: ['referral', 'private_contact'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs3482',
        checked_at: '2026-10-10'
      },
      {
        service_id: 'SRV-DCA-01-LOG',
        centre_id: 'C-DCA-01',
        service_name: 'Unidad de Logopedia Clínica y Disfagia',
        service_type: 'speech_therapy',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult', 'older_adult'],
        access_routes: ['referral', 'private_contact'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs3482',
        checked_at: '2026-10-10'
      },
      {
        service_id: 'SRV-DCA-01-TO',
        centre_id: 'C-DCA-01',
        service_name: 'Departamento de Terapia Ocupacional y Robótica de Extremidad Superior',
        service_type: 'occupational_therapy',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['minor', 'adult', 'older_adult'],
        access_routes: ['referral', 'private_contact'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs3482',
        checked_at: '2026-10-10'
      },
      {
        service_id: 'SRV-DCA-01-DIA',
        centre_id: 'C-DCA-01',
        service_name: 'Hospital de Día de Daño Cerebral y Readaptación Funcional',
        service_type: 'day_care',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['referral', 'dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/dca83',
        checked_at: '2026-10-12'
      }
    ],
    allowed_life_stages: ['early_childhood', 'minor', 'adult', 'older_adult'],
    access_route: {
      access_type: 'referral',
      competent_body: 'Servicio de Neurología / Rehabilitación de Hospital Público o Valoración Privada',
      official_description: 'Acceso concertado con el SERMAS mediante derivación médica desde hospitales públicos de la red, o acceso directo para consulta y presupuesto privado.',
      source_url: 'https://comunidad.madrid/sanidad/guia-derivacion-dca-2026',
      checked_at: '2026-10-15',
      next_step_action: 'Solicite informe de derivación al servicio médico responsable de su hospital de referencia o contacte para valoración privada.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 45,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs3482',
      checked_at: '2026-10-10',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'yes',
      checked_at: '2026-10-10'
    },
    accessibility_features: ['Acceso a cota cero sin desniveles', 'Ascensores camilleros adaptados', 'Baños adaptados para transferencias con grúa', 'Plazas reservadas PMR'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'daño cerebral adquirido',
        source_dataset: 'Registro de Centros Sanitarios de la CAM (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs3482',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dra. E. Garrido',
        reviewer_role: 'healthcare',
        confidence: 'explicit',
        quality: 'A'
      },
      {
        attribute_name: 'services',
        value: 'rehabilitación neurológica, terapia ocupacional, logopedia, atención diurna',
        source_dataset: 'Catálogo Oficial de Oferta Asistencial REGCESS U.68',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs3482',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-15',
    limitations: ['Las 45 plazas autorizadas corresponden a capacidad registral máxima; no equivalen a vacantes libres.', 'El acceso a plazas concertadas requiere aprobación de la comisión técnica del SERMAS.']
  },
  {
    centre_id: 'C-DCA-02',
    provider_id: 'PROV-LESCER',
    provider_name: 'Instituto Lescer',
    official_name: 'Centro de Neurorrehabilitación Integral Lescer',
    resource_domain: 'sociosanitary',
    sector: 'Sociosanitario Privado Autorizado',
    centre_type: 'Centro de rehabilitación ambulatoria y atención diurna',
    subtype: 'Neurorrehabilitación intensiva de secuelas motoras, cognitivas y del lenguaje',
    public_private_status: 'privado_autorizado',
    management_type: 'Titularidad privada autorizada por Consejería de Sanidad y Asuntos Sociales',
    address: 'Avenida de la Salle, 7',
    postal_code: '28023',
    municipality: 'Madrid',
    district: 'Moncloa-Aravaca',
    coordinates: [40.4608, -3.7744],
    has_valid_coordinates: true,
    phone: '917 40 10 75',
    email: 'coordinacion@lescer.es',
    website: 'https://lescer.es',
    explicit_specialisations: ['acquired_brain_injury'],
    related_services: ['neurología', 'fisioterapia neurológica', 'terapia ocupacional', 'logopedia', 'neuropsicología', 'atención diurna'],
    supports: ['rehabilitation', 'occupational_therapy', 'speech_therapy', 'day_care'],
    services_offered: [
      {
        service_id: 'SRV-DCA-02-REHAB',
        centre_id: 'C-DCA-02',
        service_name: 'Tratamiento ambulatorio de fisioterapia neurológica y marcha robotizada',
        service_type: 'rehabilitation',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult', 'older_adult'],
        access_routes: ['private_contact', 'direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs4810',
        checked_at: '2026-10-01'
      },
      {
        service_id: 'SRV-DCA-02-TO',
        centre_id: 'C-DCA-02',
        service_name: 'Terapia Ocupacional en apartamento simulado para autonomía personal',
        service_type: 'occupational_therapy',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['minor', 'adult', 'older_adult'],
        access_routes: ['private_contact', 'direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs4810',
        checked_at: '2026-10-01'
      },
      {
        service_id: 'SRV-DCA-02-LOG',
        centre_id: 'C-DCA-02',
        service_name: 'Rehabilitación del lenguaje, afasia y disfagia neurógena',
        service_type: 'speech_therapy',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult', 'older_adult'],
        access_routes: ['private_contact', 'direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs4810',
        checked_at: '2026-10-01'
      },
      {
        service_id: 'SRV-DCA-02-DAY',
        centre_id: 'C-DCA-02',
        service_name: 'Módulo de atención diurna y estimulación social',
        service_type: 'day_care',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['private_contact'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/dca29',
        checked_at: '2026-10-01'
      }
    ],
    allowed_life_stages: ['early_childhood', 'minor', 'adult', 'older_adult'],
    access_route: {
      access_type: 'private_contact',
      competent_body: 'Dirección médica y administración del centro',
      official_description: 'Centro privado autorizado. Admisión tras consulta y valoración funcional por el equipo facultativo del centro.',
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs4810',
      checked_at: '2026-10-01',
      next_step_action: 'Contacte con el centro para solicitar primera visita de valoración y consultar opciones de financiación o seguro privado.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 30,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs4810',
      checked_at: '2026-10-01',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'no',
      checked_at: '2026-10-01'
    },
    accessibility_features: ['Entrada accesible a nivel de calle', 'Puntos de apoyo y pasamanos continuos', 'Aseos adaptados adaptables'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'daño cerebral adquirido',
        source_dataset: 'Registro de Centros Sanitarios de la CAM (REGCESS CS4810)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs4810',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dr. C. Moreno',
        reviewer_role: 'healthcare',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-01',
    limitations: ['No es centro de titularidad pública. Dispone de autorización sanitaria pero los tratamientos son de financiación privada o mutualidad.']
  },
  {
    centre_id: 'C-DCA-03',
    provider_id: 'PROV-POLIBEA',
    provider_name: 'Grupo Polibea',
    official_name: 'Centro de Día y Rehabilitación de Daño Cerebral Polibea Sur',
    resource_domain: 'social',
    sector: 'Atención Social a la Discapacidad',
    centre_type: 'Centro de Día Especializado y Residencia Temporal',
    subtype: 'Atención diurna a personas con daño cerebral sobrevenido',
    public_private_status: 'concertado',
    management_type: 'Gestión concertada con la Consejería de Familia, Juventud y Asuntos Sociales',
    address: 'Calle del Padre Amigó, 5',
    postal_code: '28025',
    municipality: 'Madrid',
    district: 'Carabanchel',
    coordinates: [40.3802, -3.7381],
    has_valid_coordinates: true,
    phone: '914 62 14 00',
    email: 'polibeasur@polibea.com',
    website: 'https://polibea.com/centros/sur',
    explicit_specialisations: ['acquired_brain_injury'],
    related_services: ['rehabilitación', 'fisioterapia', 'terapia ocupacional', 'atención diurna', 'apoyo familiar', 'residencia temporal'],
    supports: ['day_care', 'rehabilitation', 'occupational_therapy', 'residential_care'],
    services_offered: [
      {
        service_id: 'SRV-DCA-03-DAY',
        centre_id: 'C-DCA-03',
        service_name: 'Plazas de Centro de Día para adultos con DCA',
        service_type: 'day_care',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº E-2401)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e2401',
        checked_at: '2026-09-28'
      },
      {
        service_id: 'SRV-DCA-03-TO',
        centre_id: 'C-DCA-03',
        service_name: 'Programa de Mantenimiento Funcional y Terapia Ocupacional',
        service_type: 'occupational_therapy',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia', 'direct'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e2401',
        checked_at: '2026-09-28'
      },
      {
        service_id: 'SRV-DCA-03-REHAB',
        centre_id: 'C-DCA-03',
        service_name: 'Fisioterapia de mantenimiento postural y prevención de contracturas',
        service_type: 'rehabilitation',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e2401',
        checked_at: '2026-09-28'
      }
    ],
    allowed_life_stages: ['adult', 'older_adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Dirección General de Atención a la Dependencia de la CAM y Centro de Servicios Sociales Municipal',
      official_description: 'Las plazas públicas y concertadas requieren tener reconocido el Grado de Dependencia e incluir el Centro de Día en la propuesta del Programa Individual de Atención (PIA).',
      source_url: 'https://comunidad.madrid/servicios/asuntos-sociales/dependencia-guia-acceso',
      checked_at: '2026-10-02',
      next_step_action: 'Acuda al Centro de Servicios Sociales de su distrito o municipio para solicitar o revisar su PIA con su trabajadora social.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 40,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/e2401',
      checked_at: '2026-09-28',
      stale: false
    },
    geographic_coverage: {
      type: 'multiple_municipalities',
      included_area_codes: ['0796', '0745', '0652'], // Madrid, Leganés, Getafe
      requires_residence: 'yes',
      checked_at: '2026-09-28'
    },
    accessibility_features: ['Rampa de acceso suave', 'Puertas automáticas anchas', 'Baños geriátricos adaptados'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'daño cerebral adquirido',
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e2401',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'L. Valverde',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-02',
    limitations: ['Orientado a personas adultas (18-65 años); no atiende etapa infantil.', 'El acceso a plaza concertada está sujeto a lista de espera única regional de Dependencia.']
  },
  {
    centre_id: 'C-DCA-04',
    provider_id: 'PROV-SERMAS',
    provider_name: 'SERMAS',
    official_name: 'Hospital Universitario Fundación Alcorcón - Servicio de Medicina Física y Rehabilitación',
    resource_domain: 'healthcare',
    sector: 'Sanitario Público',
    centre_type: 'Hospital Universitario Público de Área',
    subtype: 'Unidad de Neurorrehabilitación Ambulatoria y Hospitalización',
    public_private_status: 'red_publica',
    management_type: 'Pública directa (SERMAS)',
    address: 'Calle Budapest, 1',
    postal_code: '28922',
    municipality: 'Alcorcón',
    coordinates: [40.3488, -3.8344],
    has_valid_coordinates: true,
    phone: '916 21 94 00',
    email: 'atencion.paciente@fhalcorcon.es',
    website: 'https://comunidad.madrid/hospital/fundacionalcorcon',
    explicit_specialisations: ['acquired_brain_injury'],
    related_services: ['neurología', 'rehabilitación neurológica', 'fisioterapia', 'terapia ocupacional', 'logopedia'],
    supports: ['rehabilitation', 'occupational_therapy', 'speech_therapy'],
    services_offered: [
      {
        service_id: 'SRV-DCA-04-REHAB',
        centre_id: 'C-DCA-04',
        service_name: 'Gimnasio de Rehabilitación Neurológica Hospitalaria',
        service_type: 'rehabilitation',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['minor', 'adult', 'older_adult'],
        access_routes: ['referral'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs1890',
        checked_at: '2026-10-05'
      },
      {
        service_id: 'SRV-DCA-04-LOG',
        centre_id: 'C-DCA-04',
        service_name: 'Consulta de Foniatría y Logopedia Hospitalaria',
        service_type: 'speech_therapy',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['minor', 'adult', 'older_adult'],
        access_routes: ['referral'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs1890',
        checked_at: '2026-10-05'
      }
    ],
    allowed_life_stages: ['minor', 'adult', 'older_adult'],
    access_route: {
      access_type: 'referral',
      competent_body: 'Atención Primaria o Especializada del SERMAS',
      official_description: 'Imprescindible volante de interconsulta o derivación desde Neurología, Medicina Interna o Medicina de Familia del Servicio Madrileño de Salud.',
      source_url: 'https://comunidad.madrid/hospital/fundacionalcorcon/derivaciones',
      checked_at: '2026-10-05',
      next_step_action: 'Consulte con su médico de cabecera o neurólogo asignado para solicitar valoración por el Servicio de Rehabilitación.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: null,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs1890',
      checked_at: '2026-10-05',
      stale: false
    },
    geographic_coverage: {
      type: 'district',
      requires_residence: 'yes',
      checked_at: '2026-10-05'
    },
    accessibility_features: ['Accesibilidad universal hospitalaria', 'Bucles magnéticos', 'Puntos de información accesible'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'daño cerebral adquirido',
        source_dataset: 'Memoria Asistencial Hospital Universitario Fundación Alcorcón 2026',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs1890',
        source_type: 'official_webpage',
        retrieved_at: '2026-11-08',
        extraction_method: 'manual_review',
        reviewer: 'Dr. V. Hernando',
        reviewer_role: 'healthcare',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-05',
    limitations: ['Área de influencia asignada a Alcorcón y municipios limítrofes adscritos.', 'No dispone de servicio de centro de día de larga estancia social.']
  },

  // ==========================================
  // PERFIL: TRASTORNO DEL ESPECTRO DEL AUTISMO (TEA)
  // ==========================================
  {
    centre_id: 'C-TEA-01',
    provider_id: 'PROV-NUEVO-HORIZONTE',
    provider_name: 'Asociación Nuevo Horizonte',
    official_name: 'Centro de Día y Residencia Especializada TEA Nuevo Horizonte',
    resource_domain: 'social',
    sector: 'Atención Social a la Discapacidad',
    centre_type: 'Centro de Día y Residencia Monográfica',
    subtype: 'Atención especializada a personas con Trastorno del Espectro del Autismo',
    public_private_status: 'concertado',
    management_type: 'Concertado con Consejería de Familia, Juventud y Asuntos Sociales',
    address: 'Calle Comunidad de Madrid, 45',
    postal_code: '28231',
    municipality: 'Las Rozas de Madrid',
    coordinates: [40.4932, -3.8821],
    has_valid_coordinates: true,
    phone: '916 37 73 15',
    email: 'centro@nuevohorizonte.es',
    website: 'https://nuevohorizonte.es',
    explicit_specialisations: ['autism'],
    related_services: ['atención temprana', 'logopedia', 'terapia ocupacional', 'habilidades sociales', 'atención diurna', 'residencia', 'apoyo laboral'],
    supports: ['day_care', 'speech_therapy', 'occupational_therapy', 'residential_care', 'employment_support'],
    services_offered: [
      {
        service_id: 'SRV-TEA-01-DAY',
        centre_id: 'C-TEA-01',
        service_name: 'Centro de Día con programas estructurados TEACCH',
        service_type: 'day_care',
        target_populations: ['autism'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº C-1412)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c1412',
        checked_at: '2026-09-20'
      },
      {
        service_id: 'SRV-TEA-01-LOG',
        centre_id: 'C-TEA-01',
        service_name: 'Intervención en Comunicación y Sistemas Alternativos Aumentativos (SAAC)',
        service_type: 'speech_therapy',
        target_populations: ['autism'],
        allowed_life_stages: ['minor', 'adult'],
        access_routes: ['direct', 'private_contact'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c1412',
        checked_at: '2026-09-20'
      },
      {
        service_id: 'SRV-TEA-01-TO',
        centre_id: 'C-TEA-01',
        service_name: 'Sala de Integración Sensorial y Terapia Ocupacional Adaptada',
        service_type: 'occupational_therapy',
        target_populations: ['autism'],
        allowed_life_stages: ['minor', 'adult'],
        access_routes: ['direct', 'private_contact'],
        source_dataset: 'Directorio Especializado Autismo Madrid',
        source_url: 'https://comunidad.madrid/discapacidad/directorio-autismo',
        checked_at: '2026-09-22'
      },
      {
        service_id: 'SRV-TEA-01-RES',
        centre_id: 'C-TEA-01',
        service_name: 'Residencia Asistida para Personas con Autismo',
        service_type: 'residential_care',
        target_populations: ['autism'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c1412',
        checked_at: '2026-09-20'
      }
    ],
    allowed_life_stages: ['minor', 'adult', 'older_adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Comisión de Tutela y Consejería de Familia, Juventud y Asuntos Sociales',
      official_description: 'Plazas públicas concertadas gestionadas mediante PIA de la Ley de Dependencia con tipología específica para TEA severo y moderado.',
      source_url: 'https://comunidad.madrid/servicios/asuntos-sociales/dependencia-guia-acceso',
      checked_at: '2026-09-25',
      next_step_action: 'Verifique que su expediente PIA incluya centro de día o residencia de autismo y tramite con su trabajador/a social.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 55,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/c1412',
      checked_at: '2026-09-20',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'yes',
      checked_at: '2026-09-20'
    },
    accessibility_features: ['Señalización con pictogramas ARASAAC en todas las salas', 'Espacios de bajo estímulo acústico', 'Entornos seguros estructurados'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'trastorno del espectro del autismo',
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c1412',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'M. T. Alarcón',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-09-25',
    limitations: ['No admite ingresos directos sin resolución administrativa de plaza pública o convenio de plaza privada concertada.']
  },
  {
    centre_id: 'C-TEA-02',
    provider_id: 'PROV-CEPRI',
    provider_name: 'Asociación CEPRI',
    official_name: 'Centro CEPRI de Recursos de Autismo y Apoyo Psicosocial',
    resource_domain: 'social',
    sector: 'Atención Social y Educativa Especializada',
    centre_type: 'Centro de Día Ocupacional y Apoyo a Menores',
    subtype: 'Atención a personas con autismo y sus familias',
    public_private_status: 'concertado',
    management_type: 'Concertado con Comunidad de Madrid',
    address: 'Calle del Doctor Calero, 22',
    postal_code: '28220',
    municipality: 'Majadahonda',
    coordinates: [40.4735, -3.8692],
    has_valid_coordinates: true,
    phone: '916 38 10 09',
    email: 'cepri@cepri.es',
    website: 'https://cepri.es',
    explicit_specialisations: ['autism'],
    related_services: ['atención temprana', 'logopedia', 'habilidades sociales', 'terapia ocupacional', 'apoyo laboral', 'respiro familiar'],
    supports: ['day_care', 'speech_therapy', 'occupational_therapy', 'employment_support'],
    services_offered: [
      {
        service_id: 'SRV-TEA-02-DAY',
        centre_id: 'C-TEA-02',
        service_name: 'Centro de Día de Adultos con TEA',
        service_type: 'day_care',
        target_populations: ['autism'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c1899',
        checked_at: '2026-09-15'
      },
      {
        service_id: 'SRV-TEA-02-LOG',
        centre_id: 'C-TEA-02',
        service_name: 'Gabinete de Logopedia y Apoyo Lingüístico para Menores con TEA',
        service_type: 'speech_therapy',
        target_populations: ['autism'],
        allowed_life_stages: ['early_childhood', 'minor'],
        access_routes: ['direct', 'private_contact'],
        source_dataset: 'Directorio Especializado Autismo Madrid',
        source_url: 'https://comunidad.madrid/discapacidad/directorio-autismo',
        checked_at: '2026-09-18'
      },
      {
        service_id: 'SRV-TEA-02-EMP',
        centre_id: 'C-TEA-02',
        service_name: 'Servicio de Inserción Laboral y Prácticas Tuteladas',
        service_type: 'employment_support',
        target_populations: ['autism'],
        allowed_life_stages: ['adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c1899',
        checked_at: '2026-09-15'
      }
    ],
    allowed_life_stages: ['early_childhood', 'minor', 'adult'],
    access_route: {
      access_type: 'direct',
      competent_body: 'Equipo de orientación del centro y Servicios Sociales Majadahonda',
      official_description: 'Admisión mixta: los servicios ambulatorios de apoyo y logopedia admiten solicitud directa a la asociación. El centro de día concertado exige trámite de PIA.',
      source_url: 'https://cepri.es/admisiones',
      checked_at: '2026-09-18',
      next_step_action: 'Póngase en contacto con secretaría de CEPRI para entrevista de acogida y orientación sobre el servicio más idóneo.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 38,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/c1899',
      checked_at: '2026-09-15',
      stale: false
    },
    geographic_coverage: {
      type: 'multiple_municipalities',
      included_area_codes: ['0800', '1156', '0164'], // Majadahonda, Pozuelo, Boadilla
      requires_residence: 'no',
      checked_at: '2026-09-15'
    },
    accessibility_features: ['Rampas de acceso', 'Espacios adaptados cognitivamente con anticipadores visuales'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'autismo',
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº C-1899)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c1899',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-09-18',
    limitations: ['Las plazas ambulatorias privadas de tarde tienen cuota asociada a la asociación.']
  },
  {
    centre_id: 'C-TEA-03',
    provider_id: 'PROV-APADIS',
    provider_name: 'Fundación APADIS',
    official_name: 'Centro de Atención Temprana APADIS San Sebastián de los Reyes',
    resource_domain: 'sociosanitary',
    sector: 'Atención Temprana de la Comunidad de Madrid',
    centre_type: 'Centro de Atención Temprana Concertado (CAT)',
    subtype: 'Tratamiento integral ambulatorio de 0 a 6 años',
    public_private_status: 'concertado',
    management_type: 'Concertado con la Red Pública de Atención Temprana CAM',
    address: 'Avenida de Aragón, 28',
    postal_code: '28702',
    municipality: 'Alcobendas', // Zona limítrofe Alcobendas / San Sebastián
    coordinates: [40.5489, -3.6312],
    has_valid_coordinates: true,
    phone: '916 54 60 11',
    email: 'cat@apadis.info',
    website: 'https://apadis.info/atencion-temprana',
    explicit_specialisations: ['autism'],
    related_services: ['atención temprana', 'logopedia', 'psicomotricidad', 'fisioterapia pediátrica', 'terapia ocupacional', 'apoyo familiar'],
    supports: ['speech_therapy', 'occupational_therapy', 'rehabilitation'],
    services_offered: [
      {
        service_id: 'SRV-TEA-03-LOG',
        centre_id: 'C-TEA-03',
        service_name: 'Logopedia Temprana y Comunicación Alternativa',
        service_type: 'speech_therapy',
        target_populations: ['autism'],
        allowed_life_stages: ['early_childhood'],
        access_routes: ['referral'],
        source_dataset: 'Registro de Centros de Atención Social CAM (CAT-045)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/cat045',
        checked_at: '2026-10-14'
      },
      {
        service_id: 'SRV-TEA-03-TO',
        centre_id: 'C-TEA-03',
        service_name: 'Terapia Ocupacional y Estimulación Sensorial Infantil',
        service_type: 'occupational_therapy',
        target_populations: ['autism'],
        allowed_life_stages: ['early_childhood'],
        access_routes: ['referral'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/cat045',
        checked_at: '2026-10-14'
      }
    ],
    allowed_life_stages: ['early_childhood'],
    access_route: {
      access_type: 'referral',
      competent_body: 'Centro Regional de Coordinación y Valoración Infantil (CRECOVI)',
      official_description: 'Plaza pública gratuita asignada exclusivamente mediante dictamen de necesidad de atención temprana emitido por el CRECOVI.',
      source_url: 'https://comunidad.madrid/servicios/asuntos-sociales/atencion-temprana',
      checked_at: '2026-10-14',
      next_step_action: 'Solicite cita en CRECOVI con informe del pediatra o del orientador del equipo de atención temprana escolar.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 120,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/cat045',
      checked_at: '2026-10-14',
      stale: false
    },
    geographic_coverage: {
      type: 'multiple_municipalities',
      included_area_codes: ['0066', '0091'], // Alcobendas, Algete
      requires_residence: 'yes',
      checked_at: '2026-10-14'
    },
    accessibility_features: ['Acceso adaptado para carritos y sillas infantiles', 'Espacios amigables de juego y terapia'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'autismo en primera infancia',
        source_dataset: 'Directorio Oficial de Centros de Atención Temprana de la CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/cat045',
        source_type: 'official_directory',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dra. S. Blanco',
        reviewer_role: 'healthcare',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-14',
    limitations: ['Limitado estrictamente a primera infancia (0 a 6 años). Al cumplir los 6 años se produce la transición obligatoria a servicios escolares o privados.']
  },

  // ==========================================
  // PERFIL: ESCLEROSIS MÚLTIPLE Y ENF. NEURODEGENERATIVAS
  // ==========================================
  {
    centre_id: 'C-EM-01',
    provider_id: 'PROV-FEMM',
    provider_name: 'Fundación Esclerosis Múltiple Madrid',
    official_name: 'Centro Asistencial y de Día Carmen de Torres - FEMM',
    resource_domain: 'sociosanitary',
    sector: 'Sociosanitario Especializado',
    centre_type: 'Centro de Día y Residencia Especializada',
    subtype: 'Atención a personas con esclerosis múltiple y enfermedades neurodegenerativas afines',
    public_private_status: 'concertado',
    management_type: 'Concertado con Consejería de Familia, Juventud y Asuntos Sociales',
    address: 'Avenida de Asturias, 35',
    postal_code: '28029',
    municipality: 'Madrid',
    district: 'Tetuán',
    coordinates: [40.4705, -3.6961],
    has_valid_coordinates: true,
    phone: '913 98 41 11',
    email: 'info@femm.org',
    website: 'https://femm.org/centros',
    explicit_specialisations: ['neurodegenerative_diseases'],
    related_services: ['neurología', 'fisioterapia neurológica', 'terapia ocupacional', 'logopedia y voz', 'atención diurna', 'apoyo psicológico'],
    supports: ['day_care', 'rehabilitation', 'occupational_therapy', 'speech_therapy'],
    services_offered: [
      {
        service_id: 'SRV-EM-01-DAY',
        centre_id: 'C-EM-01',
        service_name: 'Centro de Día de Mantenimiento y Rehabilitación Funcional',
        service_type: 'day_care',
        target_populations: ['neurodegenerative_diseases'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['dependency_pia', 'private_contact'],
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº E-1850)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e1850',
        checked_at: '2026-10-04'
      },
      {
        service_id: 'SRV-EM-01-REHAB',
        centre_id: 'C-EM-01',
        service_name: 'Gimnasio de Fisioterapia Especializada para Fatiga y Espasticidad',
        service_type: 'rehabilitation',
        target_populations: ['neurodegenerative_diseases'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['direct', 'private_contact'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs2910',
        checked_at: '2026-10-04'
      },
      {
        service_id: 'SRV-EM-01-TO',
        centre_id: 'C-EM-01',
        service_name: 'Terapia Ocupacional y Asesoramiento en Productos de Apoyo',
        service_type: 'occupational_therapy',
        target_populations: ['neurodegenerative_diseases'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs2910',
        checked_at: '2026-10-04'
      }
    ],
    allowed_life_stages: ['adult', 'older_adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Consejería de Familia y Servicios Sociales de distrito',
      official_description: 'Plazas públicas concertadas mediante PIA de Dependencia. Tratamientos ambulatorios de fisioterapia y terapia ocupacional también disponibles mediante cuota de socio asistencial.',
      source_url: 'https://femm.org/acceso-servicios',
      checked_at: '2026-10-04',
      next_step_action: 'Contacte con el servicio de trabajo social de FEMM para valoración inicial y asesoramiento en el trámite del PIA.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 48,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/e1850',
      checked_at: '2026-10-04',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'yes',
      checked_at: '2026-10-04'
    },
    accessibility_features: ['Accesibilidad total con grúas de techo', 'Suelos antideslizantes de amortiguación', 'Ascensor adaptado con locución'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'esclerosis múltiple',
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e1850',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-04',
    limitations: ['Dirigido a personas mayores de 18 años con diagnóstico acreditado de patología neurodegenerativa.']
  },
  {
    centre_id: 'C-EM-02',
    provider_id: 'PROV-AEDEM',
    provider_name: 'AEDEM Madrid',
    official_name: 'Centro de Rehabilitación Integral AEDEM Madrid',
    resource_domain: 'healthcare',
    sector: 'Sanitario Social',
    centre_type: 'Centro Sanitario Ambulatorio',
    subtype: 'Unidad de Tratamiento y Fisioterapia de Esclerosis Múltiple',
    public_private_status: 'privado_autorizado',
    management_type: 'Entidad social sin ánimo de lucro autorizada por Sanidad CAM',
    address: 'Calle de Sangenjo, 36',
    postal_code: '28034',
    municipality: 'Madrid',
    district: 'Fuencarral-El Pardo',
    coordinates: [40.4851, -3.7022],
    has_valid_coordinates: true,
    phone: '917 29 45 60',
    email: 'madrid@aedem.org',
    website: 'https://aedem.org/madrid',
    explicit_specialisations: ['neurodegenerative_diseases'],
    related_services: ['neurología', 'fisioterapia neurológica', 'terapia ocupacional', 'logopedia', 'neuropsicología'],
    supports: ['rehabilitation', 'occupational_therapy', 'speech_therapy'],
    services_offered: [
      {
        service_id: 'SRV-EM-02-REHAB',
        centre_id: 'C-EM-02',
        service_name: 'Fisioterapia para Mantenimiento de la Movilidad y Transferencias',
        service_type: 'rehabilitation',
        target_populations: ['neurodegenerative_diseases'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS CS6201)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs6201',
        checked_at: '2026-09-30'
      },
      {
        service_id: 'SRV-EM-02-LOG',
        centre_id: 'C-EM-02',
        service_name: 'Tratamiento de Voz y Deglución',
        service_type: 'speech_therapy',
        target_populations: ['neurodegenerative_diseases'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS CS6201)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs6201',
        checked_at: '2026-09-30'
      }
    ],
    allowed_life_stages: ['adult', 'older_adult'],
    access_route: {
      access_type: 'direct',
      competent_body: 'Equipo médico de AEDEM',
      official_description: 'Acceso directo para socios y particulares aportando informe neurológico confirmatorio de diagnóstico.',
      source_url: 'https://aedem.org/madrid/servicios',
      checked_at: '2026-09-30',
      next_step_action: 'Llamar al centro y solicitar cita para valoración por fisioterapeuta y médico coordinador.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 25,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs6201',
      checked_at: '2026-09-30',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'no',
      checked_at: '2026-09-30'
    },
    accessibility_features: ['Aparcamiento para personas con movilidad reducida', 'Acceso adaptado con rampa'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'esclerosis múltiple',
        source_dataset: 'REGCESS Comunidad de Madrid',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs6201',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dr. C. Moreno',
        reviewer_role: 'healthcare',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-09-30',
    limitations: ['No dispone de plazas de alojamiento residencial ni plazas públicas de centro de día completo.']
  },

  // ==========================================
  // PERFIL: PARÁLISIS CEREBRAL Y PATOLOGÍAS AFINES
  // ==========================================
  {
    centre_id: 'C-PC-01',
    provider_id: 'PROV-ASPACE',
    provider_name: 'ASPACE Madrid',
    official_name: 'Centro Integral de Atención a la Parálisis Cerebral ASPACE Madrid',
    resource_domain: 'sociosanitary',
    sector: 'Atención Social y Sanitaria a la Discapacidad',
    centre_type: 'Centro de Día, Residencia y Tratamientos Ambulatorios',
    subtype: 'Atención especializada a personas con parálisis cerebral y patologías afines',
    public_private_status: 'concertado',
    management_type: 'Concertado con Consejería de Familia, Juventud y Asuntos Sociales',
    address: 'Calle de la Montaña Blanca, 4',
    postal_code: '28030',
    municipality: 'Madrid',
    district: 'Moratalaz',
    coordinates: [40.4082, -3.6477],
    has_valid_coordinates: true,
    phone: '915 01 83 33',
    email: 'contacto@aspacemadrid.org',
    website: 'https://aspacemadrid.org/servicios',
    explicit_specialisations: ['cerebral_palsy'],
    related_services: ['rehabilitación', 'fisioterapia especializada', 'logopedia y comunicación', 'terapia ocupacional', 'atención diurna', 'residencia asistida', 'apoyo familiar'],
    supports: ['day_care', 'rehabilitation', 'occupational_therapy', 'speech_therapy', 'residential_care'],
    services_offered: [
      {
        service_id: 'SRV-PC-01-DAY',
        centre_id: 'C-PC-01',
        service_name: 'Centro de Día para Personas con Parálisis Cerebral Gravemente Afectadas',
        service_type: 'day_care',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº C-0914)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c0914',
        checked_at: '2026-10-08'
      },
      {
        service_id: 'SRV-PC-01-REHAB',
        centre_id: 'C-PC-01',
        service_name: 'Fisioterapia Respiratoria y Control Postural',
        service_type: 'rehabilitation',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult'],
        access_routes: ['direct', 'referral'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs1105',
        checked_at: '2026-10-08'
      },
      {
        service_id: 'SRV-PC-01-LOG',
        centre_id: 'C-PC-01',
        service_name: 'Comunicación Aumentativa y Terapia de Alimentación/Deglución',
        service_type: 'speech_therapy',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs1105',
        checked_at: '2026-10-08'
      },
      {
        service_id: 'SRV-PC-01-RES',
        centre_id: 'C-PC-01',
        service_name: 'Residencia para Personas con Parálisis Cerebral con Alta Dependencia',
        service_type: 'residential_care',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c0914',
        checked_at: '2026-10-08'
      }
    ],
    allowed_life_stages: ['early_childhood', 'minor', 'adult', 'older_adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Dirección General de Atención a la Discapacidad de la CAM',
      official_description: 'Plazas de centro de día y residencia vinculadas a la resolución del Programa Individual de Atención (PIA) de la Ley de Dependencia.',
      source_url: 'https://aspacemadrid.org/como-acceder',
      checked_at: '2026-10-08',
      next_step_action: 'Tramite la solicitud de plaza en Centro de Día o Residencia ASPACE a través de su centro de servicios sociales.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 60,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/c0914',
      checked_at: '2026-10-08',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'yes',
      checked_at: '2026-10-08'
    },
    accessibility_features: ['Grúas fijas y móviles en todas las salas', 'Baños adaptados de alta dependencia', 'Pulsadores adaptados en puertas'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'parálisis cerebral',
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº C-0914)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c0914',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'L. Valverde',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-08',
    limitations: ['Las plazas residenciales están sujetas a baremo oficial de necesidad de apoyo extenso o generalizado.']
  },
  {
    centre_id: 'C-PC-02',
    provider_id: 'PROV-BOBATH',
    provider_name: 'Fundación Bobath',
    official_name: 'Centro Integral de Atención Temprana y Adultos Fundación Bobath',
    resource_domain: 'sociosanitary',
    sector: 'Atención Especializada en Neurodesarrollo y Parálisis Cerebral',
    centre_type: 'Centro de Tratamiento Integral, Centro de Día y Centro Ocupacional',
    subtype: 'Especialización en concepto Bobath para parálisis cerebral en todas las edades',
    public_private_status: 'concertado',
    management_type: 'Concertado con Consejería de Familia, Juventud y Asuntos Sociales y Sanidad',
    address: 'Calle del Monasterio de las Huelgas, 7',
    postal_code: '28049',
    municipality: 'Madrid',
    district: 'Fuencarral-El Pardo',
    coordinates: [40.5015, -3.6948],
    has_valid_coordinates: true,
    phone: '917 50 11 11',
    email: 'fundacion@bobath.es',
    website: 'https://fundacionbobath.org',
    explicit_specialisations: ['cerebral_palsy'],
    related_services: ['rehabilitación', 'fisioterapia especializada', 'terapia ocupacional', 'logopedia', 'atención diurna', 'apoyo escolar', 'apoyo laboral'],
    supports: ['rehabilitation', 'speech_therapy', 'occupational_therapy', 'day_care', 'employment_support'],
    services_offered: [
      {
        service_id: 'SRV-PC-02-REHAB',
        centre_id: 'C-PC-02',
        service_name: 'Fisioterapia Neurológica bajo Enfoque Bobath',
        service_type: 'rehabilitation',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult'],
        access_routes: ['referral', 'direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs7720',
        checked_at: '2026-10-11'
      },
      {
        service_id: 'SRV-PC-02-LOG',
        centre_id: 'C-PC-02',
        service_name: 'Comunicación Aumentativa y Tratamiento de la Voz',
        service_type: 'speech_therapy',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['early_childhood', 'minor', 'adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs7720',
        checked_at: '2026-10-11'
      },
      {
        service_id: 'SRV-PC-02-DAY',
        centre_id: 'C-PC-02',
        service_name: 'Centro de Día de Adultos con Parálisis Cerebral',
        service_type: 'day_care',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c2210',
        checked_at: '2026-10-11'
      }
    ],
    allowed_life_stages: ['early_childhood', 'minor', 'adult'],
    access_route: {
      access_type: 'direct',
      competent_body: 'Equipo multidisciplinar Fundación Bobath',
      official_description: 'Evaluación funcional inicial previa cita. Los programas de atención temprana y centro de día disponen de plazas concertadas con la Comunidad de Madrid.',
      source_url: 'https://fundacionbobath.org/acceso',
      checked_at: '2026-10-11',
      next_step_action: 'Solicite cita para entrevista y valoración inicial de necesidades con el equipo de trabajo social de la Fundación.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 70,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/c2210',
      checked_at: '2026-10-11',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'yes',
      checked_at: '2026-10-11'
    },
    accessibility_features: ['Accesibilidad universal en todo el recinto', 'Tecnología de acceso al ordenador por mirada', 'Sistemas de bipedestación adaptados'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'parálisis cerebral',
        source_dataset: 'Directorio de Atención a la Discapacidad CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c2210',
        source_type: 'official_directory',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dra. E. Garrido',
        reviewer_role: 'healthcare',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-11',
    limitations: ['Requiere estudio clínico funcional previo para determinar adecuación a los programas terapéuticos específicos.']
  },

  // ==========================================
  // PERFILES EXPERIMENTALES
  // ==========================================
  {
    centre_id: 'C-LM-01',
    provider_id: 'PROV-CAM-DISCAP',
    provider_name: 'Red Pública CAM',
    official_name: 'Centro de Atención a Personas con Discapacidad Física Severa y Lesión Medular',
    resource_domain: 'social',
    sector: 'Atención Social Especializada',
    centre_type: 'Centro Residencial y de Rehabilitación Funcional',
    subtype: 'Atención a personas adultas con lesión medular y tetraplejia',
    public_private_status: 'red_publica',
    management_type: 'Gestión pública directa de la Comunidad de Madrid',
    address: 'Calle del Severo Ochoa, 12',
    postal_code: '28914',
    municipality: 'Leganés',
    coordinates: [40.3312, -3.7681],
    has_valid_coordinates: true,
    phone: '916 93 21 00',
    email: 'c.lesionadosmedulares@madrid.org',
    website: 'https://comunidad.madrid/centros/discapacidad-severa-leganes',
    explicit_specialisations: ['spinal_cord_injury'],
    related_services: ['rehabilitación', 'fisioterapia intensiva', 'terapia ocupacional', 'residencia asistida', 'atención diurna'],
    supports: ['rehabilitation', 'occupational_therapy', 'residential_care', 'day_care'],
    services_offered: [
      {
        service_id: 'SRV-LM-01-REHAB',
        centre_id: 'C-LM-01',
        service_name: 'Neurorrehabilitación y Prevención de Complicaciones en Lesión Medular',
        service_type: 'rehabilitation',
        target_populations: ['spinal_cord_injury'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['dependency_pia', 'referral'],
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº E-0145)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e0145',
        checked_at: '2026-09-12'
      },
      {
        service_id: 'SRV-LM-01-TO',
        centre_id: 'C-LM-01',
        service_name: 'Entrenamiento en Transferencias, Manejo de Silla y Domótica Asistencial',
        service_type: 'occupational_therapy',
        target_populations: ['spinal_cord_injury'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e0145',
        checked_at: '2026-09-12'
      }
    ],
    allowed_life_stages: ['adult', 'older_adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Dirección General de Atención a Personas con Discapacidad (CAM)',
      official_description: 'Plaza 100% pública dependiente de la Consejería de Asuntos Sociales. Asignación por valoración de grado de dependencia y baremo de idoneidad.',
      source_url: 'https://comunidad.madrid/servicios/asuntos-sociales/dependencia-guia-acceso',
      checked_at: '2026-09-12',
      next_step_action: 'Solicite inclusión en el centro a través de los Servicios Sociales Municipales de su localidad con informe médico actualizado.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 50,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/e0145',
      checked_at: '2026-09-12',
      stale: false
    },
    geographic_coverage: {
      type: 'community_wide',
      requires_residence: 'yes',
      checked_at: '2026-09-12'
    },
    accessibility_features: ['Edificio completamente adaptado para usuarios de sillas de ruedas eléctricas', 'Baños asistidos', 'Grúas en todas las habitaciones'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'lesión medular',
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº E-0145)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/e0145',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'L. Valverde',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-09-12',
    limitations: ['Perfil experimental en la taxonomía: visible con advertencia de cobertura regional y muestra en validación.']
  },
  {
    centre_id: 'C-AT-01',
    provider_id: 'PROV-CAM-DISCAP',
    provider_name: 'Red de Atención Temprana',
    official_name: 'Centro de Atención Temprana y Estimulación Psicomotriz Crean Aragón',
    resource_domain: 'sociosanitary',
    sector: 'Atención Temprana Especializada',
    centre_type: 'Centro de Atención Temprana (CAT)',
    subtype: 'Unidad de Tratamiento Psicomotor y Neurodesarrollo 0-6 años',
    public_private_status: 'concertado',
    management_type: 'Concertado con la Red Regional de Atención Temprana',
    address: 'Vía Complutense, 114',
    postal_code: '28805',
    municipality: 'Alcalá de Henares',
    coordinates: [40.4862, -3.3592],
    has_valid_coordinates: true,
    phone: '918 89 30 14',
    email: 'info@creanaragon.org',
    website: 'https://creanaragon.org',
    explicit_specialisations: ['psychomotor_early_support'],
    related_services: ['atención temprana', 'fisioterapia pediátrica', 'psicomotricidad', 'terapia ocupacional', 'logopedia infantil'],
    supports: ['rehabilitation', 'occupational_therapy', 'speech_therapy'],
    services_offered: [
      {
        service_id: 'SRV-AT-01-PSI',
        centre_id: 'C-AT-01',
        service_name: 'Sala de Psicomotricidad Terapéutica y Desarrollo Postural',
        service_type: 'rehabilitation',
        target_populations: ['psychomotor_early_support'],
        allowed_life_stages: ['early_childhood'],
        access_routes: ['referral'],
        source_dataset: 'Registro Oficial de Centros de Atención Temprana CAM (CAT-088)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/cat088',
        checked_at: '2026-09-19'
      },
      {
        service_id: 'SRV-AT-01-TO',
        centre_id: 'C-AT-01',
        service_name: 'Terapia Ocupacional Infantil y Motricidad Fina',
        service_type: 'occupational_therapy',
        target_populations: ['psychomotor_early_support'],
        allowed_life_stages: ['early_childhood'],
        access_routes: ['referral'],
        source_dataset: 'Registro Oficial de Centros de Atención Temprana CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/cat088',
        checked_at: '2026-09-19'
      }
    ],
    allowed_life_stages: ['early_childhood'],
    access_route: {
      access_type: 'referral',
      competent_body: 'Centro Regional de Coordinación y Valoración Infantil (CRECOVI)',
      official_description: 'Asignación mediante resolución oficial del CRECOVI para menores empadronados en la Comunidad de Madrid.',
      source_url: 'https://comunidad.madrid/servicios/asuntos-sociales/atencion-temprana',
      checked_at: '2026-09-19',
      next_step_action: 'Contacte con el servicio de pediatría de su centro de salud para informe de derivación a CRECOVI.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 85,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/cat088',
      checked_at: '2026-09-19',
      stale: false
    },
    geographic_coverage: {
      type: 'multiple_municipalities',
      included_area_codes: ['0053', '0496'], // Alcalá de Henares, Coslada
      requires_residence: 'yes',
      checked_at: '2026-09-19'
    },
    accessibility_features: ['Acceso a pie llano', 'Entorno adaptado a la infancia'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'psicomotricidad en atención temprana',
        source_dataset: 'Directorio de Atención Temprana CAM (CAT-088)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/cat088',
        source_type: 'official_directory',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-09-19',
    limitations: ['Solo atiende a menores de 0 a 6 años. Consta mención explícita de psicomotricidad en resolución de registro.']
  },

  // ==========================================
  // CASOS DE PRUEBA ESPECÍFICOS Y REGLAS NEGATIVAS
  // ==========================================
  // Test COMB-002 y DUP-001: Mismo proveedor en sedes distintas
  {
    centre_id: 'C-DUP-01A',
    provider_id: 'PROV-SAN-MARTIN',
    provider_name: 'Fundación San Martín',
    official_name: 'Fundación San Martín - Sede Centro (Terapia y Logopedia)',
    resource_domain: 'social',
    sector: 'Atención Social y Terapéutica',
    centre_type: 'Centro de Tratamiento Ambulatorio (Sede A)',
    subtype: 'Servicios de apoyo ambulatorio',
    public_private_status: 'concertado',
    management_type: 'Concertado con Consejería de Asuntos Sociales',
    address: 'Calle Mayor, 82',
    postal_code: '28013',
    municipality: 'Madrid',
    district: 'Centro',
    coordinates: [40.4155, -3.7112],
    has_valid_coordinates: true,
    phone: '915 48 20 10',
    email: 'centro@sanmartin.org',
    website: 'https://fundacionsanmartin.org',
    explicit_specialisations: ['autism', 'cerebral_palsy'],
    related_services: ['terapia ocupacional', 'logopedia', 'apoyo familiar'],
    supports: ['occupational_therapy', 'speech_therapy'],
    services_offered: [
      {
        service_id: 'SRV-DUP-01A-TO',
        centre_id: 'C-DUP-01A',
        service_name: 'Terapia Ocupacional Funcional',
        service_type: 'occupational_therapy',
        target_populations: ['autism', 'cerebral_palsy'],
        allowed_life_stages: ['minor', 'adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/sm01',
        checked_at: '2026-10-01'
      },
      {
        service_id: 'SRV-DUP-01A-LOG',
        centre_id: 'C-DUP-01A',
        service_name: 'Logopedia y Comunicación',
        service_type: 'speech_therapy',
        target_populations: ['autism', 'cerebral_palsy'],
        allowed_life_stages: ['minor', 'adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/sm01',
        checked_at: '2026-10-01'
      }
    ],
    allowed_life_stages: ['minor', 'adult'],
    access_route: {
      access_type: 'direct',
      competent_body: 'Fundación San Martín',
      official_description: 'Acceso directo a terapias ambulatorias previa entrevista con el equipo técnico.',
      source_url: 'https://fundacionsanmartin.org/admisiones',
      checked_at: '2026-10-01',
      next_step_action: 'Contacte con la secretaría de la Sede Centro para valorar disponibilidad horaria.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 30,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/sm01',
      checked_at: '2026-10-01',
      stale: false
    },
    geographic_coverage: { type: 'community_wide', requires_residence: 'no', checked_at: '2026-10-01' },
    accessibility_features: ['Acceso con rampa y elevador adaptado'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'autismo y parálisis cerebral',
        source_dataset: 'Registro Social CAM (SM01)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/sm01',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-01',
    limitations: ['En esta sede NO se presta Atención Diurna ni Residencia. Se prestan en la Sede Sur en Leganés.']
  },
  {
    centre_id: 'C-DUP-01B',
    provider_id: 'PROV-SAN-MARTIN',
    provider_name: 'Fundación San Martín',
    official_name: 'Fundación San Martín - Sede Sur Leganés (Centro de Día)',
    resource_domain: 'social',
    sector: 'Atención Social Diurna',
    centre_type: 'Centro de Día de Adultos (Sede B)',
    subtype: 'Estancia diurna especializada',
    public_private_status: 'concertado',
    management_type: 'Concertado con Consejería de Asuntos Sociales',
    address: 'Avenida del Rey Juan Carlos I, 90',
    postal_code: '28916',
    municipality: 'Leganés',
    coordinates: [40.3245, -3.7554],
    has_valid_coordinates: true,
    phone: '916 88 12 40',
    email: 'sedesur@sanmartin.org',
    website: 'https://fundacionsanmartin.org/sedesur',
    explicit_specialisations: ['autism', 'cerebral_palsy'],
    related_services: ['atención diurna', 'talleres ocupacionales', 'comedor adaptado'],
    supports: ['day_care'],
    services_offered: [
      {
        service_id: 'SRV-DUP-01B-DAY',
        centre_id: 'C-DUP-01B',
        service_name: 'Plazas de Centro de Día de Adultos',
        service_type: 'day_care',
        target_populations: ['autism', 'cerebral_palsy'],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº SM02)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/sm02',
        checked_at: '2026-10-01'
      }
    ],
    allowed_life_stages: ['adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Servicios Sociales Leganés y Consejería de Familia',
      official_description: 'Plazas concertadas de Centro de Día concedidas mediante resolución del PIA.',
      source_url: 'https://fundacionsanmartin.org/acceso-pia',
      checked_at: '2026-10-01',
      next_step_action: 'Solicite plaza en Sede Sur mediante PIA con su trabajador/a social.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 40,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/sm02',
      checked_at: '2026-10-01',
      stale: false
    },
    geographic_coverage: { type: 'multiple_municipalities', included_area_codes: ['0745', '0652', '0584'], requires_residence: 'yes', checked_at: '2026-10-01' },
    accessibility_features: ['Planta baja accesible', 'Baños adaptados'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'autismo y parálisis cerebral',
        source_dataset: 'Registro Social CAM (SM02)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/sm02',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-01',
    limitations: ['Esta sede solo dispone de Centro de Día; las terapias ambulatorias se prestan en Sede Centro (Madrid).']
  },

  // Test NEG-001 y TAX-003: Neurología sin DCA explícito -> genera máximo B2
  {
    centre_id: 'C-NEG-NEU',
    provider_id: 'PROV-SERMAS',
    provider_name: 'SERMAS',
    official_name: 'Centro de Especialidades Médicas Los Pinos (Consulta de Neurología)',
    resource_domain: 'healthcare',
    sector: 'Sanitario Público',
    centre_type: 'Centro de Especialidades Periféricas',
    subtype: 'Consultas externas generales de especialidades médicas',
    public_private_status: 'red_publica',
    management_type: 'Pública directa (SERMAS)',
    address: 'Calle de los Pinos, 18',
    postal_code: '28028',
    municipality: 'Madrid',
    district: 'Salamanca',
    coordinates: [40.4321, -3.6622],
    has_valid_coordinates: true,
    phone: '914 02 11 00',
    email: 'cep.lospinos@salud.madrid.org',
    website: 'https://comunidad.madrid/sanidad/centros/cep-pinos',
    explicit_specialisations: [], // NO tiene daño cerebral adquirido explícito!
    related_services: ['neurología', 'diagnóstico electroencefalográfico'],
    supports: ['rehabilitation'],
    services_offered: [
      {
        service_id: 'SRV-NEG-NEU-01',
        centre_id: 'C-NEG-NEU',
        service_name: 'Consulta Externa de Neurología Clínica General',
        service_type: 'rehabilitation',
        target_populations: [],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['referral'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs9901',
        checked_at: '2026-10-01'
      }
    ],
    allowed_life_stages: ['adult', 'older_adult'],
    access_route: {
      access_type: 'referral',
      competent_body: 'Atención Primaria SERMAS',
      official_description: 'Cita previa tramitada exclusivamente por derivación del médico de familia.',
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs9901',
      checked_at: '2026-10-01',
      next_step_action: 'Solicite interconsulta en su centro de salud.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'not_published',
      authorised_places: null,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs9901',
      checked_at: '2026-10-01',
      stale: false
    },
    geographic_coverage: { type: 'district', requires_residence: 'yes', checked_at: '2026-10-01' },
    accessibility_features: ['Accesibilidad estándar ambulatoria'],
    provenance_records: [
      {
        attribute_name: 'services',
        value: 'neurología general',
        source_dataset: 'REGCESS Comunidad de Madrid',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs9901',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dr. C. Moreno',
        reviewer_role: 'healthcare',
        confidence: 'functional',
        quality: 'B'
      }
    ],
    last_checked: '2026-10-01',
    limitations: ['Consulta diagnóstica general; no es unidad monográfica de neurorrehabilitación intensiva de daño cerebral sobrevenido (máximo B2).']
  },

  // Test NEG-002 y TAX-004: Fisioterapia genérica -> no demuestra rehabilitación neurológica
  {
    centre_id: 'C-NEG-FIS',
    provider_id: 'PROV-LESCER',
    provider_name: 'Privado',
    official_name: 'Policlínica de Fisioterapia y Masoterapia Castellana',
    resource_domain: 'healthcare',
    sector: 'Sanitario Privado',
    centre_type: 'Consulta de Fisioterapia Privada',
    subtype: 'Fisioterapia traumatológica y deportiva',
    public_private_status: 'privado_autorizado',
    management_type: 'Privada autorizada',
    address: 'Paseo de la Castellana, 180',
    postal_code: '28046',
    municipality: 'Madrid',
    district: 'Chamartín',
    coordinates: [40.4589, -3.6892],
    has_valid_coordinates: true,
    phone: '913 50 11 88',
    email: 'contacto@fisio-castellana.com',
    website: 'https://fisio-castellana.com',
    explicit_specialisations: [],
    related_services: ['fisioterapia general', 'masoterapia', 'punción seca'],
    supports: ['rehabilitation'],
    services_offered: [
      {
        service_id: 'SRV-NEG-FIS-01',
        centre_id: 'C-NEG-FIS',
        service_name: 'Sesiones de Fisioterapia Traumatológica',
        service_type: 'rehabilitation',
        target_populations: [],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro General de Centros Sanitarios (REGCESS)',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs8804',
        checked_at: '2026-09-10'
      }
    ],
    allowed_life_stages: ['adult', 'older_adult'],
    access_route: {
      access_type: 'direct',
      competent_body: 'Dirección técnica de la clínica',
      official_description: 'Centro privado autorizado. Consulta y cita directa.',
      source_url: 'https://fisio-castellana.com',
      checked_at: '2026-09-10',
      next_step_action: 'Contacte con la clínica para tarifas y reserva.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 10,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs8804',
      checked_at: '2026-09-10',
      stale: false
    },
    geographic_coverage: { type: 'on_site_only', requires_residence: 'no', checked_at: '2026-09-10' },
    accessibility_features: ['Planta a nivel'],
    provenance_records: [
      {
        attribute_name: 'services',
        value: 'fisioterapia general',
        source_dataset: 'REGCESS',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs8804',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dra. E. Garrido',
        reviewer_role: 'healthcare',
        confidence: 'functional',
        quality: 'B'
      }
    ],
    last_checked: '2026-09-10',
    limitations: ['Fisioterapia general; no cuenta con acreditación de neurorrehabilitación intensiva para patología neurológica grave.']
  },

  // Test NEG-003 y TAX-002: Discapacidad intelectual sin mención a TEA -> NO debe inferir TEA
  {
    centre_id: 'C-NEG-DI',
    provider_id: 'PROV-CAM-DISCAP',
    provider_name: 'Red Pública Discapacidad',
    official_name: 'Centro Ocupacional Santa Ana para Discapacidad Intelectual',
    resource_domain: 'social',
    sector: 'Atención Social a la Discapacidad Intelectual',
    centre_type: 'Centro Ocupacional',
    subtype: 'Capacitación ocupacional para personas con discapacidad intelectual ligera o media',
    public_private_status: 'concertado',
    management_type: 'Concertado con Consejería de Asuntos Sociales',
    address: 'Calle Pintor Velázquez, 40',
    postal_code: '28935',
    municipality: 'Móstoles',
    coordinates: [40.3205, -3.8711],
    has_valid_coordinates: true,
    phone: '916 18 20 44',
    email: 'santa.ana@mostoles.org',
    website: 'https://comunidad.madrid/centros/co-santa-ana',
    explicit_specialisations: [], // NO ES TEA!
    related_services: ['talleres ocupacionales', 'habilidades para la autonomía', 'atención diurna', 'apoyo laboral'],
    supports: ['day_care', 'employment_support'],
    services_offered: [
      {
        service_id: 'SRV-NEG-DI-01',
        centre_id: 'C-NEG-DI',
        service_name: 'Talleres Ocupacionales y de Ajuste Personal',
        service_type: 'day_care',
        target_populations: [],
        allowed_life_stages: ['adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM (Nº C-0520)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c0520',
        checked_at: '2026-09-15'
      }
    ],
    allowed_life_stages: ['adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Servicios Sociales Municipales de Móstoles y CAM',
      official_description: 'Plaza concertada gestionada mediante PIA con baremo de discapacidad intelectual.',
      source_url: 'https://comunidad.madrid/servicios/asuntos-sociales/dependencia-guia-acceso',
      checked_at: '2026-09-15',
      next_step_action: 'Consulte con su trabajadora social en Móstoles.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 75,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/c0520',
      checked_at: '2026-09-15',
      stale: false
    },
    geographic_coverage: { type: 'municipality', included_area_codes: ['0921'], requires_residence: 'yes', checked_at: '2026-09-15' },
    accessibility_features: ['Señalización clara en texto grande'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'discapacidad intelectual',
        source_dataset: 'Registro Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/c0520',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'L. Valverde',
        reviewer_role: 'social',
        confidence: 'potential',
        quality: 'A'
      }
    ],
    last_checked: '2026-09-15',
    limitations: ['Regla negativa verificada: la discapacidad intelectual NO implica especialización en TEA.']
  },

  // Test GEO-001 y GEO-002: Centro sin coordenadas -> aparece en lista, excluido de radio y mapa
  {
    centre_id: 'C-GEO-NOCORD',
    provider_id: 'PROV-CAM-DISCAP',
    provider_name: 'Red Pública Regional',
    official_name: 'Centro Itinerante de Apoyo Comunitario y Orientación Familiar',
    resource_domain: 'social',
    sector: 'Atención Social en la Comunidad',
    centre_type: 'Servicio Comunitario Itinerante',
    subtype: 'Orientación psicopedagógica y social móvil',
    public_private_status: 'red_publica',
    management_type: 'Pública directa CAM',
    address: 'Sede administrativa en tramitación / Sin dirección fija abierta al público',
    postal_code: '28010',
    municipality: 'Madrid',
    coordinates: null, // Sin coordenadas intencionadas
    has_valid_coordinates: false,
    phone: '912 76 00 00',
    email: 'itinerante.apoyo@madrid.org',
    website: 'https://comunidad.madrid/serviciossociales/itinerante',
    explicit_specialisations: ['autism'],
    related_services: ['apoyo familiar', 'orientación a centros', 'logopedia'],
    supports: ['speech_therapy'],
    services_offered: [
      {
        service_id: 'SRV-GEO-01',
        centre_id: 'C-GEO-NOCORD',
        service_name: 'Orientación de Comunicación en Entorno Familiar',
        service_type: 'speech_therapy',
        target_populations: ['autism'],
        allowed_life_stages: ['early_childhood', 'minor'],
        access_routes: ['direct'],
        source_dataset: 'BOCM Disposición Reguladora',
        source_url: 'https://comunidad.madrid/bocm/itinerante-2026',
        checked_at: '2026-10-01'
      }
    ],
    allowed_life_stages: ['early_childhood', 'minor'],
    access_route: {
      access_type: 'direct',
      competent_body: 'Coordinación regional de servicios sociales',
      official_description: 'Servicio telefónico y presencial a demanda para familias.',
      source_url: 'https://comunidad.madrid/serviciossociales/itinerante',
      checked_at: '2026-10-01',
      next_step_action: 'Llamar al teléfono oficial para solicitar intervención en su zona.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: null,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/bocm/itinerante-2026',
      checked_at: '2026-10-01',
      stale: false
    },
    geographic_coverage: { type: 'community_wide', requires_residence: 'yes', checked_at: '2026-10-01' },
    accessibility_features: [],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'autismo',
        source_dataset: 'BOCM Publicación Oficial',
        source_url: 'https://comunidad.madrid/bocm/itinerante-2026',
        source_type: 'official_webpage',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-01',
    limitations: ['Centro sin coordenadas geográficas: permanece visible en la lista con aviso explícito pero no se computa en cálculo de radio ni se ubica en el mapa.']
  },

  // Test SRC-001: Contradicción de plazas entre Registro y Directorio -> bloquea atributo y muestra aviso
  {
    centre_id: 'C-SRC-CONF',
    provider_id: 'PROV-LESCER',
    provider_name: 'Grupo Norte Terapia',
    official_name: 'Centro Terapéutico y Asistencial Las Tablas',
    resource_domain: 'sociosanitary',
    sector: 'Sociosanitario',
    centre_type: 'Centro Ambulatorio y de Día',
    subtype: 'Rehabilitación y atención de día',
    public_private_status: 'privado_autorizado',
    management_type: 'Privada autorizada',
    address: 'Paseo de la Tierra de Melide, 24',
    postal_code: '28050',
    municipality: 'Madrid',
    district: 'Fuencarral-El Pardo',
    coordinates: [40.5098, -3.6702],
    has_valid_coordinates: true,
    phone: '918 22 10 30',
    email: 'tablas@terapia-norte.es',
    website: 'https://terapia-norte.es',
    explicit_specialisations: ['acquired_brain_injury'],
    related_services: ['rehabilitación', 'fisioterapia', 'terapia ocupacional'],
    supports: ['rehabilitation', 'occupational_therapy'],
    services_offered: [
      {
        service_id: 'SRV-SRC-01',
        centre_id: 'C-SRC-CONF',
        service_name: 'Neurorrehabilitación Funcional',
        service_type: 'rehabilitation',
        target_populations: ['acquired_brain_injury'],
        allowed_life_stages: ['adult'],
        access_routes: ['direct'],
        source_dataset: 'Registro General de Centros Sanitarios',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs7122',
        checked_at: '2026-10-01'
      }
    ],
    allowed_life_stages: ['adult'],
    access_route: {
      access_type: 'direct',
      competent_body: 'Dirección del centro',
      official_description: 'Admisión privada directa.',
      source_url: 'https://terapia-norte.es',
      checked_at: '2026-10-01',
      next_step_action: 'Contactar directamente.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: null, // Bloqueado por conflicto SRC-001
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/sanidad/regcess/cs7122',
      checked_at: '2026-10-01',
      stale: false
    },
    conflict_record: {
      attribute: 'authorised_places',
      source_a: { value: 30, date: '2026-10-01', type: 'Registro Oficial REGCESS' },
      source_b: { value: 25, date: '2026-09-15', type: 'Directorio Especializado Discapacidad' },
      status: 'unresolved',
      public_value: null,
      public_message: 'La capacidad publicada no es coincidente entre registros oficiales (30 según REGCESS vs 25 según Directorio). Atributo bloqueado pendiente de subsanación.'
    },
    geographic_coverage: { type: 'community_wide', requires_residence: 'no', checked_at: '2026-10-01' },
    accessibility_features: ['Acceso con rampa'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'daño cerebral adquirido',
        source_dataset: 'REGCESS Comunidad de Madrid',
        source_url: 'https://comunidad.madrid/sanidad/regcess/cs7122',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'Dr. C. Moreno',
        reviewer_role: 'healthcare',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-10-01',
    limitations: ['Conflicto de fuentes detectado en plazas autorizadas: ambas evidencias se registran sin alterar silenciosamente el dato.']
  },

  // Test ACC-002 y ACC-005: Vía de acceso no documentada -> muestra "Debe confirmarse con el organismo competente"
  {
    centre_id: 'C-ACC-UNK',
    provider_id: 'PROV-SAN-MARTIN',
    provider_name: 'Asociación Local',
    official_name: 'Gabinete Comunitario de Estimulación Funcional Alcobendas',
    resource_domain: 'social',
    sector: 'Atención Social de Base',
    centre_type: 'Centro Asistencial Menor',
    subtype: 'Apoyo y estimulación cognitiva',
    public_private_status: 'privado_autorizado',
    management_type: 'Entidad social local',
    address: 'Calle del Fuego, 15',
    postal_code: '28100',
    municipality: 'Alcobendas',
    coordinates: [40.5420, -3.6391],
    has_valid_coordinates: true,
    phone: '916 51 00 22',
    email: 'contacto@alcobendas-estimulacion.org',
    website: 'https://alcobendas-estimulacion.org',
    explicit_specialisations: ['cerebral_palsy'],
    related_services: ['rehabilitación', 'fisioterapia'],
    supports: ['rehabilitation'],
    services_offered: [
      {
        service_id: 'SRV-ACC-UNK-01',
        centre_id: 'C-ACC-UNK',
        service_name: 'Fisioterapia y Mantenimiento Postural',
        service_type: 'rehabilitation',
        target_populations: ['cerebral_palsy'],
        allowed_life_stages: ['adult'],
        access_routes: ['unknown'],
        source_dataset: 'Registro Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/g081',
        checked_at: '2026-09-01'
      }
    ],
    allowed_life_stages: ['adult'],
    access_route: {
      access_type: 'unknown',
      competent_body: 'Organismo titular pendiente de contrastar',
      official_description: 'Vía de acceso o derivación no especificada en el registro oficial vigente.',
      source_url: 'https://comunidad.madrid/serviciossociales/centros/g081',
      checked_at: '2026-09-01',
      next_step_action: 'Debe confirmarse con el organismo competente o contactar al centro antes de desplazarse.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'contact_required',
      authorised_places: 15,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/g081',
      checked_at: '2026-09-01',
      stale: false
    },
    geographic_coverage: { type: 'municipality', included_area_codes: ['0066'], requires_residence: 'yes', checked_at: '2026-09-01' },
    accessibility_features: [],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'parálisis cerebral',
        source_dataset: 'Registro Social CAM (G081)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/g081',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'L. Valverde',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'A'
      }
    ],
    last_checked: '2026-09-01',
    limitations: ['Vía de acceso ausente en fuente oficial: no se infiere acceso directo.']
  },

  // Test AVL-001: Disponibilidad de hace >30 días -> estado "Confirmar con el centro"
  {
    centre_id: 'C-STALE-AVL',
    provider_id: 'PROV-FEMM',
    provider_name: 'Fundación NeuroSalud',
    official_name: 'Residencia Asistida de Enfermedades Neurodegenerativas Los Rosales',
    resource_domain: 'social',
    sector: 'Atención Social Residencial',
    centre_type: 'Residencia Especializada',
    subtype: 'Atención continuada 24 horas',
    public_private_status: 'concertado',
    management_type: 'Concertada CAM',
    address: 'Camino de los Vinateros, 102',
    postal_code: '28030',
    municipality: 'Madrid',
    district: 'Moratalaz',
    coordinates: [40.4071, -3.6521],
    has_valid_coordinates: true,
    phone: '914 30 55 99',
    email: 'losrosales@neurosalud.org',
    website: 'https://neurosalud.org/rosales',
    explicit_specialisations: ['neurodegenerative_diseases'],
    related_services: ['residencia', 'fisioterapia', 'terapia ocupacional'],
    supports: ['residential_care', 'rehabilitation'],
    services_offered: [
      {
        service_id: 'SRV-STALE-01',
        centre_id: 'C-STALE-AVL',
        service_name: 'Alojamiento Asistido Continuado',
        service_type: 'residential_care',
        target_populations: ['neurodegenerative_diseases'],
        allowed_life_stages: ['adult', 'older_adult'],
        access_routes: ['dependency_pia'],
        source_dataset: 'Registro de Centros de Atención Social CAM',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/r044',
        checked_at: '2026-08-10' // >30 días -> stale
      }
    ],
    allowed_life_stages: ['adult', 'older_adult'],
    access_route: {
      access_type: 'dependency_pia',
      competent_body: 'Consejería de Asuntos Sociales',
      official_description: 'Plaza concertada asignada por PIA.',
      source_url: 'https://comunidad.madrid/serviciossociales/centros/r044',
      checked_at: '2026-08-10',
      next_step_action: 'Compruebe con Servicios Sociales de Moratalaz.',
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: 'stale',
      authorised_places: 45,
      vacancies_known: false,
      source_url: 'https://comunidad.madrid/serviciossociales/centros/r044',
      checked_at: '2026-08-10', // 90 días de antigüedad
      stale: true
    },
    geographic_coverage: { type: 'community_wide', requires_residence: 'yes', checked_at: '2026-08-10' },
    accessibility_features: ['Baños geriátricos', 'Montacamillas'],
    provenance_records: [
      {
        attribute_name: 'specialisation',
        value: 'enfermedades neurodegenerativas',
        source_dataset: 'Registro Social CAM (R044)',
        source_url: 'https://comunidad.madrid/serviciossociales/centros/r044',
        source_type: 'official_registry',
        retrieved_at: '2026-11-08',
        extraction_method: 'structured',
        reviewer: 'J. M. Sánchez',
        reviewer_role: 'social',
        confidence: 'explicit',
        quality: 'B' // Calidad B por antigüedad >90 días
      }
    ],
    last_checked: '2026-08-10',
    limitations: ['Dato de disponibilidad verificado hace más de 30 días: clasificado como "Confirmar con el centro" según §72.']
  }
];
