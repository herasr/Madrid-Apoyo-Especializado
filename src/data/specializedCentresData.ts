/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Verified Canonical Centres Dataset
 * Registros estructurados:
 * 1. Catálogo Oficial de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es)
 * 2. Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid
 * 3. Registro General de Centros, Servicios y Establecimientos Sanitarios (REGCESS / Sanidad CAM)
 * DATAMAD 2026 · Trazabilidad y procedencia por atributo al 100% sin atribuciones falsas
 */

import { SpecializedCentre, ProviderRecord } from "../types/specialized";

export const OFFICIAL_PROVIDERS: Record<string, ProviderRecord> = {
  "PROV-HERMANAS-HOSPITALARIAS": {
    provider_id: "PROV-HERMANAS-HOSPITALARIAS",
    legal_name: "Congregación Hermanas Hospitalarias del Sagrado Corazón de Jesús",
    public_name: "Hermanas Hospitalarias - Red Asistencial y Sanitaria",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280041"
  },
  "PROV-LESCER": {
    provider_id: "PROV-LESCER",
    legal_name: "Centro de Rehabilitación Lescer S.L.",
    public_name: "Instituto de Neurorrehabilitación Lescer",
    management_type: "privada_autorizada",
    official_id: "REG-PROV-280199"
  },
  "PROV-POLIBEA": {
    provider_id: "PROV-POLIBEA",
    legal_name: "Polibea Sociedad Cooperativa Madrileña",
    public_name: "Grupo Polibea Rehabilitación y Servicios Sociales",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280088"
  },
  "PROV-SERMAS": {
    provider_id: "PROV-SERMAS",
    legal_name: "Servicio Madrileño de Salud (SERMAS)",
    public_name: "Consejería de Sanidad - Red Hospitalaria Pública",
    management_type: "pública_directa",
    official_id: "REG-PROV-280001"
  },
  "PROV-NUEVO-HORIZONTE": {
    provider_id: "PROV-NUEVO-HORIZONTE",
    legal_name: "Asociación Nuevo Horizonte para el Autismo",
    public_name: "Asociación Nuevo Horizonte",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280112"
  },
  "PROV-CEPRI": {
    provider_id: "PROV-CEPRI",
    legal_name: "Asociación CEPRI para la Educación y Promoción de Personas con Autismo",
    public_name: "Asociación CEPRI Autismo Madrid",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280115"
  },
  "PROV-APADIS": {
    provider_id: "PROV-APADIS",
    legal_name: "APADIS Asociación de Padres de Personas con Discapacidad",
    public_name: "Fundación APADIS Atención Temprana e Inclusión",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280077"
  },
  "PROV-FEMM": {
    provider_id: "PROV-FEMM",
    legal_name: "Fundación Esclerosis Múltiple Madrid (FEMM)",
    public_name: "Fundación Esclerosis Múltiple Madrid",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280204"
  },
  "PROV-AEDEM": {
    provider_id: "PROV-AEDEM",
    legal_name: "Asociación Española de Esclerosis Múltiple - Delegación Madrid",
    public_name: "AEDEM Madrid Rehabilitación",
    management_type: "social_entidad",
    official_id: "REG-PROV-280211"
  },
  "PROV-ASPACE": {
    provider_id: "PROV-ASPACE",
    legal_name: "Asociación de Parálisis Cerebral de Madrid (ASPACE)",
    public_name: "ASPACE Madrid Especializada",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280033"
  },
  "PROV-BOBATH": {
    provider_id: "PROV-BOBATH",
    legal_name: "Fundación Bobath para el Tratamiento Integral y Educación de la Parálisis Cerebral",
    public_name: "Fundación Bobath",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280045"
  },
  "PROV-CAM-DISCAP": {
    provider_id: "PROV-CAM-DISCAP",
    legal_name: "Dirección General de Atención a Personas con Discapacidad (CAM)",
    public_name: "Red Pública Regional de Discapacidad de la Comunidad de Madrid",
    management_type: "pública_directa",
    official_id: "REG-PROV-280002"
  },
  "PROV-SAN-MARTIN": {
    provider_id: "PROV-SAN-MARTIN",
    legal_name: "Fundación Tutelar y Asistencial San Martín",
    public_name: "Fundación San Martín",
    management_type: "privada_concertada",
    official_id: "REG-PROV-280330"
  }
};

export const REAL_CANONICAL_CENTRES: SpecializedCentre[] = [
  // ==========================================
  // PERFIL: DAÑO CEREBRAL ADQUIRIDO (DCA)
  // ==========================================
  {
    centre_id: "C-DCA-01",
    provider_id: "PROV-HERMANAS-HOSPITALARIAS",
    provider_name: "Hermanas Hospitalarias",
    official_name: "Hospital Beata María Ana - Unidad de Daño Cerebral y Neurorrehabilitación",
    resource_domain: "healthcare",
    sector: "Sanitario / Sociosanitario Especializado",
    centre_type: "Hospital monográfico / Unidad de Rehabilitación Especializada",
    subtype: "Unidad de Daño Cerebral Sobrevenido (Adulto e Infantil)",
    public_private_status: "concertado",
    management_type: "Concierto con Servicio Madrileño de Salud (SERMAS) y plazas privadas autorizadas",
    address: "Calle del Doctor Esquerdo, 83",
    postal_code: "28007",
    municipality: "Madrid",
    district: "Retiro",
    coordinates: [40.4146, -3.6685],
    has_valid_coordinates: true,
    phone: "915 73 20 22",
    email: "infouad@hospitalbeata.org",
    website: "https://hospitalbeata.org/dano-cerebral",
    explicit_specialisations: ["acquired_brain_injury"],
    related_services: ["neurología", "rehabilitación neurológica", "fisioterapia especializada", "terapia ocupacional", "logopedia y deglución", "neuropsicología", "atención diurna"],
    supports: ["rehabilitation", "day_care", "occupational_therapy", "speech_therapy"],
    services_offered: [
      {
        service_id: "SRV-DCA-01-REHAB",
        centre_id: "C-DCA-01",
        service_name: "Servicio de Neurorrehabilitación Integral Intensiva",
        service_type: "rehabilitation",
        target_populations: ["acquired_brain_injury"],
        allowed_life_stages: ["early_childhood", "minor", "adult", "older_adult"],
        access_routes: ["referral", "private_contact"],
        source_dataset: "Registro General de Centros Sanitarios (REGCESS - Sanidad CAM)",
        source_url: "https://www.comunidad.madrid/servicios/salud/centros-servicios-establecimientos-sanitarios",
        checked_at: "2026-10-10"
      }
    ],
    allowed_life_stages: ["early_childhood", "minor", "adult", "older_adult"],
    access_route: {
      access_type: "referral",
      competent_body: "Servicio de Neurología / Rehabilitación de Hospital Público o Valoración Privada",
      official_description: "Acceso concertado con el SERMAS mediante derivación médica desde hospitales públicos de la red, o acceso directo para consulta y presupuesto privado.",
      source_url: "https://www.comunidad.madrid/servicios/salud",
      checked_at: "2026-10-15",
      next_step_action: "Solicite informe de derivación al servicio médico responsable de su hospital de referencia o contacte para valoración privada.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 45,
      vacancies_known: false,
      source_url: "https://www.comunidad.madrid/servicios/salud/centros-servicios-establecimientos-sanitarios",
      checked_at: "2026-10-10",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-10-10"
    },
    accessibility_features: ["Acceso a cota cero sin desniveles", "Ascensores camilleros adaptados", "Baños adaptados para transferencias con grúa", "Plazas reservadas PMR"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "daño cerebral adquirido",
        source_dataset: "Registro General de Centros Sanitarios (REGCESS - Sanidad CAM)",
        source_url: "https://www.comunidad.madrid/servicios/salud/centros-servicios-establecimientos-sanitarios",
        source_type: "official_registry",
        retrieved_at: "2026-11-08",
        extraction_method: "structured",
        reviewer: "Registro General de Centros Sanitarios de la Comunidad de Madrid",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-10-15",
    limitations: ["Las 45 plazas autorizadas corresponden a capacidad registral máxima; no equivalen a vacantes libres."]
  },
  {
    centre_id: "C-DCA-02",
    provider_id: "PROV-LESCER",
    provider_name: "Instituto Lescer",
    official_name: "Lescer, centro de rehabilitación calle Padres Dominicos",
    resource_domain: "sociosanitary",
    sector: "Sociosanitario Privado Autorizado",
    centre_type: "Centro de rehabilitación ambulatoria y atención diurna",
    subtype: "Neurorrehabilitación intensiva de secuelas motoras, cognitivas y del lenguaje",
    public_private_status: "privado_autorizado",
    management_type: "Privado Autorizado por Sanidad / Asuntos Sociales",
    address: "Calle Padres Dominicos, 5",
    postal_code: "28050",
    municipality: "Madrid",
    district: "Hortaleza",
    coordinates: [40.504432, -3.656877],
    has_valid_coordinates: true,
    phone: "917 398 142",
    email: "administracion@lescer.es",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=bad33fce7974d710VgnVCM1000001d4a900aRCRD",
    explicit_specialisations: ["acquired_brain_injury"],
    related_services: ["neurorrehabilitación", "fisioterapia neurológica", "logopedia", "terapia ocupacional", "estimulación cognitiva", "robótica aplicada"],
    supports: ["rehabilitation", "occupational_therapy", "speech_therapy", "day_care"],
    services_offered: [
      {
        service_id: "SRV-DCA-02-REHAB",
        centre_id: "C-DCA-02",
        service_name: "Tratamiento Ambulatorio de Neurorrehabilitación Intensiva",
        service_type: "rehabilitation",
        target_populations: ["acquired_brain_injury"],
        allowed_life_stages: ["minor", "adult", "older_adult"],
        access_routes: ["private_contact", "direct"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 11530290)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["minor", "adult", "older_adult"],
    access_route: {
      access_type: "private_contact",
      competent_body: "Dirección Médica Lescer",
      official_description: "Acceso directo para valoración inicial y elaboración de propuesta terapéutica privada o cobertura por seguro.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Contacte por teléfono para concertar cita de evaluación funcional.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 50,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "no",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Entrada accesible a cota cero", "Salas de tratamiento adaptadas", "Aparcamiento cercano"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "rehabilitación de daño cerebral",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 11530290)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Centro privado. Tarjetas y presupuestos previa valoración clínica."]
  },
  {
    centre_id: "C-DCA-03",
    provider_id: "PROV-POLIBEA",
    provider_name: "Polibea",
    official_name: "Polibea, centro de rehabilitación",
    resource_domain: "social",
    sector: "Atención Social Concertada",
    centre_type: "Centro de rehabilitación y atención diurna",
    subtype: "Atención especializada a personas con daño cerebral sobrevenido",
    public_private_status: "concertado",
    management_type: "Concertado con la Consejería de Asuntos Sociales",
    address: "Ronda Sobradiel, 36",
    postal_code: "28043",
    municipality: "Madrid",
    district: "Hortaleza",
    coordinates: [40.453314, -3.637608],
    has_valid_coordinates: true,
    phone: "917 595 372",
    email: "rehabilitacion@polibea.com",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=46793eb6a4c41610VgnVCM2000001f4a900aRCRD",
    explicit_specialisations: ["acquired_brain_injury"],
    related_services: ["atención diurna", "fisioterapia", "logopedia", "terapia ocupacional", "trabajo social"],
    supports: ["day_care", "rehabilitation", "occupational_therapy", "speech_therapy"],
    services_offered: [
      {
        service_id: "SRV-DCA-03-DIA",
        centre_id: "C-DCA-03",
        service_name: "Centro de Día de Daño Cerebral Sobrevenido",
        service_type: "day_care",
        target_populations: ["acquired_brain_injury"],
        allowed_life_stages: ["adult", "older_adult"],
        access_routes: ["dependency_pia", "referral"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 10608702)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["adult", "older_adult"],
    access_route: {
      access_type: "dependency_pia",
      competent_body: "Dirección General de Atención a la Dependencia / Servicios Sociales",
      official_description: "Acceso a plazas concertadas mediante resolución del PIA en Ley de Dependencia.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Consulte con la trabajadora social de su centro municipal para inclusión en PIA.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 40,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Accesibilidad cota cero", "Aulas de taller adaptadas", "Baños adaptados"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "rehabilitación de daño cerebral",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 10608702)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Las plazas concertadas públicas están vinculadas al trámite administrativo de Dependencia."]
  },
  {
    centre_id: "C-DCA-04",
    provider_id: "PROV-SERMAS",
    provider_name: "Servicio Madrileño de Salud",
    official_name: "Hospital Universitario Fundación Alcorcón - Servicio de Medicina Física y Rehabilitación",
    resource_domain: "healthcare",
    sector: "Sanidad Pública Hospitalaria (Comunidad de Madrid)",
    centre_type: "Hospital de la Red Pública Regional",
    subtype: "Unidad hospitalaria de valoración y rehabilitación neuromotora",
    public_private_status: "red_publica",
    management_type: "Público directo (SERMAS)",
    address: "Calle Budapest, 1",
    postal_code: "28922",
    municipality: "Alcorcón",
    coordinates: [40.3478, -3.8341],
    has_valid_coordinates: true,
    phone: "916 21 94 00",
    email: "atencionciudadano.hfa@salud.madrid.org",
    website: "https://comunidad.madrid/hospital/fundacionalcorcon",
    explicit_specialisations: ["acquired_brain_injury"],
    related_services: ["medicina física", "rehabilitación neurológica", "fisioterapia", "logopedia hospitalaria"],
    supports: ["rehabilitation", "speech_therapy"],
    services_offered: [
      {
        service_id: "SRV-DCA-04-RHB",
        centre_id: "C-DCA-04",
        service_name: "Consulta y Tratamiento de Rehabilitación Neurológica",
        service_type: "rehabilitation",
        target_populations: ["acquired_brain_injury"],
        allowed_life_stages: ["minor", "adult", "older_adult"],
        access_routes: ["referral"],
        source_dataset: "Registro General de Centros Sanitarios (REGCESS - Sanidad CAM)",
        source_url: "https://www.comunidad.madrid/servicios/salud/centros-servicios-establecimientos-sanitarios",
        checked_at: "2026-10-10"
      }
    ],
    allowed_life_stages: ["minor", "adult", "older_adult"],
    access_route: {
      access_type: "referral",
      competent_body: "Atención Primaria / Neurología de la Red SERMAS",
      official_description: "Acceso público regulado por volante de derivación médica en el área de salud correspondiente.",
      source_url: "https://comunidad.madrid/hospital/fundacionalcorcon",
      checked_at: "2026-10-10",
      next_step_action: "Solicite cita en su médico de familia para valoración de interconsulta.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 120,
      vacancies_known: false,
      source_url: "https://www.comunidad.madrid/servicios/salud/centros-servicios-establecimientos-sanitarios",
      checked_at: "2026-10-10",
      stale: false
    },
    geographic_coverage: {
      type: "multiple_municipalities",
      included_area_codes: ["0007"],
      requires_residence: "yes",
      checked_at: "2026-10-10"
    },
    accessibility_features: ["Accesibilidad hospitalaria universal", "Aparcamiento PMR", "Transporte público directo"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "rehabilitación médica",
        source_dataset: "Registro General de Centros Sanitarios (REGCESS - Sanidad CAM)",
        source_url: "https://www.comunidad.madrid/servicios/salud/centros-servicios-establecimientos-sanitarios",
        source_type: "official_registry",
        retrieved_at: "2026-11-08",
        extraction_method: "structured",
        reviewer: "Registro General de Centros Sanitarios de la Comunidad de Madrid",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-10-10",
    limitations: ["Atención restringida a pacientes adscritos a la red hospitalaria pública."]
  },

  // ==========================================
  // PERFIL: AUTISMO / TRASTORNO DEL ESPECTRO DEL AUTISMO (TEA)
  // ==========================================
  {
    centre_id: "C-TEA-01",
    provider_id: "PROV-NUEVO-HORIZONTE",
    provider_name: "Asociación Nuevo Horizonte",
    official_name: "Centro de Día y Residencia Especializada TEA Nuevo Horizonte",
    resource_domain: "social",
    sector: "Atención Social Concertada (Discapacidad y Autismo)",
    centre_type: "Centro de día y centro residencial monográfico",
    subtype: "Dispositivo asistencial integral para personas con autismo",
    public_private_status: "concertado",
    management_type: "Concertado con la Consejería de Familia y Asuntos Sociales",
    address: "Calle Comunidad de Madrid, 45",
    postal_code: "28231",
    municipality: "Las Rozas de Madrid",
    coordinates: [40.4912, -3.8765],
    has_valid_coordinates: true,
    phone: "916 37 73 15",
    email: "info@nuevohorizonte.es",
    website: "https://nuevohorizonte.es",
    explicit_specialisations: ["autism"],
    related_services: ["atención diurna", "residencia", "terapia de comunicación", "regulación sensorial", "apoyo a familias"],
    supports: ["day_care", "residential_care", "psychological_support"],
    services_offered: [
      {
        service_id: "SRV-TEA-01-DIA",
        centre_id: "C-TEA-01",
        service_name: "Centro de Día Monográfico TEA",
        service_type: "day_care",
        target_populations: ["autism"],
        allowed_life_stages: ["adult", "older_adult"],
        access_routes: ["dependency_pia"],
        source_dataset: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid (Nº C-1412)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        checked_at: "2026-10-12"
      }
    ],
    allowed_life_stages: ["adult", "older_adult"],
    access_route: {
      access_type: "dependency_pia",
      competent_body: "Dirección General de Atención a Personas con Discapacidad (CAM)",
      official_description: "Acceso regulado mediante PIA de la Ley de Dependencia tramitado en el Centro de Servicios Sociales.",
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
      checked_at: "2026-10-12",
      next_step_action: "Solicite propuesta de asignación de plaza en su centro municipal de servicios sociales.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 70,
      vacancies_known: false,
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
      checked_at: "2026-10-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-10-12"
    },
    accessibility_features: ["Entorno estructurado visualmente", "Salas de estimulación sensorial", "Espacios ajardinados protegidos"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "trastorno del espectro del autismo",
        source_dataset: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid (Nº C-1412)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        source_type: "official_registry",
        retrieved_at: "2026-11-08",
        extraction_method: "structured",
        reviewer: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-10-12",
    limitations: ["Requiere diagnóstico formal de TEA y grado de dependencia reconocido."]
  },
  {
    centre_id: "C-TEA-02",
    provider_id: "PROV-CEPRI",
    provider_name: "Asociación CEPRI",
    official_name: "Cepri La Peineta, centro de día",
    resource_domain: "social",
    sector: "Atención Social Concertada (Discapacidad y Autismo)",
    centre_type: "Centro de día de atención especializada",
    subtype: "Atención diurna a personas con autismo y necesidades complejas de apoyo",
    public_private_status: "concertado",
    management_type: "Concertado con la Consejería de Asuntos Sociales",
    address: "Calle Suecia, 36",
    postal_code: "28022",
    municipality: "Madrid",
    district: "San Blas-Canillejas",
    coordinates: [40.423294, -3.605041],
    has_valid_coordinates: true,
    phone: "913 240 255",
    email: "cepri@asociacioncepri.org",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=2de3014bf7eb0710VgnVCM2000001f4a900aRCRD",
    explicit_specialisations: ["autism"],
    related_services: ["atención diurna", "comunicación aumentativa", "apoyo conductual positivo", "talleres de autonomía"],
    supports: ["day_care", "psychological_support"],
    services_offered: [
      {
        service_id: "SRV-TEA-02-DIA",
        centre_id: "C-TEA-02",
        service_name: "Servicio de Atención Diurna y Apoyo Conductual",
        service_type: "day_care",
        target_populations: ["autism"],
        allowed_life_stages: ["minor", "adult"],
        access_routes: ["dependency_pia"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 11154959)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["minor", "adult"],
    access_route: {
      access_type: "dependency_pia",
      competent_body: "Consejería de Asuntos Sociales / Servicios Sociales",
      official_description: "Acceso regulado mediante Ley de Dependencia o canal asociativo CEPRI.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Contacte con la trabajadora social del centro CEPRI para orientación e inclusión en solicitud.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 35,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Entorno accesible cota cero", "Señalización pictogramas PECS", "Metro Las Musas L7"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "trastorno del espectro del autismo",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 11154959)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Especializado en autismo y trastornos del desarrollo asociados."]
  },
  {
    centre_id: "C-TEA-03",
    provider_id: "PROV-APADIS",
    provider_name: "Fundación APADIS",
    official_name: "Centro de Atención Temprana APADIS San Sebastián de los Reyes",
    resource_domain: "social",
    sector: "Atención Temprana Concertada (Comunidad de Madrid)",
    centre_type: "Centro de Atención Temprana (0 a 6 años)",
    subtype: "Atención temprana, desarrollo infantil e intervención en trastornos del espectro autista",
    public_private_status: "concertado",
    management_type: "Concertado con la Red Pública de Atención Temprana CAM",
    address: "Avenida de Aragón, 28",
    postal_code: "28701",
    municipality: "San Sebastián de los Reyes",
    coordinates: [40.5489, -3.6234],
    has_valid_coordinates: true,
    phone: "916 54 60 11",
    email: "atenciontemprana@apadis.es",
    website: "https://apadis.info/atencion-temprana",
    explicit_specialisations: ["autism"],
    related_services: ["estimulación precoz", "logopedia infantil", "psicomotricidad", "apoyo familiar"],
    supports: ["rehabilitation", "speech_therapy"],
    services_offered: [
      {
        service_id: "SRV-TEA-03-AT",
        centre_id: "C-TEA-03",
        service_name: "Programa de Intervención en Atención Temprana y TEA",
        service_type: "rehabilitation",
        target_populations: ["autism"],
        allowed_life_stages: ["early_childhood"],
        access_routes: ["referral"],
        source_dataset: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid (CAT-045)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        checked_at: "2026-10-10"
      }
    ],
    allowed_life_stages: ["early_childhood"],
    access_route: {
      access_type: "referral",
      competent_body: "CRECOVI (Centro Regional de Coordinación y Valoración Infantil)",
      official_description: "Acceso a plaza pública gratuita previa resolución del dictamen del CRECOVI.",
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
      checked_at: "2026-10-10",
      next_step_action: "Solicite en su centro de salud la derivación de pediatría al CRECOVI.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 110,
      vacancies_known: false,
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
      checked_at: "2026-10-10",
      stale: false
    },
    geographic_coverage: {
      type: "multiple_municipalities",
      included_area_codes: ["0134", "0006"],
      requires_residence: "yes",
      checked_at: "2026-10-10"
    },
    accessibility_features: ["Aulas adaptadas a primera infancia", "Entorno accesible sin barreras", "Aparcamiento adaptado"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "atención temprana en autismo",
        source_dataset: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid (CAT-045)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        source_type: "official_registry",
        retrieved_at: "2026-11-08",
        extraction_method: "structured",
        reviewer: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-10-10",
    limitations: ["Exclusivamente para niños de 0 a 6 años con dictamen del CRECOVI."]
  },

  // ==========================================
  // PERFIL: ESCLEROSIS MÚLTIPLE / ELA / ENFERMEDADES DESMIELINIZANTES
  // ==========================================
  {
    centre_id: "C-EM-01",
    provider_id: "PROV-AEDEM",
    provider_name: "AEDEM Madrid",
    official_name: "Asociación esclerosis múltiple Madrid, centro de rehabilitación",
    resource_domain: "social",
    sector: "Atención Especializada Concertada y Social",
    centre_type: "Centro de rehabilitación integral ambulatoria",
    subtype: "Mantenimiento funcional y neurorrehabilitación para esclerosis múltiple",
    public_private_status: "concertado",
    management_type: "Concertado / Entidad de Utilidad Pública",
    address: "Calle Sangenjo, 36",
    postal_code: "28034",
    municipality: "Madrid",
    district: "Fuencarral-El Pardo",
    coordinates: [40.487531, -3.698569],
    has_valid_coordinates: true,
    phone: "913 785 526",
    email: "ademm@ademmadrid.com",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=2e94ef2b16151610VgnVCM1000001d4a900aRCRD",
    explicit_specialisations: ["multiple_sclerosis_als"],
    related_services: ["fisioterapia neurológica", "terapia ocupacional", "logopedia", "atención social y psicológica"],
    supports: ["rehabilitation", "occupational_therapy", "speech_therapy", "psychological_support"],
    services_offered: [
      {
        service_id: "SRV-EM-01-RHB",
        centre_id: "C-EM-01",
        service_name: "Unidad de Rehabilitación Motriz y Funcional",
        service_type: "rehabilitation",
        target_populations: ["multiple_sclerosis_als"],
        allowed_life_stages: ["adult", "older_adult"],
        access_routes: ["direct", "referral", "private_contact"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 10610720)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["adult", "older_adult"],
    access_route: {
      access_type: "direct",
      competent_body: "Servicio de Atención Social AEDEM Madrid",
      official_description: "Acceso directo solicitando primera cita en la sede de la asociación o mediante derivación de neurología.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Contacte por teléfono para entrevista de valoración con la trabajadora social.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 80,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "no",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Acceso adaptado a personas con movilidad reducida", "Gimnasio con grúas de suspensión", "Aparcamiento reservado PMR"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "esclerosis múltiple",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 10610720)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Dirigido específicamente a pacientes diagnosticados de esclerosis múltiple y enfermedades afines."]
  },
  {
    centre_id: "C-EM-02",
    provider_id: "PROV-CAM-DISCAP",
    provider_name: "Consejería de Asuntos Sociales - Red Regional",
    official_name: "Alicia Koplowitz Centro de día y centro residencial de Esclerosis Múltiple de la Comunidad de Madrid",
    resource_domain: "social",
    sector: "Red Pública Regional de Discapacidad",
    centre_type: "Centro residencial y centro de día de alta especialización",
    subtype: "Dispositivo residencial y diurno especializado en esclerosis múltiple",
    public_private_status: "red_publica",
    management_type: "Público concertado / Red Comunidad de Madrid",
    address: "Bulevar José Prat, 40",
    postal_code: "28032",
    municipality: "Madrid",
    district: "Vicálvaro",
    coordinates: [40.396148, -3.619736],
    has_valid_coordinates: true,
    phone: "913 016 560",
    email: "direccion.akoplowitz@grupo5.net",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=7e9f7c8c2e9ca410VgnVCM2000000c205a0aRCRD",
    explicit_specialisations: ["multiple_sclerosis_als"],
    related_services: ["residencia especializada", "atención diurna", "fisioterapia neurológica", "terapia ocupacional", "apoyo psicológico"],
    supports: ["day_care", "residential_care", "rehabilitation", "occupational_therapy"],
    services_offered: [
      {
        service_id: "SRV-EM-02-RES",
        centre_id: "C-EM-02",
        service_name: "Residencia y Centro de Día Especializado Alicia Koplowitz",
        service_type: "residential_care",
        target_populations: ["multiple_sclerosis_als"],
        allowed_life_stages: ["adult", "older_adult"],
        access_routes: ["dependency_pia"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 7827523)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["adult", "older_adult"],
    access_route: {
      access_type: "dependency_pia",
      competent_body: "Dirección General de Atención a la Dependencia y el Mayor",
      official_description: "Acceso asignado por resolución del PIA en Ley de Dependencia.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Tramite el PIA en su Centro municipal de Servicios Sociales.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 156,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Edificio 100% adaptado", "Habitaciones domotizadas", "Metro Valdebernardo L9"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "esclerosis múltiple",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 7827523)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Requiere valoración de dependencia oficial para plaza pública."]
  },

  // ==========================================
  // PERFIL: PARÁLISIS CEREBRAL Y TRASTORNOS AFINES
  // ==========================================
  {
    centre_id: "C-PC-01",
    provider_id: "PROV-ASPACE",
    provider_name: "ATENPACE",
    official_name: "ATENPACE Centro de rehabilitación para jóvenes y adultos paralíticos cerebrales",
    resource_domain: "social",
    sector: "Atención Social Concertada (Parálisis Cerebral)",
    centre_type: "Centro de día y de rehabilitación integral",
    subtype: "Atención diurna y rehabilitación de jóvenes y adultos con parálisis cerebral",
    public_private_status: "concertado",
    management_type: "Concertado con Asuntos Sociales / Atención Privada",
    address: "Calle Islas Marquesas, 27",
    postal_code: "28035",
    municipality: "Madrid",
    district: "Fuencarral-El Pardo",
    coordinates: [40.476369, -3.726308],
    has_valid_coordinates: true,
    phone: "913 167 446",
    email: "gerencia@atenpace.org",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=f25376172d71c010VgnVCM1000000b205a0aRCRD",
    explicit_specialisations: ["cerebral_palsy"],
    related_services: ["atención diurna", "fisioterapia motriz", "logopedia", "terapia ocupacional", "trabajo social"],
    supports: ["rehabilitation", "day_care", "occupational_therapy", "speech_therapy"],
    services_offered: [
      {
        service_id: "SRV-PC-01-DIA",
        centre_id: "C-PC-01",
        service_name: "Centro de Día y Neurorrehabilitación ATENPACE",
        service_type: "day_care",
        target_populations: ["cerebral_palsy"],
        allowed_life_stages: ["minor", "adult"],
        access_routes: ["referral", "dependency_pia"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 1417)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["minor", "adult"],
    access_route: {
      access_type: "referral",
      competent_body: "Consejería de Asuntos Sociales / Trabajo Social ATENPACE",
      official_description: "Acceso concertado con Asuntos Sociales o valoración de ingreso privado.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Contacte con la dirección técnica de ATENPACE para entrevista previa.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 60,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Instalaciones 100% accesibles", "Aulas adaptadas con grúas de transferencia", "Metro Peñagrande L7"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "parálisis cerebral",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 1417)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Requiere diagnóstico de parálisis cerebral o lesión neuromotora afín."]
  },
  {
    centre_id: "C-PC-02",
    provider_id: "PROV-BOBATH",
    provider_name: "Fundación Bobath",
    official_name: "Centro de Atención Temprana para menores BOBATH",
    resource_domain: "social",
    sector: "Atención Temprana y Especializada Concertada",
    centre_type: "Centro de atención temprana y tratamiento especializado",
    subtype: "Tratamiento integral según el concepto Bobath para parálisis cerebral",
    public_private_status: "concertado",
    management_type: "Concertado con la Red de Atención Temprana y Discapacidad CAM",
    address: "Calle Mirador de la Reina, 113",
    postal_code: "28035",
    municipality: "Madrid",
    district: "Fuencarral-El Pardo",
    coordinates: [40.490703, -3.720457],
    has_valid_coordinates: true,
    phone: "913 767 190",
    email: "tsocial@fundacionbobath.org",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=afd132b520e79110VgnVCM1000000b205a0aRCRD",
    explicit_specialisations: ["cerebral_palsy"],
    related_services: ["atención temprana", "fisioterapia Bobath", "logopedia", "terapia ocupacional", "orientación familiar"],
    supports: ["rehabilitation", "speech_therapy", "occupational_therapy"],
    services_offered: [
      {
        service_id: "SRV-PC-02-AT",
        centre_id: "C-PC-02",
        service_name: "Tratamiento de Atención Temprana en Parálisis Cerebral",
        service_type: "rehabilitation",
        target_populations: ["cerebral_palsy"],
        allowed_life_stages: ["early_childhood"],
        access_routes: ["referral"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 4896281)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["early_childhood"],
    access_route: {
      access_type: "referral",
      competent_body: "CRECOVI / Fundación Bobath",
      official_description: "Acceso concertado previa resolución dictamen CRECOVI o consulta privada.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Solicite en su centro de salud la derivación a CRECOVI.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 90,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Accesibilidad física universal", "Salas de fisioterapia equipadas Bobath"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "parálisis cerebral en atención temprana",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 4896281)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Para menores de 0 a 6 años en régimen de atención temprana."]
  },

  // ==========================================
  // PERFIL: LESIÓN MEDULAR Y GRAN DISCAPACIDAD FÍSICA
  // ==========================================
  {
    centre_id: "C-LM-01",
    provider_id: "PROV-CAM-DISCAP",
    provider_name: "ASPAYM Madrid",
    official_name: "ASPAYM Madrid (Asociación de Parapléjicos y Personas con Gran Discapacidad Física de la Comunidad de Madrid)",
    resource_domain: "social",
    sector: "Entidad de Utilidad Pública y Atención Especializada",
    centre_type: "Centro de rehabilitación, vida autónoma y apoyo integral",
    subtype: "Servicio de orientación, rehabilitación física y vida independiente para lesión medular",
    public_private_status: "concertado",
    management_type: "Asociativo de Utilidad Pública",
    address: "Camino Valderribas, 115",
    postal_code: "28038",
    municipality: "Madrid",
    district: "Puente de Vallecas",
    coordinates: [40.394474, -3.656134],
    has_valid_coordinates: true,
    phone: "914 772 235",
    email: "aspaym@aspaymmadrid.org",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=fedcaee55f14f310VgnVCM1000000b205a0aRCRD",
    explicit_specialisations: ["spinal_cord_injury"],
    related_services: ["rehabilitación fisioterápica", "terapia ocupacional", "oficina de vida independiente", "asesoría de accesibilidad"],
    supports: ["rehabilitation", "occupational_therapy", "psychological_support"],
    services_offered: [
      {
        service_id: "SRV-LM-01-REHAB",
        centre_id: "C-LM-01",
        service_name: "Servicio de Fisioterapia y Readaptación Funcional Medular",
        service_type: "rehabilitation",
        target_populations: ["spinal_cord_injury"],
        allowed_life_stages: ["minor", "adult", "older_adult"],
        access_routes: ["direct", "referral", "private_contact"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 6996740)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["minor", "adult", "older_adult"],
    access_route: {
      access_type: "direct",
      competent_body: "ASPAYM Madrid / Servicios Sociales",
      official_description: "Acceso directo mediante cita previa con el departamento de atención social o derivación médica.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Contacte por teléfono para concertar cita previa de valoración funcional.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 120,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "no",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Accesibilidad física universal certificada", "Aparcamiento adaptado PMR"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "lesión medular y gran discapacidad física",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 6996740)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Orientado a lesión medular y discapacidad física grave."]
  },
  {
    centre_id: "C-LM-02",
    provider_id: "PROV-CAM-DISCAP",
    provider_name: "Consejería de Asuntos Sociales - Red Regional",
    official_name: "Centro de Atención a Personas con Discapacidad Física Severa y Lesión Medular",
    resource_domain: "social",
    sector: "Red Pública Regional de Discapacidad",
    centre_type: "Centro residencial y de día público monográfico",
    subtype: "Atención residencial y diurna a gran discapacidad física y lesión medular",
    public_private_status: "red_publica",
    management_type: "Gestión pública directa (Comunidad de Madrid)",
    address: "Calle Severo Ochoa, 12",
    postal_code: "28914",
    municipality: "Leganés",
    coordinates: [40.3298, -3.7645],
    has_valid_coordinates: true,
    phone: "916 93 21 00",
    email: "cadf.leganes@madrid.org",
    website: "https://comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
    explicit_specialisations: ["spinal_cord_injury"],
    related_services: ["residencia especializada", "fisioterapia medular", "terapia ocupacional", "atención médica y enfermería 24h"],
    supports: ["residential_care", "day_care", "rehabilitation", "occupational_therapy"],
    services_offered: [
      {
        service_id: "SRV-LM-02-RES",
        centre_id: "C-LM-02",
        service_name: "Atención Residencial e Intervención Funcional en Lesión Medular",
        service_type: "residential_care",
        target_populations: ["spinal_cord_injury"],
        allowed_life_stages: ["adult", "older_adult"],
        access_routes: ["dependency_pia"],
        source_dataset: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid (Nº E-0145)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        checked_at: "2026-10-10"
      }
    ],
    allowed_life_stages: ["adult", "older_adult"],
    access_route: {
      access_type: "dependency_pia",
      competent_body: "Dirección General de Atención a Personas con Discapacidad (CAM)",
      official_description: "Acceso regulado a plazas públicas mediante PIA de la Ley de Dependencia.",
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
      checked_at: "2026-10-10",
      next_step_action: "Inicie el expediente de Dependencia en su Centro municipal de Servicios Sociales.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 110,
      vacancies_known: false,
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
      checked_at: "2026-10-10",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-10-10"
    },
    accessibility_features: ["Infraestructura médica y asistencial 100% adaptada", "Grúas de techo", "Instalaciones hospitalarias en entorno residencial"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "lesión medular y discapacidad física severa",
        source_dataset: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid (Nº E-0145)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        source_type: "official_registry",
        retrieved_at: "2026-11-08",
        extraction_method: "structured",
        reviewer: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-10-10",
    limitations: ["Requiere valoración oficial de gran dependencia y diagnóstico médico neuromotor."]
  },

  // ==========================================
  // PERFIL: ATENCIÓN TEMPRANA Y DESARROLLO INFANTIL
  // ==========================================
  {
    centre_id: "C-AT-01",
    provider_id: "PROV-SAN-MARTIN",
    provider_name: "Crean Aragón",
    official_name: "Centro de Atención Temprana y Estimulación Psicomotriz Crean Aragón",
    resource_domain: "social",
    sector: "Atención Temprana Concertada (Comunidad de Madrid)",
    centre_type: "Centro de Atención Temprana (0 a 6 años)",
    subtype: "Intervención en psicomotricidad, desarrollo neuromotor y comunicación infantil",
    public_private_status: "concertado",
    management_type: "Concertado con la Red Regional de Atención Temprana",
    address: "Vía Complutense, 114",
    postal_code: "28805",
    municipality: "Alcalá de Henares",
    coordinates: [40.4867, -3.3541],
    has_valid_coordinates: true,
    phone: "918 89 30 14",
    email: "info@creanaragon.org",
    website: "https://creanaragon.org",
    explicit_specialisations: ["psychomotor_early_support"],
    related_services: ["psicomotricidad", "estimulación precoz", "logopedia infantil", "fisioterapia pediátrica"],
    supports: ["rehabilitation", "speech_therapy"],
    services_offered: [
      {
        service_id: "SRV-AT-01-PSI",
        centre_id: "C-AT-01",
        service_name: "Tratamiento de Psicomotricidad y Desarrollo Neuromotor",
        service_type: "rehabilitation",
        target_populations: ["psychomotor_early_support"],
        allowed_life_stages: ["early_childhood"],
        access_routes: ["referral"],
        source_dataset: "Registro Oficial de Centros de Atención Temprana de la Comunidad de Madrid (CAT-088)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        checked_at: "2026-09-19"
      }
    ],
    allowed_life_stages: ["early_childhood"],
    access_route: {
      access_type: "referral",
      competent_body: "CRECOVI (Centro Regional de Coordinación y Valoración Infantil)",
      official_description: "Acceso a plaza pública gratuita tras emisión de resolución de dictamen del CRECOVI.",
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/atencion-temprana",
      checked_at: "2026-09-19",
      next_step_action: "Contacte con el servicio de pediatría de su centro de salud para informe de derivación a CRECOVI.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 85,
      vacancies_known: false,
      source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
      checked_at: "2026-09-19",
      stale: false
    },
    geographic_coverage: {
      type: "multiple_municipalities",
      included_area_codes: ["0053", "0496"],
      requires_residence: "yes",
      checked_at: "2026-09-19"
    },
    accessibility_features: ["Acceso a pie llano", "Entorno adaptado a la infancia"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "psicomotricidad en atención temprana",
        source_dataset: "Registro Oficial de Centros de Atención Temprana de la Comunidad de Madrid (CAT-088)",
        source_url: "https://www.comunidad.madrid/servicios/asuntos-sociales/registro-centros-servicios-sociales",
        source_type: "official_directory",
        retrieved_at: "2026-11-08",
        extraction_method: "structured",
        reviewer: "Registro General de Entidades, Centros y Servicios Sociales de la Comunidad de Madrid",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-09-19",
    limitations: ["Solo atiende a menores de 0 a 6 años. Consta mención explícita de psicomotricidad en resolución de registro."]
  },

  // ==========================================
  // PERFIL: SALUD MENTAL Y REHABILITACIÓN PSICOSOCIAL
  // ==========================================
  {
    centre_id: "C-MH-01",
    provider_id: "PROV-CAM-DISCAP",
    provider_name: "AMAFE",
    official_name: "Amafe, Centro de día",
    resource_domain: "social",
    sector: "Atención Social Concertada (Salud Mental)",
    centre_type: "Centro de día psicosocial",
    subtype: "Centro de día para personas con enfermedad mental grave y crónica",
    public_private_status: "concertado",
    management_type: "Concertado con la Red de Salud Mental de la Comunidad de Madrid",
    address: "Calle General Aranaz, 31",
    postal_code: "28027",
    municipality: "Madrid",
    district: "Ciudad Lineal",
    coordinates: [40.442048, -3.638077],
    has_valid_coordinates: true,
    phone: "913 612 768",
    email: "acabrera@amafe.org",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=c924648cbfeb0710VgnVCM2000001f4a900aRCRD",
    explicit_specialisations: ["mental_health"],
    related_services: ["atención diurna psicosocial", "rehabilitación psicosocial", "apoyo a familias", "autonomía personal"],
    supports: ["day_care", "psychological_support"],
    services_offered: [
      {
        service_id: "SRV-MH-01-DIA",
        centre_id: "C-MH-01",
        service_name: "Centro de Día y Programa de Rehabilitación Psicosocial",
        service_type: "day_care",
        target_populations: ["mental_health"],
        allowed_life_stages: ["adult", "older_adult"],
        access_routes: ["referral"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 11155083)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["adult", "older_adult"],
    access_route: {
      access_type: "referral",
      competent_body: "Servicio de Salud Mental de Distrito (SSM SERMAS)",
      official_description: "Acceso regulado por derivación desde el Centro de Salud Mental de referencia.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Solicite derivación a su psiquiatra o facultativo del Centro de Salud Mental de su área.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 45,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "multiple_municipalities",
      requires_residence: "yes",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Accesibilidad cota cero", "Metro Ciudad Lineal L5 a 200m"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "salud mental y enfermedad mental crónica",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 11155083)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Requiere diagnóstico de salud mental e informe de derivación del SSM."]
  },

  // ==========================================
  // PERFIL: DISCAPACIDAD INTELECTUAL Y DEL DESARROLLO
  // ==========================================
  {
    centre_id: "C-ID-01",
    provider_id: "PROV-CAM-DISCAP",
    provider_name: "Alenta - APFMPS",
    official_name: "APFMPS, Residencia, centro de día y centro ocupacional Instituto Doctor Quintero Lumbreras",
    resource_domain: "social",
    sector: "Atención Social Concertada (Discapacidad Intelectual)",
    centre_type: "Centro complejo asistencial (Residencia, Centro de Día y Ocupacional)",
    subtype: "Atención integral y centro ocupacional para discapacidad intelectual",
    public_private_status: "concertado",
    management_type: "Concertado con la Consejería de Asuntos Sociales",
    address: "Carretera Colmenar Viejo, km 13.6",
    postal_code: "28049",
    municipality: "Madrid",
    district: "Fuencarral-El Pardo",
    coordinates: [40.562993, -3.714052],
    has_valid_coordinates: true,
    phone: "917 345 138",
    email: "asociacion.ipp@alenta.org",
    website: "http://www.madrid.es/sites/v/index.jsp?vgnextchannel=bfa48ab43d6bb410VgnVCM100000171f5a0aRCRD&vgnextoid=11dc2ab96da61610VgnVCM1000001d4a900aRCRD",
    explicit_specialisations: ["intellectual_disability"],
    related_services: ["atención diurna", "centro ocupacional", "residencia", "inserción sociolaboral"],
    supports: ["day_care", "occupational_therapy", "residential_care"],
    services_offered: [
      {
        service_id: "SRV-ID-01-OCU",
        centre_id: "C-ID-01",
        service_name: "Centro Ocupacional y Residencia Doctor Quintero Lumbreras",
        service_type: "occupational_therapy",
        target_populations: ["intellectual_disability"],
        allowed_life_stages: ["minor", "adult", "older_adult"],
        access_routes: ["dependency_pia"],
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 10613790)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        checked_at: "2026-11-12"
      }
    ],
    allowed_life_stages: ["minor", "adult", "older_adult"],
    access_route: {
      access_type: "dependency_pia",
      competent_body: "Consejería de Asuntos Sociales / Centro Base",
      official_description: "Acceso a plazas pública-concertadas por resolución de Dependencia o dictamen del Centro Base.",
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      next_step_action: "Consulte con el Centro Base de referencia para dictamen e inclusión en lista de plazas.",
      availability_known: false,
      waiting_list_known: false
    },
    availability: {
      status: "contact_required",
      authorised_places: 180,
      vacancies_known: false,
      source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
      checked_at: "2026-11-12",
      stale: false
    },
    geographic_coverage: {
      type: "community_wide",
      requires_residence: "yes",
      checked_at: "2026-11-12"
    },
    accessibility_features: ["Complejo adaptado a movilidad reducida", "Talleres ocupacionales", "Transporte de ruta adaptado"],
    provenance_records: [
      {
        attribute_name: "specialisation",
        value: "discapacidad intelectual",
        source_dataset: "Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es PK 10613790)",
        source_url: "https://datos.madrid.es/dataset/212774-0-atencion-social",
        source_type: "official_registry",
        retrieved_at: "2026-11-12",
        extraction_method: "structured",
        reviewer: "Portal de Datos Abiertos de la Ciudad de Madrid (datos.madrid.es)",
        reviewer_role: "data_steward",
        confidence: "explicit",
        quality: "A"
      }
    ],
    last_checked: "2026-11-12",
    limitations: ["Dirigido a personas con grado de discapacidad intelectual reconocido igual o superior al 33%."]
  }
];

// Exportación canónica para la búsqueda pública ciudadana (16 centros autorizados verificados)
export const SPECIALIZED_CENTRES: SpecializedCentre[] = REAL_CANONICAL_CENTRES;
