/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Official CSV Registry Parser & Evidence Classifier
 * Convierte de forma determinista y sin extrapolaciones los 3 CSV oficiales descargados:
 *   1. Catálogo de Centros de Atención Social (datos.madrid.es)
 *   2. Registro General de Centros de Atención Social (datos.comunidad.madrid)
 *   3. Registro General de Servicios de Atención Social (datos.comunidad.madrid)
 */

import {
  SpecializedCentre,
  ProfileId,
  SupportTypeId,
  LifeStage,
  AccessRouteType,
  AttributeProvenance
} from '../types/specialized';

export const OFFICIAL_DATASET_URLS = {
  madrid_municipal: 'https://datos.madrid.es/dataset/212774-0-atencion-social',
  cam_centros: 'https://datos.comunidad.madrid/dataset/atencion_social_registro_centros',
  cam_servicios: 'https://datos.comunidad.madrid/dataset/atencion_social_registro_servicios'
};

export interface SnapshotCentreRecord {
  registry_key: string;
  source_id: 'madrid_municipal' | 'cam_centros' | 'cam_servicios';
  official_name: string;
  phone: string;
  address: string;
  municipality: string;
  postal_code: string;
  authorised_places: number | null;
  accessibility_code?: string;
}

export function parseSemicolonCSV(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let insideQuote = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const nextChar = clean[i + 1];

    if (char === '"' && insideQuote && nextChar === '"') {
      currentVal += '"';
      i++;
    } else if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ';' && !insideQuote) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentVal.trim());
      if (currentRow.length > 1) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentRow.length > 1) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }
  return rows;
}

/**
 * Conversión exacta ETRS89 UTM Huso 30N (EPSG:25830) -> WGS84 [lat, lon]
 */
export function utm30NToWgs84(easting: number, northing: number): [number, number] | null {
  if (!Number.isFinite(easting) || !Number.isFinite(northing)) return null;
  if (easting < 300000 || easting > 550000 || northing < 4400000 || northing > 4600000) {
    return null;
  }

  const a = 6378137.0;
  const f = 1 / 298.257222101;
  const k0 = 0.9996;
  const e2 = 2 * f - f * f;
  const ep2 = e2 / (1 - e2);
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));

  const x = easting - 500000.0;
  const y = northing;

  const M = y / k0;
  const mu =
    M /
    (a *
      (1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256));

  const phi1 =
    mu +
    ((3 * e1) / 2 - (27 * Math.pow(e1, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * Math.pow(e1, 2)) / 16 - (55 * Math.pow(e1, 4)) / 32) * Math.sin(4 * mu) +
    ((151 * Math.pow(e1, 3)) / 96) * Math.sin(6 * mu) +
    ((1097 * Math.pow(e1, 4)) / 512) * Math.sin(8 * mu);

  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const tanPhi1 = Math.tan(phi1);

  const N1 = a / Math.sqrt(1 - e2 * sinPhi1 * sinPhi1);
  const T1 = tanPhi1 * tanPhi1;
  const C1 = ep2 * cosPhi1 * cosPhi1;
  const R1 = (a * (1 - e2)) / Math.pow(1 - e2 * sinPhi1 * sinPhi1, 1.5);
  const D = x / (N1 * k0);

  const latRad =
    phi1 -
    ((N1 * tanPhi1) / R1) *
      ((D * D) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * ep2) * Math.pow(D, 4)) / 24 +
        ((61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * ep2 - 3 * C1 * C1) * Math.pow(D, 6)) / 720);

  const lonRad =
    (-3 * Math.PI) / 180 +
    (D -
      ((1 + 2 * T1 + C1) * Math.pow(D, 3)) / 6 +
      ((5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * ep2 + 24 * T1 * T1) * Math.pow(D, 5)) / 120) /
      cosPhi1;

  const lat = Number(((latRad * 180) / Math.PI).toFixed(6));
  const lon = Number(((lonRad * 180) / Math.PI).toFixed(6));

  if (lat < 39.8 || lat > 41.25 || lon < -4.65 || lon > -3.0) {
    return null;
  }
  return [lat, lon];
}

export function normalizeStrict(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function normalizePhoneComparable(phone: string): string {
  if (!phone) return '';
  const clean = phone.trim().toUpperCase();
  if (clean === 'RESERVADO' || clean === 'N/D') return '';
  const firstSegment = clean.split(/[\/;,]/)[0].trim();
  const digits = firstSegment.replace(/\D/g, '');
  return digits.length >= 9 ? digits.slice(0, 9) : digits;
}

export function normalizeAddressComparable(address: string): string {
  return normalizeStrict(address)
    .replace(/^(calle|c|avda|avenida|plaza|pza|paseo|pso|cmno|camino|ronda|rda|bulevar|bulv|bulev|ctra|carretera|glorieta|gta|trva|travesia)\s+/g, '')
    .replace(/\b(de la|del|de los|de las|de|la|el|los|las)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clasifica ÚNICAMENTE si los campos oficiales del registro declaran literalmente la condición.
 * Cero inferencias por discapacidad intelectual -> TEA, discapacidad física -> DCA/LM,
 * atención temprana -> parálisis cerebral / psicomotricidad, ni enfermedad mental -> neurodegenerativas.
 */
export function classifyExplicitSpecialisations(parts: {
  name: string;
  subtype: string;
  sector: string;
  entity?: string;
}): ProfileId[] {
  const combinedRaw = [parts.name, parts.subtype, parts.sector, parts.entity || ''].join(' ');
  const norm = normalizeStrict(combinedRaw)
    // Evitar falso positivo por "San Juan Bautista" conteniendo "autis" si no hubiera fronteras
    .replace(/\bbautista\b/g, ' ');

  const matched: ProfileId[] = [];

  if (/\b(autism[oa]s?|autist[ae]s?|tea|trastornos? del espectro (?:del )?autism[oa]|asperger)\b/.test(norm)) {
    matched.push('autism');
  }

  if (/\b(dano cerebral adquirido|dano cerebral sobrevenido|dano cerebral|dca|ictus|traumatismo craneoencefalico|rehabictus|paralisis y el dano cerebrales)\b/.test(norm)) {
    matched.push('acquired_brain_injury');
  }

  if (/\b(paralisis cerebral|paraliticos? cerebrales?|paralisis y el dano cerebrales)\b/.test(norm)) {
    matched.push('cerebral_palsy');
  }

  if (/\b(esclerosis multiple|enfermedades? neurodegenerativas?|patologias? neurodegenerativas?)\b/.test(norm)) {
    matched.push('neurodegenerative_diseases');
  }

  if (/\b(lesion medular|lesionado medular|lesionados medulares|paraplejic[oa]s?|paraplejia|tetraplejia)\b/.test(norm)) {
    matched.push('spinal_cord_injury');
  }

  if (/\b(psicomotricidad|psicomotricistas?|psicomotri[cz][a-z]*)\b/.test(norm)) {
    matched.push('psychomotor_early_support');
  }

  if (/\b(tdah|deficit de atencion(?: e hiperactividad)?)\b/.test(norm)) {
    matched.push('adhd');
  }

  if (/\b(esclerosis lateral amiotrofica|adela|asistencia personal ela)\b/.test(norm)) {
    matched.push('als');
  }

  if (/\b(parkinson|parkinsonismo)\b/.test(norm)) {
    matched.push('parkinson');
  }

  if (/\b(alzheimer|demencias?)\b/.test(norm)) {
    matched.push('alzheimer');
  }

  if (/\b(enfermedades? raras|enfermedades? poco frecuentes)\b/.test(norm)) {
    matched.push('rare_diseases');
  }

  if (/\b(discapacidad auditiva|sordera|sordoceguera|personas sordas|personas sordociegas|hipoacusia|implante coclear)\b/.test(norm)) {
    matched.push('hearing_disability');
  }

  if (/\b(discapacidad visual|ceguera|baja vision|personas ciegas|sordoceguera|personas sordociegas|deficiencia visual)\b/.test(norm)) {
    matched.push('visual_disability');
  }

  return matched;
}

function mapCamMunicipalityName(raw: string): string {
  const s = (raw || '').trim();
  if (!s || s.toUpperCase() === 'RESERVADO') return 'Madrid (ubicación reservada)';
  if (s === 'Rozas de Madrid, Las') return 'Las Rozas de Madrid';
  if (s === 'Álamo, El') return 'El Álamo';
  if (s === 'Escorial, El') return 'El Escorial';
  if (s === 'Molinos, Los') return 'Los Molinos';
  if (s === 'Vellon, El' || s === 'Vellón, El') return 'El Vellón';
  if (s === 'Molar, El') return 'El Molar';
  return s;
}

function inferSupportsFromOfficialFields(tipo: string, subtipo: string, denom: string): SupportTypeId[] {
  const norm = normalizeStrict(`${tipo} ${subtipo} ${denom}`);
  const supports = new Set<SupportTypeId>();

  if (/\b(centro de dia|centros de dia|atencion diurna)\b/.test(norm)) {
    supports.add('day_care');
  }
  if (/\b(residencia|residencias|residencial|piso tutelado|pisos tutelados|vivienda comunitaria|viviendas comunitarias|hogar)\b/.test(norm)) {
    supports.add('residential_care');
  }
  if (/\b(rehabilitacion|atencion temprana|recuperacion)\b/.test(norm)) {
    supports.add('rehabilitation');
  }
  if (/\b(ocupacional|centro ocupacional|centros ocupacionales)\b/.test(norm)) {
    supports.add('day_care');
    supports.add('occupational_therapy');
  }
  if (/\b(insercion laboral|empleo|rehabilitacion laboral|laboral)\b/.test(norm)) {
    supports.add('employment_support');
  }
  if (/\b(psicosocial|psico social|apoyo psicologico|psicologia|grupos de ayuda mutua)\b/.test(norm)) {
    supports.add('psychological_support');
  }
  if (/\b(logopedia|comunicacion)\b/.test(norm)) {
    supports.add('speech_therapy');
  }
  return Array.from(supports);
}

function inferLifeStagesFromOfficialFields(sector: string, denom: string, tipo: string): LifeStage[] {
  const norm = normalizeStrict(`${sector} ${denom} ${tipo}`);
  const stages = new Set<LifeStage>();

  if (/\b(atencion temprana)\b/.test(norm)) {
    stages.add('early_childhood');
    return ['early_childhood'];
  }
  if (/\b(infancia)\b/.test(norm)) stages.add('early_childhood');
  if (/\b(infancia|adolescencia|menores?|ninos|infantil|jovenes)\b/.test(norm)) stages.add('minor');
  if (/\b(adult[oa]s?|ocupacional|laboral|insercion)\b/.test(norm)) stages.add('adult');
  if (/\b(mayores?|alzheimer|parkinson|demencia)\b/.test(norm)) stages.add('older_adult');

  if (stages.size === 0) {
    return ['adult', 'older_adult'];
  }
  return Array.from(stages);
}

function mapPublicPrivateStatus(gest: string, isMunicipalPublic: boolean): {
  status: 'red_publica' | 'concertado' | 'privado_autorizado';
  accessType: AccessRouteType;
  nextStep: string;
} {
  if (isMunicipalPublic) {
    return {
      status: 'red_publica',
      accessType: 'dependency_pia',
      nextStep: 'Recurso público municipal: consulte acceso mediante los Servicios Sociales de su distrito o trámite PIA.'
    };
  }
  const g = normalizeStrict(gest);
  if (g.includes('propia') || g.includes('publica directa')) {
    return {
      status: 'red_publica',
      accessType: 'dependency_pia',
      nextStep: 'Centro de titularidad pública de la Comunidad de Madrid: acceso mediante dictamen o resolución PIA.'
    };
  }
  if (g.includes('concertada')) {
    return {
      status: 'concertado',
      accessType: 'dependency_pia',
      nextStep: 'Dispone de plazas concertadas (acceso por PIA/derivación oficial) o consulta directa con la entidad.'
    };
  }
  return {
    status: 'privado_autorizado',
    accessType: 'unknown',
    nextStep: 'Debe confirmarse con el organismo competente o contactar directamente con el centro titular.'
  };
}

function mapAccessibilityFromCode(rawCode: string): string[] {
  const code = (rawCode || '').trim();
  if (!code) return [];
  const tokens = code.split(',').map(t => t.trim());
  const features: string[] = [];
  if (tokens.includes('1')) {
    features.push('Accesible para movilidad reducida (Código 1 · datos.madrid.es)');
  } else if (tokens.includes('2')) {
    features.push('Parcialmente accesible (Código 2 · datos.madrid.es)');
  } else if (tokens.includes('3')) {
    features.push('Sin acreditación de accesibilidad adaptada confirmada en catálogo (Código 3 · datos.madrid.es)');
  } else if (tokens.includes('0')) {
    features.push('No accesible para movilidad reducida (Código 0 · datos.madrid.es)');
  }
  if (tokens.includes('4')) features.push('Adaptación visual básica declarada (Código 4 · datos.madrid.es)');
  if (tokens.includes('5')) features.push('Adaptación auditiva básica declarada (Código 5 · datos.madrid.es)');
  if (tokens.includes('6')) features.push('Accesibilidad cognitiva básica declarada (Código 6 · datos.madrid.es)');
  return features;
}

function isRelevantCamRow(sector: string, tipo: string, subtipo: string, denom: string, entity: string, explicitSpecs: ProfileId[]): boolean {
  if (explicitSpecs.length > 0) return true;
  const norm = normalizeStrict(`${sector} ${tipo} ${subtipo} ${denom} ${entity}`);
  return (
    norm.includes('discapacidad') ||
    norm.includes('atencion temprana') ||
    norm.includes('enfermedad mental')
  );
}

function isRelevantMadridRow(nombre: string, equipamiento: string, tipoUrl: string, explicitSpecs: ProfileId[]): boolean {
  if (explicitSpecs.length > 0) return true;
  const norm = normalizeStrict(`${nombre} ${equipamiento} ${tipoUrl}`);
  return (
    norm.includes('discapacidad') ||
    norm.includes('atencion temprana') ||
    norm.includes('enfermedad mental') ||
    norm.includes('centrosatencionsocialpersonasdiscapacidad') ||
    norm.includes('centrosatenciontemprana')
  );
}

export interface OfficialCatalogBuildResult {
  centres: SpecializedCentre[];
  lookupIndex: Map<string, SnapshotCentreRecord>;
}

export function buildCentresFromOfficialCSVs(params: {
  madridCsvText?: string | null;
  camCentrosCsvText?: string | null;
  camServiciosCsvText?: string | null;
  snapshotDate?: string;
}): OfficialCatalogBuildResult {
  const checkDate = params.snapshotDate || new Date().toISOString().slice(0, 10);
  const lookupIndex = new Map<string, SnapshotCentreRecord>();
  const centres: SpecializedCentre[] = [];

  // Índice auxiliar para vincular filas de datos.madrid.es con CAM Centros físicos
  interface MadridParsedRow {
    pk: string;
    name: string;
    equipamiento: string;
    transporte: string;
    accCode: string;
    contentUrl: string;
    address: string;
    postalCode: string;
    district: string;
    coords: [number, number] | null;
    phone: string;
    email: string;
    tipoPath: string;
    usedByCam: boolean;
  }

  const madridRows: MadridParsedRow[] = [];
  const madridByPhone = new Map<string, MadridParsedRow[]>();
  const madridByAddr = new Map<string, MadridParsedRow[]>();

  if (params.madridCsvText) {
    const rows = parseSemicolonCSV(params.madridCsvText);
    if (rows.length > 1) {
      const h = rows[0].map(c => c.trim().toUpperCase());
      const col = (name: string) => h.indexOf(name);

      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const pk = r[col('PK')]?.trim();
        if (!pk) continue;
        const name = r[col('NOMBRE')] || `Centro Municipal PK ${pk}`;
        const clase = r[col('CLASE-VIAL')] || '';
        const via = r[col('NOMBRE-VIA')] || '';
        const num = r[col('NUM')] || '';
        const address = [clase, via, num].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        const postalCode = (r[col('CODIGO-POSTAL')] || '').trim();
        const district = (r[col('DISTRITO')] || '').trim();
        const lat = parseFloat(r[col('LATITUD')] || '');
        const lon = parseFloat(r[col('LONGITUD')] || '');
        const coords: [number, number] | null =
          Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0
            ? [Number(lat.toFixed(6)), Number(lon.toFixed(6))]
            : null;
        const phone = (r[col('TELEFONO')] || '').trim();
        const email = (r[col('EMAIL')] || '').trim();
        const accCode = (r[col('ACCESIBILIDAD')] || '').trim();
        const contentUrl = (r[col('CONTENT-URL')] || '').trim();
        const equipamiento = (r[col('EQUIPAMIENTO')] || '').trim();
        const transporte = (r[col('TRANSPORTE')] || '').trim();
        const tipoPath = (r[col('TIPO')] || '').trim();

        const key = `MAD-PK${pk}`;
        lookupIndex.set(key, {
          registry_key: key,
          source_id: 'madrid_municipal',
          official_name: name,
          phone,
          address,
          municipality: 'Madrid',
          postal_code: postalCode,
          authorised_places: null,
          accessibility_code: accCode
        });

        const parsed: MadridParsedRow = {
          pk,
          name,
          equipamiento,
          transporte,
          accCode,
          contentUrl,
          address,
          postalCode,
          district,
          coords,
          phone,
          email,
          tipoPath,
          usedByCam: false
        };
        madridRows.push(parsed);

        const normPhone = normalizePhoneComparable(phone);
        if (normPhone) {
          const list = madridByPhone.get(normPhone) || [];
          list.push(parsed);
          madridByPhone.set(normPhone, list);
        }
        const normAddr = `${normalizeAddressComparable(address)}|${postalCode}`;
        if (normAddr !== '|') {
          const list = madridByAddr.get(normAddr) || [];
          list.push(parsed);
          madridByAddr.set(normAddr, list);
        }
      }
    }
  }

  // 2. Parsear Comunidad de Madrid - Registro de Centros
  const trackedEntities = new Set<string>([
    'lescer', 'polibea', 'cepri', 'bobath', 'amafe', 'apadis', 'aspaym',
    'alicia koplowitz', 'atenpace', 'aleph', 'nuevo horizonte', 'apanefa',
    'atipadace', 'adela', 'feder', 'pita lopez', 'parkinson', 'esclerosis', 'alzheimer'
  ]);

  if (params.camCentrosCsvText) {
    const rows = parseSemicolonCSV(params.camCentrosCsvText);
    if (rows.length > 1) {
      const h = rows[0].map(c => c.trim().toLowerCase());
      const col = (name: string) => h.indexOf(name);

      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const regId = r[col('numero_registro')]?.trim();
        if (!regId) continue;

        const sector = (r[col('sector')] || '').trim();
        const tipo = (r[col('tipo')] || '').trim();
        const subtipo = (r[col('subtipo')] || '').trim();
        const denom = (r[col('denominacion')] || '').trim();
        const plazasRaw = (r[col('plazas_autorizadas_numero')] || '').trim();
        const placesNum = /^\d+$/.test(plazasRaw) && parseInt(plazasRaw, 10) > 0 ? parseInt(plazasRaw, 10) : null;
        const muniRaw = (r[col('municipio_nombre')] || '').trim();
        const municipality = mapCamMunicipalityName(muniRaw);
        const viaTipo = (r[col('direccion_via_tipo')] || '').trim();
        const viaName = (r[col('direccion_via_nombre')] || '').trim();
        const portal = (r[col('direccion_portal')] || '').trim();
        const addressRaw = [viaTipo, viaName, portal].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        const address = addressRaw.toUpperCase().includes('RESERVADO')
          ? 'Dirección reservada en el registro público oficial'
          : addressRaw;
        const postalCode = (r[col('direccion_codigo_postal')] || '').trim();
        const district = (r[col('direccion_distrito')] || '').trim();
        const utmX = parseFloat(r[col('direccion_coor_x')] || '');
        const utmY = parseFloat(r[col('direccion_coor_y')] || '');
        const coords = utm30NToWgs84(utmX, utmY);
        const rawPhone = (r[col('contacto_telefono')] || '').trim();
        const phone = rawPhone.toUpperCase() === 'RESERVADO' ? '' : rawPhone;
        const email = (r[col('contacto_correo')] || '').trim().split(';')[0]?.trim() || '';
        const entity = (r[col('entidad_denominacion')] || '').trim();
        const gest = (r[col('tipo_gestion')] || '').trim();

        const key = `CAM-${regId}`;
        lookupIndex.set(key, {
          registry_key: key,
          source_id: 'cam_centros',
          official_name: denom,
          phone,
          address,
          municipality,
          postal_code: postalCode,
          authorised_places: placesNum
        });

        const explicitSpecs = classifyExplicitSpecialisations({
          name: denom,
          subtype: subtipo || tipo,
          sector,
          entity
        });

        if (!isRelevantCamRow(sector, tipo, subtipo, denom, entity, explicitSpecs)) {
          continue;
        }

        // Intentar enlazar con el catálogo municipal de Madrid si está en Madrid capital y coincide dirección o teléfono+nombre
        let linkedMadrid: MadridParsedRow | null = null;
        if (municipality === 'Madrid') {
          const normAddr = `${normalizeAddressComparable(address)}|${postalCode}`;
          const addrCandidates = madridByAddr.get(normAddr) || [];
          const normCamName = normalizeStrict(denom);
          linkedMadrid =
            addrCandidates.find(m => normalizeStrict(m.name) === normCamName) ||
            addrCandidates.find(m => {
              const mTokens = normalizeStrict(m.name).split(' ').filter(w => w.length > 3);
              return mTokens.some(t => normCamName.includes(t));
            }) ||
            null;

          if (!linkedMadrid) {
            const pNorm = normalizePhoneComparable(phone);
            const phoneCandidates = pNorm ? madridByPhone.get(pNorm) || [] : [];
            linkedMadrid =
              phoneCandidates.find(m => {
                const mTokens = normalizeStrict(m.name).split(' ').filter(w => w.length > 3);
                return mTokens.some(t => normCamName.includes(t));
              }) || null;
          }

          if (linkedMadrid) {
            linkedMadrid.usedByCam = true;
          }
        }

        const finalCoords = coords || linkedMadrid?.coords || null;
        const supports = inferSupportsFromOfficialFields(tipo, subtipo, denom);
        const lifeStages = inferLifeStagesFromOfficialFields(sector, denom, tipo);
        const isMunicipalPublic = Boolean(
          linkedMadrid &&
            (normalizeStrict(linkedMadrid.name).includes('municipal') ||
              normalizeStrict(entity).includes('ayuntamiento'))
        );
        const netInfo = mapPublicPrivateStatus(gest, isMunicipalPublic);
        const provenance: AttributeProvenance[] = [
          {
            attribute_name: explicitSpecs.length > 0 ? 'specialisation' : 'sector',
            value: explicitSpecs.length > 0
              ? `${denom} · ${entity} (${sector})`
              : `${sector} · ${subtipo || tipo}`,
            source_dataset: `Registro de Centros de Atención Social CAM (${regId})`,
            source_url: OFFICIAL_DATASET_URLS.cam_centros,
            source_type: 'official_registry',
            retrieved_at: checkDate,
            extraction_method: 'structured',
            reviewer: 'Portal de Datos Abiertos Comunidad de Madrid (CSV oficial)',
            reviewer_role: 'data_steward',
            confidence: explicitSpecs.length > 0 ? 'explicit' : 'potential',
            quality: 'A'
          }
        ];

        if (linkedMadrid) {
          provenance.push({
            attribute_name: 'municipal_registry_link',
            value: `${linkedMadrid.name} (Accesibilidad código ${linkedMadrid.accCode || 'N/D'})`,
            source_dataset: `Catálogo de Centros de Atención Social (datos.madrid.es PK ${linkedMadrid.pk})`,
            source_url: linkedMadrid.contentUrl || OFFICIAL_DATASET_URLS.madrid_municipal,
            source_type: 'official_registry',
            retrieved_at: checkDate,
            extraction_method: 'structured',
            reviewer: 'Portal de Datos Abiertos Ayuntamiento de Madrid (CSV oficial)',
            reviewer_role: 'data_steward',
            confidence: 'potential',
            quality: 'A'
          });
        }

        const accFeatures = linkedMadrid ? mapAccessibilityFromCode(linkedMadrid.accCode) : [];
        const limitations: string[] = [];
        if (explicitSpecs.length === 0) {
          limitations.push(
            `El registro oficial declara sector "${sector}" y denominación "${denom}", sin mencionar literalmente una patología específica.`
          );
        }
        if (!finalCoords) {
          limitations.push('Centro sin coordenadas válidas en el registro oficial (GEO-001/002).');
        }
        if (accFeatures.length === 0) {
          limitations.push('El registro regional de centros no publica detalle de accesibilidad física.');
        }

        const relatedServices = [
          subtipo || tipo,
          ...supports.map(s =>
            s === 'day_care'
              ? 'atención diurna'
              : s === 'residential_care'
              ? 'residencia'
              : s === 'rehabilitation'
              ? 'rehabilitación'
              : s === 'occupational_therapy'
              ? 'terapia ocupacional'
              : s === 'employment_support'
              ? 'apoyo laboral'
              : s === 'psychological_support'
              ? 'apoyo psicosocial'
              : 'logopedia'
          )
        ].filter(Boolean);

        centres.push({
          centre_id: key,
          provider_id: `PROV-${normalizeStrict(r[col('entidad_nif')] || entity || regId).replace(/\s+/g, '-').slice(0, 28)}`,
          provider_name: entity || denom,
          official_name: denom,
          resource_domain: 'social',
          sector: sector || 'Atención Social',
          centre_type: tipo || 'Centro de Atención Social',
          subtype: subtipo || tipo || 'Centro autorizado',
          public_private_status: netInfo.status,
          management_type: gest || 'Autorizado en Registro CAM',
          address,
          postal_code: postalCode,
          municipality,
          district: district || linkedMadrid?.district || undefined,
          coordinates: finalCoords,
          has_valid_coordinates: Boolean(finalCoords),
          phone: phone || linkedMadrid?.phone || '',
          email: email || linkedMadrid?.email || '',
          website: linkedMadrid?.contentUrl || OFFICIAL_DATASET_URLS.cam_centros,
          explicit_specialisations: explicitSpecs,
          related_services: Array.from(new Set(relatedServices)),
          supports,
          services_offered: supports.map((sup, idx) => ({
            service_id: `SRV-${key}-${idx}`,
            centre_id: key,
            service_name: `${tipo || 'Servicio'} (${subtipo || sector})`,
            service_type: sup,
            target_populations: explicitSpecs,
            allowed_life_stages: lifeStages,
            access_routes: [netInfo.accessType],
            source_dataset: `Registro de Centros de Atención Social CAM (${regId})`,
            source_url: OFFICIAL_DATASET_URLS.cam_centros,
            checked_at: checkDate
          })),
          allowed_life_stages: lifeStages,
          access_route: {
            access_type: netInfo.accessType,
            competent_body:
              netInfo.accessType === 'dependency_pia'
                ? 'Consejería de Familia, Juventud y Asuntos Sociales (CAM) / Servicios Sociales'
                : 'Entidad titular autorizada (confirmación previa)',
            official_description: `Régimen registral oficial: ${gest || 'no especificado'}.`,
            source_url: OFFICIAL_DATASET_URLS.cam_centros,
            checked_at: checkDate,
            next_step_action: netInfo.nextStep,
            availability_known: false,
            waiting_list_known: false
          },
          availability: {
            status: 'contact_required',
            authorised_places: placesNum,
            vacancies_known: false,
            source_url: OFFICIAL_DATASET_URLS.cam_centros,
            checked_at: checkDate,
            stale: false
          },
          geographic_coverage: {
            type: 'community_wide',
            requires_residence: netInfo.status === 'red_publica' ? 'yes' : 'unknown',
            checked_at: checkDate
          },
          accessibility_features: accFeatures,
          provenance_records: provenance,
          last_checked: checkDate,
          limitations
        });
      }
    }
  }

  // 3. Incorporar centros de datos.madrid.es no vinculados a ningún registro CAM físico
  for (const m of madridRows) {
    if (m.usedByCam) continue;
    const explicitSpecs = classifyExplicitSpecialisations({
      name: m.name,
      subtype: m.tipoPath,
      sector: m.equipamiento
    });
    if (!isRelevantMadridRow(m.name, m.equipamiento, m.tipoPath, explicitSpecs)) continue;

    const key = `MAD-PK${m.pk}`;
    const supports = inferSupportsFromOfficialFields(m.tipoPath, m.equipamiento, m.name);
    const lifeStages = inferLifeStagesFromOfficialFields(m.equipamiento, m.name, m.tipoPath);
    const isPublic = normalizeStrict(m.name).includes('municipal');
    const netInfo = mapPublicPrivateStatus(isPublic ? 'PUBLICA' : 'PRIVADA CON PLAZAS CONCERTADAS', isPublic);

    centres.push({
      centre_id: key,
      provider_id: `PROV-MAD-${m.pk}`,
      provider_name: m.name,
      official_name: m.name,
      resource_domain: 'social',
      sector: m.equipamiento ? m.equipamiento.slice(0, 120) : 'Catálogo Atención Social Ayuntamiento de Madrid',
      centre_type: 'Centro de Atención Social (Madrid)',
      subtype: m.tipoPath.split('/').pop() || 'Centro registrado',
      public_private_status: netInfo.status,
      management_type: isPublic ? 'Público Municipal' : 'Entidad en Catálogo Oficial datos.madrid.es',
      address: m.address,
      postal_code: m.postalCode,
      municipality: 'Madrid',
      district: m.district || undefined,
      coordinates: m.coords,
      has_valid_coordinates: Boolean(m.coords),
      phone: m.phone,
      email: m.email,
      website: m.contentUrl || OFFICIAL_DATASET_URLS.madrid_municipal,
      explicit_specialisations: explicitSpecs,
      related_services: m.equipamiento ? [m.equipamiento.slice(0, 140)] : ['atención social'],
      supports,
      services_offered: supports.map((sup, idx) => ({
        service_id: `SRV-${key}-${idx}`,
        centre_id: key,
        service_name: m.name,
        service_type: sup,
        target_populations: explicitSpecs,
        allowed_life_stages: lifeStages,
        access_routes: [netInfo.accessType],
        source_dataset: `Catálogo de Centros de Atención Social (datos.madrid.es PK ${m.pk})`,
        source_url: OFFICIAL_DATASET_URLS.madrid_municipal,
        checked_at: checkDate
      })),
      allowed_life_stages: lifeStages,
      access_route: {
        access_type: netInfo.accessType,
        competent_body: isPublic ? 'Ayuntamiento de Madrid / Servicios Sociales' : 'Entidad titular / Servicios Sociales',
        official_description: 'Registro municipal de centros de atención social.',
        source_url: OFFICIAL_DATASET_URLS.madrid_municipal,
        checked_at: checkDate,
        next_step_action: netInfo.nextStep,
        availability_known: false,
        waiting_list_known: false
      },
      availability: {
        status: 'contact_required',
        authorised_places: null,
        vacancies_known: false,
        source_url: OFFICIAL_DATASET_URLS.madrid_municipal,
        checked_at: checkDate,
        stale: false
      },
      geographic_coverage: {
        type: 'municipality',
        requires_residence: 'unknown',
        checked_at: checkDate
      },
      accessibility_features: mapAccessibilityFromCode(m.accCode),
      provenance_records: [
        {
          attribute_name: explicitSpecs.length > 0 ? 'specialisation' : 'sector',
          value: `${m.name} · ${m.equipamiento || 'Catálogo datos.madrid.es'}`,
          source_dataset: `Catálogo de Centros de Atención Social (datos.madrid.es PK ${m.pk})`,
          source_url: m.contentUrl || OFFICIAL_DATASET_URLS.madrid_municipal,
          source_type: 'official_registry',
          retrieved_at: checkDate,
          extraction_method: 'structured',
          reviewer: 'Portal de Datos Abiertos Ayuntamiento de Madrid (CSV oficial)',
          reviewer_role: 'data_steward',
          confidence: explicitSpecs.length > 0 ? 'explicit' : 'potential',
          quality: 'A'
        }
      ],
      last_checked: checkDate,
      limitations: [
        'El catálogo municipal datos.madrid.es no publica número de plazas autorizadas.',
        ...(explicitSpecs.length === 0
          ? [`La ficha municipal no menciona literalmente patología concreta (${m.equipamiento || m.name}).`]
          : [])
      ]
    });
  }

  // 4. Parsear Comunidad de Madrid - Registro de Servicios (aporta recursos ambulatorios/especializados únicos Sxxxx)
  if (params.camServiciosCsvText) {
    const rows = parseSemicolonCSV(params.camServiciosCsvText);
    if (rows.length > 1) {
      const h = rows[0].map(c => c.trim().toLowerCase());
      const col = (name: string) => h.indexOf(name);

      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const regId = r[col('numero_registro')]?.trim();
        if (!regId) continue;

        const sector = (r[col('sector')] || '').trim();
        const tipo = (r[col('tipo')] || '').trim();
        const subtipo = (r[col('subtipo')] || '').trim();
        const denom = (r[col('denominacion')] || '').trim();
        const muniRaw = (r[col('municipio_nombre')] || '').trim();
        const municipality = mapCamMunicipalityName(muniRaw);
        const viaTipo = (r[col('direccion_via_tipo')] || '').trim();
        const viaName = (r[col('direccion_via_nombre')] || '').trim();
        const portal = (r[col('direccion_portal')] || '').trim();
        const addressRaw = [viaTipo, viaName, portal].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
        const address = addressRaw.toUpperCase().includes('RESERVADO')
          ? 'Dirección reservada en el registro público oficial'
          : addressRaw;
        const postalCode = (r[col('direccion_codigo_postal')] || '').trim();
        const district = (r[col('direccion_distrito')] || '').trim();
        const utmX = parseFloat(r[col('direccion_coor_x')] || '');
        const utmY = parseFloat(r[col('direccion_coor_y')] || '');
        const coords = utm30NToWgs84(utmX, utmY);
        const rawPhone = (r[col('contacto_telefono')] || '').trim();
        const phone = rawPhone.toUpperCase() === 'RESERVADO' ? '' : rawPhone;
        const email = (r[col('contacto_correo')] || '').trim().split(';')[0]?.trim() || '';
        const entity = (r[col('entidad_denominacion')] || '').trim();
        const gest = (r[col('tipo_gestion')] || '').trim();

        const key = `CAM-SRV-${regId}`;
        lookupIndex.set(key, {
          registry_key: key,
          source_id: 'cam_servicios',
          official_name: denom,
          phone,
          address,
          municipality,
          postal_code: postalCode,
          authorised_places: null
        });

        const explicitSpecs = classifyExplicitSpecialisations({
          name: denom,
          subtype: subtipo || tipo,
          sector,
          entity
        });

        const lowAll = normalizeStrict(`${denom} ${entity}`);
        const matchesTrackedEntity = Array.from(trackedEntities).some(t => lowAll.includes(t));

        // Incluir servicios con especialización literal declarada o de entidades clave monitorizadas
        if (explicitSpecs.length === 0 && !matchesTrackedEntity) continue;

        const supports = inferSupportsFromOfficialFields(tipo, subtipo, denom);
        const lifeStages = inferLifeStagesFromOfficialFields(sector, denom, tipo);
        const netInfo = mapPublicPrivateStatus(gest, false);

        centres.push({
          centre_id: key,
          provider_id: `PROV-${normalizeStrict(r[col('entidad_nif')] || entity || regId).replace(/\s+/g, '-').slice(0, 28)}`,
          provider_name: entity || denom,
          official_name: denom,
          resource_domain: 'social',
          sector: sector || 'Servicios Sociales CAM',
          centre_type: tipo || 'Servicio Especializado',
          subtype: subtipo || tipo || 'Servicio autorizado',
          public_private_status: netInfo.status,
          management_type: gest || 'Servicio autorizado en Registro CAM',
          address,
          postal_code: postalCode,
          municipality,
          district: district || undefined,
          coordinates: coords,
          has_valid_coordinates: Boolean(coords),
          phone,
          email,
          website: OFFICIAL_DATASET_URLS.cam_servicios,
          explicit_specialisations: explicitSpecs,
          related_services: [tipo, subtipo].filter(Boolean),
          supports,
          services_offered: supports.map((sup, idx) => ({
            service_id: `SRV-${key}-${idx}`,
            centre_id: key,
            service_name: denom,
            service_type: sup,
            target_populations: explicitSpecs,
            allowed_life_stages: lifeStages,
            access_routes: [netInfo.accessType],
            source_dataset: `Registro de Servicios de Atención Social CAM (${regId})`,
            source_url: OFFICIAL_DATASET_URLS.cam_servicios,
            checked_at: checkDate
          })),
          allowed_life_stages: lifeStages,
          access_route: {
            access_type: netInfo.accessType,
            competent_body:
              netInfo.accessType === 'dependency_pia'
                ? 'Consejería de Familia, Juventud y Asuntos Sociales (CAM)'
                : 'Entidad titular autorizada (confirmación previa)',
            official_description: `Servicio autorizado en registro regional (${gest || 'CAM'}).`,
            source_url: OFFICIAL_DATASET_URLS.cam_servicios,
            checked_at: checkDate,
            next_step_action: netInfo.nextStep,
            availability_known: false,
            waiting_list_known: false
          },
          availability: {
            status: 'contact_required',
            authorised_places: null,
            vacancies_known: false,
            source_url: OFFICIAL_DATASET_URLS.cam_servicios,
            checked_at: checkDate,
            stale: false
          },
          geographic_coverage: {
            type: 'community_wide',
            requires_residence: 'unknown',
            checked_at: checkDate
          },
          accessibility_features: [],
          provenance_records: [
            {
              attribute_name: explicitSpecs.length > 0 ? 'specialisation' : 'sector',
              value: `${denom} · ${entity} (${sector})`,
              source_dataset: `Registro de Servicios de Atención Social CAM (${regId})`,
              source_url: OFFICIAL_DATASET_URLS.cam_servicios,
              source_type: 'official_registry',
              retrieved_at: checkDate,
              extraction_method: 'structured',
              reviewer: 'Portal de Datos Abiertos Comunidad de Madrid (CSV oficial)',
              reviewer_role: 'data_steward',
              confidence: explicitSpecs.length > 0 ? 'explicit' : 'potential',
              quality: 'A'
            }
          ],
          last_checked: checkDate,
          limitations: [
            'El Registro de Servicios de la Comunidad de Madrid no publica número de plazas ni accesibilidad física.',
            ...(explicitSpecs.length === 0
              ? [`El servicio declara "${denom}" bajo sector "${sector}" sin mención literal de patología.`]
              : [])
          ]
        });
      }
    }
  }

  return { centres, lookupIndex };
}
