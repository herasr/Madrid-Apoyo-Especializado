import { describe, it, expect } from 'vitest';
import { 
  normalizeText, 
  calculatePublicTransitTime, 
  getProfileDefinition, 
  centreHasSupportInSite,
  centreHasAccessibilityFeature,
  evaluateSupportCombination,
  evaluateCentre,
  runSpecializedSearch
} from './specializedEngine';
import { SpecializedCentre, SearchQueryState } from '../types/specialized';

const MOCK_CENTRE_TEA: SpecializedCentre = {
  centre_id: 'C-TEST-TEA-01',
  provider_id: 'PROV-01',
  provider_name: 'Asociación Apoyo TEA',
  official_name: 'Centro de Día de Atención a Personas con Autismo Madrid Sur',
  resource_domain: 'social',
  sector: 'Discapacidad / Autismo',
  centre_type: 'Centro de Día',
  subtype: 'Centro de Día para Personas con Autismo',
  public_private_status: 'red_publica',
  management_type: 'pública_directa',
  address: 'Calle Mayor 10',
  postal_code: '28001',
  municipality: 'Madrid',
  district: 'Centro',
  coordinates: [40.4168, -3.7038],
  has_valid_coordinates: true,
  phone: '910000000',
  email: 'info@test.es',
  website: 'https://test.es',
  explicit_specialisations: ['autism'],
  related_services: ['Atención diurna', 'Logopedia'],
  supports: ['day_care', 'speech_therapy'],
  services_offered: [],
  allowed_life_stages: ['minor', 'adult'],
  access_route: {
    access_type: 'referral',
    competent_body: 'Consejería de Familia',
    official_description: 'Derivación oficial',
    source_url: 'https://comunidad.madrid',
    checked_at: '2026-01-01',
    next_step_action: 'Solicitar valoración previa',
    availability_known: false,
    waiting_list_known: false
  },
  availability: {
    status: 'contact_required',
    authorised_places: 30,
    vacancies_known: false,
    source_url: 'https://comunidad.madrid',
    checked_at: '2026-01-01',
    stale: false
  },
  geographic_coverage: {
    type: 'community_wide',
    requires_residence: 'yes',
    checked_at: '2026-01-01'
  },
  accessibility_features: ['Acceso cota cero rampa adaptada', 'Bucles magnéticos en recepción'],
  provenance_records: [
    {
      attribute_name: 'specialisation',
      value: 'Autismo',
      source_dataset: 'Registro Oficial',
      source_url: 'https://comunidad.madrid',
      source_type: 'official_registry',
      retrieved_at: '2026-01-01',
      extraction_method: 'structured',
      reviewer: 'Audit',
      reviewer_role: 'social',
      confidence: 'explicit',
      quality: 'A'
    }
  ],
  last_checked: '2026-01-01',
  limitations: []
};

const DEFAULT_QUERY: SearchQueryState = {
  profile: null,
  functional_needs: [],
  support_types: [],
  support_combination_mode: 'any_support',
  life_stage: null,
  municipality: null,
  radius_km: 25,
  network_preference: 'all',
  accessibility_needs: [],
  user_ephemeral_location: [40.4168, -3.7038],
  location_mode: 'all'
};

describe('Specialized Search Engine (Funciones Puras)', () => {
  describe('normalizeText', () => {
    it('normaliza minúsculas, tildes y espacios correctamente', () => {
      expect(normalizeText('  Atención Temprana y Logopedia  ')).toBe('atencion temprana y logopedia');
      expect(normalizeText('Daño Cerebral Adquirido')).toBe('dano cerebral adquirido');
    });
  });

  describe('calculatePublicTransitTime', () => {
    it('calcula estimaciones realistas según distancia', () => {
      expect(calculatePublicTransitTime(1.0).minutes).toBe(13);
      expect(calculatePublicTransitTime(5.0).minutes).toBe(23);
      expect(calculatePublicTransitTime(20.0).minutes).toBe(58);
    });
  });

  describe('getProfileDefinition', () => {
    it('recupera definiciones de perfiles de la taxonomía oficial', () => {
      const autismDef = getProfileDefinition('autism');
      expect(autismDef).not.toBeNull();
      expect(autismDef?.preferred_label).toContain('autismo');
    });

    it('devuelve null para IDs desconocidos', () => {
      expect(getProfileDefinition('desconocido_123')).toBeNull();
    });
  });

  describe('centreHasSupportInSite', () => {
    it('detecta apoyos declarados directamente en el array de apoyos', () => {
      expect(centreHasSupportInSite(MOCK_CENTRE_TEA, 'day_care')).toBe(true);
      expect(centreHasSupportInSite(MOCK_CENTRE_TEA, 'occupational_therapy')).toBe(false);
    });
  });

  describe('centreHasAccessibilityFeature', () => {
    it('identifica características de accesibilidad física en el centro', () => {
      expect(centreHasAccessibilityFeature(MOCK_CENTRE_TEA, 'wheelchair_access')).toBe(true);
      expect(centreHasAccessibilityFeature(MOCK_CENTRE_TEA, 'magnetic_loops')).toBe(true);
      expect(centreHasAccessibilityFeature(MOCK_CENTRE_TEA, 'braille_signage')).toBe(false);
    });
  });

  describe('evaluateSupportCombination', () => {
    it('confirma combinación completa cuando todos los apoyos están en la misma sede', () => {
      const res = evaluateSupportCombination(MOCK_CENTRE_TEA, ['day_care', 'speech_therapy'], [MOCK_CENTRE_TEA]);
      expect(res.status).toBe('all_same_centre');
    });

    it('marca not_confirmed si no incluye los apoyos', () => {
      const res = evaluateSupportCombination(MOCK_CENTRE_TEA, ['residential_care'], [MOCK_CENTRE_TEA]);
      expect(res.status).toBe('not_confirmed');
    });
  });

  describe('evaluateCentre', () => {
    it('asigna Nivel de Evidencia A1 a especialización explícita con apoyo coincidente', () => {
      const query: SearchQueryState = {
        ...DEFAULT_QUERY,
        profile: 'autism',
        support_types: ['day_care']
      };
      const res = evaluateCentre(MOCK_CENTRE_TEA, query, [MOCK_CENTRE_TEA]);
      expect(res.evidence_level).toBe('A1');
      expect(res.suitability).toBe('complete');
    });

    it('clasifica incompatibilidad de etapa vital cuando no coincide', () => {
      const query: SearchQueryState = {
        ...DEFAULT_QUERY,
        profile: 'autism',
        life_stage: 'older_adult' // El centro solo autoriza minor y adult
      };
      const res = evaluateCentre(MOCK_CENTRE_TEA, query, [MOCK_CENTRE_TEA]);
      expect(res.suitability).toBe('incompatible');
    });

    it('clasifica incompatibilidad por falta de requisito de accesibilidad física exigido', () => {
      const query: SearchQueryState = {
        ...DEFAULT_QUERY,
        accessibility_needs: ['braille_signage']
      };
      const res = evaluateCentre(MOCK_CENTRE_TEA, query, [MOCK_CENTRE_TEA]);
      expect(res.suitability).toBe('incompatible');
    });
  });

  describe('runSpecializedSearch', () => {
    it('filtra y ordena resultados separando candidatos principales de incompatibles', () => {
      const query: SearchQueryState = {
        ...DEFAULT_QUERY,
        profile: 'autism'
      };
      const searchRes = runSpecializedSearch(query, [MOCK_CENTRE_TEA]);
      expect(searchRes.total_results).toBe(1);
      expect(searchRes.results[0].centre.centre_id).toBe('C-TEST-TEA-01');
      expect(searchRes.incompatible_results.length).toBe(0);
    });
  });
});
