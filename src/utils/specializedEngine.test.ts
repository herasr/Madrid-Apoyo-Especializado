import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  normalizeText,
  calculatePublicTransitTime,
  getProfileDefinition,
  centreHasSupportInSite,
  centreHasAccessibilityFeature,
  evaluateSupportCombination,
  evaluateCentre,
  runSpecializedSearch,
  auditCentreAgainstSnapshot
} from './specializedEngine';
import {
  buildCentresFromOfficialCSVs,
  classifyExplicitSpecialisations,
  utm30NToWgs84
} from './officialRegistryParser';
import { runAllCanonicalTests } from './specializedTestsSuite';
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
  radius_km: 50,
  network_preference: 'all',
  accessibility_needs: [],
  user_ephemeral_location: null,
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

  describe('utm30NToWgs84', () => {
    it('convierte coordenadas UTM 30N oficiales a lat/lon válidos en Madrid', () => {
      const coords = utm30NToWgs84(440320, 4474200);
      expect(coords).not.toBeNull();
      expect(coords![0]).toBeGreaterThan(40.3);
      expect(coords![0]).toBeLessThan(40.6);
      expect(coords![1]).toBeGreaterThan(-4.0);
      expect(coords![1]).toBeLessThan(-3.5);
    });

    it('rechaza coordenadas fuera de rango con null', () => {
      expect(utm30NToWgs84(0, 0)).toBeNull();
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

  describe('classifyExplicitSpecialisations (Guardas literales)', () => {
    it('evita falsos positivos de "San Juan Bautista" como autismo', () => {
      expect(classifyExplicitSpecialisations({ name: 'Centro San Juan Bautista', subtype: '', sector: '' })).toEqual([]);
    });

    it('no infiere patologías desde "discapacidad intelectual", "discapacidad física" ni "atención temprana"', () => {
      expect(
        classifyExplicitSpecialisations({
          name: 'LESCER, CENTRO DE REHABILITACION',
          subtype: 'CENTROS DE RECUPERACIÓN',
          sector: 'Personas con discapacidad física'
        })
      ).toEqual([]);
      expect(
        classifyExplicitSpecialisations({
          name: 'CEPRI LA PEINETA, CENTRO DE DIA',
          subtype: 'CENTROS DE DÍA: OTROS',
          sector: 'Personas con discapacidad intelectual'
        })
      ).toEqual([]);
      expect(
        classifyExplicitSpecialisations({
          name: 'CENTRO ALBEA ATENCION TEMPRANA',
          subtype: 'CENTROS DE ATENCIÓN',
          sector: 'Infancia'
        })
      ).toEqual([]);
    });

    it('asigna esclerosis múltiple a enfermedades neurodegenerativas', () => {
      expect(
        classifyExplicitSpecialisations({
          name: 'ALICIA KOPLOWITZ, CENTRO DE DIA DE ESCLEROSIS MULTIPLE',
          subtype: '',
          sector: 'Personas con discapacidad física'
        })
      ).toContain('neurodegenerative_diseases');
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
        life_stage: 'older_adult'
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

  describe('Canonical Test Suite (23 casos)', () => {
    it('supera el 100% de las pruebas canónicas sin regresiones', () => {
      const suite = runAllCanonicalTests();
      expect(suite.total).toBe(23);
      expect(suite.failedCount).toBe(0);
    });
  });

  describe('Integración real con los 3 CSV oficiales descargados en disco', () => {
    const snapshotsDir = path.resolve(process.cwd(), 'public/data/snapshots');
    const meta = JSON.parse(fs.readFileSync(path.join(snapshotsDir, 'snapshot-metadata.json'), 'utf8'));
    const madridBuf = fs.readFileSync(path.join(snapshotsDir, 'snapshot-latest.csv'));
    const camCentrosBuf = fs.readFileSync(path.join(snapshotsDir, 'cam-centros-latest.csv'));
    const camServiciosBuf = fs.readFileSync(path.join(snapshotsDir, 'cam-servicios-latest.csv'));

    const parsed = buildCentresFromOfficialCSVs({
      madridCsvText: madridBuf.toString('latin1'),
      camCentrosCsvText: camCentrosBuf.toString('utf8'),
      camServiciosCsvText: camServiciosBuf.toString('utf8'),
      snapshotDate: meta.last_updated?.slice(0, 10) || '2026-11-15'
    });

    it('verifica integridad exacta SHA-256 entre los ficheros CSV en disco y snapshot-metadata.json', () => {
      const shaMadrid = crypto.createHash('sha256').update(madridBuf).digest('hex');
      const shaCamC = crypto.createHash('sha256').update(camCentrosBuf).digest('hex');
      const shaCamS = crypto.createHash('sha256').update(camServiciosBuf).digest('hex');

      const srcMap = Object.fromEntries((meta.sources || []).map((s: any) => [s.source_id, s.sha256_hash]));
      expect(shaMadrid).toBe(srcMap.madrid_municipal);
      expect(shaCamC).toBe(srcMap.cam_centros);
      expect(shaCamS).toBe(srcMap.cam_servicios);
      expect(meta.sha256_hash).toBe(shaMadrid);
    });

    it('mantiene cero falsos positivos A1/A2 en todos los centros críticos vigilados', () => {
      const checkNoA = (centreId: string, profile: any) => {
        const c = parsed.centres.find(item => item.centre_id === centreId);
        expect(c).toBeDefined();
        const ev = evaluateCentre(c!, { ...DEFAULT_QUERY, profile }, parsed.centres, null);
        expect(['A1', 'A2']).not.toContain(ev.evidence_level);
      };

      checkNoA('CAM-C8019', 'acquired_brain_injury'); // Lescer
      checkNoA('CAM-C3456', 'acquired_brain_injury'); // Polibea
      checkNoA('CAM-C2412', 'autism'); // CEPRI
      checkNoA('CAM-C1812', 'autism'); // Quintero Lumbreras
      checkNoA('CAM-C2758', 'cerebral_palsy'); // Bobath AT
      checkNoA('CAM-C2758', 'psychomotor_early_support'); // Bobath AT
      checkNoA('CAM-C1591', 'psychomotor_early_support'); // APADIS AT
      checkNoA('CAM-C8927', 'neurodegenerative_diseases'); // Amafe
    });

    it('devuelve recursos A1 reales y verificables para perfiles clave (Esclerosis múltiple, TEA, ELA, Parkinson, Alzheimer, Lesión medular, Parálisis cerebral)', () => {
      const profilesToCheck: Array<SearchQueryState['profile']> = [
        'neurodegenerative_diseases',
        'autism',
        'acquired_brain_injury',
        'cerebral_palsy',
        'spinal_cord_injury',
        'als',
        'parkinson',
        'alzheimer'
      ];

      for (const profile of profilesToCheck) {
        const res = runSpecializedSearch({ ...DEFAULT_QUERY, profile }, parsed.centres, null);
        const aLevels = res.results.filter(r => r.evidence_level === 'A1' || r.evidence_level === 'A2');
        expect(aLevels.length).toBeGreaterThan(0);
      }
    });

    it('audita el 100% de los centros extraídos del CSV sin ninguna discrepancia', () => {
      for (const centre of parsed.centres) {
        const audit = auditCentreAgainstSnapshot(centre, meta, parsed.lookupIndex);
        expect(audit.is_official_csv).toBe(true);
        expect(audit.audit_status).not.toBe('discrepancy');
        expect(audit.audit_status).not.toBe('unverified');
      }
    });
  });
});

