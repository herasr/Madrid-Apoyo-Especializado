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
  mapCamMunicipalityName,
  utm30NToWgs84
} from './officialRegistryParser';
import { findMunicipalityByName, MADRID_MUNICIPALITIES } from '../data/municipalitiesData';
import { CORE_PROFILES } from '../data/specializedTaxonomy';
import { runAllCanonicalTests, TEST_SUITE_CATEGORIES } from './specializedTestsSuite';
import { loadLiveSnapshotData } from './liveSnapshotParser';
import { escapeCsvCell, buildResultsCsv, buildResultsJsonPayload } from '../components/specialized/SpecializedResultsList';
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
    it('calcula estimaciones orientativas según distancia', () => {
      const t1 = calculatePublicTransitTime(1.0);
      expect(t1.minutes).toBe(13);
      expect(t1.label).toContain('est.');
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

  describe('Canonical Test Suite (28 casos)', () => {
    it('supera el 100% de las pruebas canónicas sin regresiones', () => {
      const suite = runAllCanonicalTests();
      expect(suite.total).toBe(28);
      expect(suite.failedCount).toBe(0);
    });
  });

  describe('Mejoras v1.8 sobre el catálogo real y motor de evaluación', () => {
    const snapshotsDir = path.resolve(process.cwd(), 'public/data/snapshots');
    const meta = JSON.parse(fs.readFileSync(path.join(snapshotsDir, 'snapshot-metadata.json'), 'utf8'));
    const madridBuf = fs.readFileSync(path.join(snapshotsDir, 'snapshot-latest.csv'));
    const camCentrosBuf = fs.readFileSync(path.join(snapshotsDir, 'cam-centros-latest.csv'));
    const camServiciosBuf = fs.readFileSync(path.join(snapshotsDir, 'cam-servicios-latest.csv'));
    const classifiedJson = JSON.parse(fs.readFileSync(path.join(snapshotsDir, 'catalog-classified.json'), 'utf8'));

    const parsed = buildCentresFromOfficialCSVs({
      madridCsvText: madridBuf.toString('latin1'),
      camCentrosCsvText: camCentrosBuf.toString('utf8'),
      camServiciosCsvText: camServiciosBuf.toString('utf8'),
      snapshotDate: meta.timestamp?.slice(0, 10) || '2026-11-15'
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

    it('#1 y #2: filtro silla de ruedas solo admite Código 1/2 y bucle magnético usa Código 6', () => {
      const wheelchairRes = runSpecializedSearch(
        { ...DEFAULT_QUERY, accessibility_needs: ['wheelchair_access'] },
        parsed.centres,
        null
      );
      expect(wheelchairRes.results.length).toBeGreaterThan(50);
      expect(
        wheelchairRes.results.every(r =>
          r.centre.accessibility_features.some(f => f.includes('Código 1') || f.includes('Código 2'))
        )
      ).toBe(true);
      expect(
        wheelchairRes.results.some(r => r.centre.accessibility_features.some(f => f.includes('Código 3')))
      ).toBe(false);

      const loopRes = runSpecializedSearch(
        { ...DEFAULT_QUERY, accessibility_needs: ['magnetic_loops'] },
        parsed.centres,
        null
      );
      expect(loopRes.results.length).toBeGreaterThan(0);
    });

    it('#3: centros sin edad declarada (~700) permanecen visibles como partial al buscar minor', () => {
      const minorSearch = runSpecializedSearch(
        { ...DEFAULT_QUERY, life_stage: 'minor' },
        parsed.centres,
        null
      );
      const unstatedKept = minorSearch.results.filter(r => r.centre.allowed_life_stages.length === 0);
      expect(unstatedKept.length).toBeGreaterThan(500);
      expect(unstatedKept.every(r => r.suitability === 'partial')).toBe(true);
    });

    it('#4 y #5: sin PIA deducido por concierto y sin occupational_therapy ni falso B1/B2 en centros ocupacionales', () => {
      expect(parsed.centres.every(c => c.access_route.access_type === 'unknown')).toBe(true);
      const c1812 = parsed.centres.find(c => c.centre_id === 'CAM-C1812');
      expect(c1812).toBeDefined();
      expect(c1812!.supports).not.toContain('occupational_therapy');

      // Ningún centro ocupacional genérico debe escalar a B1/B2 por el texto de advertencia en related_services
      const evAbi = evaluateCentre(
        c1812!,
        { ...DEFAULT_QUERY, profile: 'acquired_brain_injury' },
        parsed.centres,
        null
      );
      expect(evAbi.evidence_level).toBe('C');

      // Los servicios de FORMACIÓN Y/O RECUPERACIÓN PROFESIONAL se clasifican como apoyo laboral, no rehabilitación médica
      const s6541 = parsed.centres.find(c => c.centre_id === 'CAM-SRV-S6541');
      expect(s6541).toBeDefined();
      expect(s6541!.supports).toContain('employment_support');
      expect(s6541!.supports).not.toContain('rehabilitation');

      expect(evAbi.transit_time_label).toBeTruthy();
      expect(evAbi.transit_time_label).toContain('est.');
    });

    it('#8 y #9: A2_entity en entidades de TEA y Bobath (CAM-SRV-S3848) con parálisis + daño cerebral', () => {
      const teaSearch = runSpecializedSearch({ ...DEFAULT_QUERY, profile: 'autism' }, parsed.centres, null);
      const a2EntityHits = teaSearch.results.filter(r => r.evidence_sublevel === 'A2_entity');
      expect(a2EntityHits.length).toBeGreaterThan(20);

      const bobathSrv = parsed.centres.find(c => c.centre_id === 'CAM-SRV-S3848');
      expect(bobathSrv).toBeDefined();
      expect(bobathSrv!.explicit_specialisations).toContain('acquired_brain_injury');
      expect(bobathSrv!.explicit_specialisations).toContain('cerebral_palsy');
    });

    it('clasifica correctamente MAD-PK públicos directos vs titularidad no especificada', () => {
      const centroBase1 = parsed.centres.find(c => c.centre_id === 'MAD-PK11906');
      const aspaym = parsed.centres.find(c => c.centre_id === 'MAD-PK6996740');
      expect(centroBase1).toBeDefined();
      expect(centroBase1!.public_private_status).toBe('red_publica');
      expect(aspaym).toBeDefined();
      expect(aspaym!.public_private_status).toBe('no_especificado');
    });

    it('#11: anonimización RGPD y capitalización española correcta en titulares personas físicas', () => {
      const s7705 = parsed.centres.find(c => c.centre_id === 'CAM-SRV-S7705');
      expect(s7705).toBeDefined();
      expect(s7705!.official_name).toContain('Atención');
      expect(s7705!.official_name).not.toContain('AtencióN');
      expect(s7705!.phone).toBe('');
      expect(s7705!.has_valid_coordinates).toBe(false);

      const s9981 = parsed.centres.find(c => c.centre_id === 'CAM-SRV-S9981');
      if (s9981) {
        expect(s9981.official_name).toContain('Profesional individual autorizado');
        expect(s9981.provider_name).toContain('omitido por privacidad');
        expect(s9981.phone).toBe('');
        expect(s9981.has_valid_coordinates).toBe(false);
      }
    });

    it('marca functional_needs como confirm_required en lugar de confirmed sin respaldo clínico', () => {
      const ev = evaluateCentre(
        MOCK_CENTRE_TEA,
        { ...DEFAULT_QUERY, profile: 'autism', functional_needs: ['swallowing', 'communication'] },
        [MOCK_CENTRE_TEA],
        null
      );
      const fnItems = ev.criterion_matrix.filter(c => c.criterion_id.startsWith('functional.'));
      expect(fnItems.length).toBe(2);
      expect(fnItems.every(c => c.status === 'confirm_required')).toBe(true);
      expect(ev.match_assessment.does_not_confirm.some(d => d.toLowerCase().includes('necesidades funcionales'))).toBe(true);
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

    it('devuelve recursos A1 reales y verificables para perfiles clave', () => {
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

    it('#7: catalog-classified.json coincide exactamente con parsed.centres y pasa auditoría CSV al 100%', () => {
      expect(classifiedJson.centres.length).toBe(parsed.centres.length);
      const slimMap = new Map<string, any>(classifiedJson.lookup_records);
      for (const centre of classifiedJson.centres) {
        const audit = auditCentreAgainstSnapshot(centre, meta, slimMap);
        expect(audit.is_official_csv).toBe(true);
        expect(audit.audit_status).not.toBe('discrepancy');
        expect(audit.audit_status).not.toBe('unverified');
      }
    });

    it('marcas de adecuación parcial y ranking honesto para apoyos ausentes, functional_needs y red privada/concertada', () => {
      const noSpeechCentre: SpecializedCentre = {
        ...MOCK_CENTRE_TEA,
        centre_id: 'MOCK-NO-SPEECH',
        supports: ['day_care']
      };
      const evMissingSupport = evaluateCentre(
        noSpeechCentre,
        { ...DEFAULT_QUERY, profile: 'autism', support_types: ['speech_therapy'] },
        [noSpeechCentre],
        null
      );
      expect(evMissingSupport.suitability).toBe('partial');

      const evFunctional = evaluateCentre(
        MOCK_CENTRE_TEA,
        { ...DEFAULT_QUERY, profile: 'autism', functional_needs: ['swallowing'] },
        [MOCK_CENTRE_TEA],
        null
      );
      expect(evFunctional.suitability).toBe('partial');

      const searchCount = runSpecializedSearch(
        { ...DEFAULT_QUERY, profile: 'autism', functional_needs: ['swallowing', 'communication'] },
        [MOCK_CENTRE_TEA],
        null
      );
      expect(searchCount.applied_filters_count).toBe(3);

      const concertadoCentre: SpecializedCentre = {
        ...MOCK_CENTRE_TEA,
        centre_id: 'MOCK-CONCERTADO',
        public_private_status: 'concertado'
      };
      const privadoCentre: SpecializedCentre = {
        ...MOCK_CENTRE_TEA,
        centre_id: 'MOCK-PRIVADO',
        public_private_status: 'privado_autorizado'
      };
      const privRes = runSpecializedSearch(
        { ...DEFAULT_QUERY, profile: 'autism', network_preference: 'private_authorised' },
        [concertadoCentre, privadoCentre],
        null
      );
      expect(privRes.results[0].centre.centre_id).toBe('MOCK-PRIVADO');
      expect(privRes.results[0].suitability).toBe('complete');
      expect(privRes.results[1].centre.centre_id).toBe('MOCK-CONCERTADO');
      expect(privRes.results[1].suitability).toBe('partial');
    });

    it('cubre el nomenclátor completo de municipios CSV, normaliza artículos y sincroniza municipalities.json', () => {
      expect(mapCamMunicipalityName('Cabrera, La')).toBe('La Cabrera');
      expect(mapCamMunicipalityName('Alamo, El')).toBe('El Álamo');
      expect(findMunicipalityByName('a')).toBeNull();
      expect(findMunicipalityByName('Cabrera, La')?.name).toBe('La Cabrera');
      expect(findMunicipalityByName('Madrid (ubicación reservada)')?.name).toBe('Madrid');

      const publicMunis = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), 'public/data/municipalities.json'), 'utf8')
      );
      expect(publicMunis.length).toBe(MADRID_MUNICIPALITIES.length);

      for (const centre of classifiedJson.centres) {
        if (centre.municipality === 'Madrid (ubicación reservada)') continue;
        expect(findMunicipalityByName(centre.municipality)).not.toBeNull();
      }
    });

    it('exige mínimo 3 centros explícitos A1 en CSV oficiales para todos los perfiles con estado approved', () => {
      expect(CORE_PROFILES.cerebral_palsy.status).toBe('experimental');
      for (const profile of Object.values(CORE_PROFILES)) {
        if (profile.status === 'approved') {
          const explicitCount = parsed.centres.filter(c =>
            c.explicit_specialisations.includes(profile.id)
          ).length;
          expect(explicitCount).toBeGreaterThanOrEqual(3);
        }
      }
    });

    it('neutraliza inyección de fórmulas en exportación CSV y excluye GPS efímero del JSON exportado', () => {
      expect(escapeCsvCell('=CMD("calc")')).toBe('"\'=CMD(""calc"")"');
      expect(escapeCsvCell('+SUM(A1:A2)')).toBe('"\'+SUM(A1:A2)"');
      expect(escapeCsvCell('-2+3')).toBe('"\'-2+3"');
      expect(escapeCsvCell('@IMPORTXML')).toBe('"\'@IMPORTXML"');

      const ev = evaluateCentre(MOCK_CENTRE_TEA, DEFAULT_QUERY, [MOCK_CENTRE_TEA], [40.4168, -3.7038]);
      const csv = buildResultsCsv([ev]);
      expect(csv).toContain('Estimación Transporte Público');
      expect(csv).toContain('URLs Oficiales');
      expect(csv).toContain('https://comunidad.madrid');

      const jsonPayload = buildResultsJsonPayload([ev], {
        ...DEFAULT_QUERY,
        user_ephemeral_location: [40.4168, -3.7038],
        location_mode: 'browser'
      });
      expect(jsonPayload.total_results).toBe(1);
      expect((jsonPayload.query as any).user_ephemeral_location).toBeUndefined();
    });

    it('sincroniza al 100% las categorías de la batería canónica con el visor de pruebas', () => {
      const suite = runAllCanonicalTests();
      const allowedIds = new Set<string>(TEST_SUITE_CATEGORIES.map(c => c.id));
      expect(suite.total).toBeGreaterThanOrEqual(25);
      expect(suite.failedCount).toBe(0);
      for (const testItem of suite.results) {
        expect(allowedIds.has(testItem.category)).toBe(true);
      }
    });

    it('mantiene operativo el catálogo pre-clasificado aunque falle snapshot-metadata.json en caché parcial', async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = (async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('snapshot-metadata.json')) {
          return Promise.reject(new Error('offline_metadata_miss'));
        }
        if (url.includes('snapshot-diffs.json')) {
          return new Response(JSON.stringify({ diffs: [] }), { status: 200 });
        }
        if (url.includes('catalog-classified.json')) {
          return new Response(
            JSON.stringify({
              centres: classifiedJson.centres.slice(0, 5),
              lookup_records: classifiedJson.lookup_records.slice(0, 5),
              total_records: 5
            }),
            { status: 200 }
          );
        }
        return new Response(null, { status: 404 });
      }) as typeof fetch;

      try {
        const loaded = await loadLiveSnapshotData([]);
        expect(loaded.state.loaded).toBe(true);
        expect(loaded.state.load_source).toBe('preclassified_json');
        expect(loaded.state.used_fallback).toBe(false);
        expect(loaded.centres.length).toBe(5);
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});

