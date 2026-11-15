/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado - Script de Ingesta Real de Datos Registrales
 * Descarga las fuentes oficiales de datos abiertos:
 *   1. Ayuntamiento de Madrid (datos.madrid.es) - Catálogo de Centros de Atención Social (Latin-1)
 *   2. Comunidad de Madrid (datos.comunidad.madrid) - Registro General de Centros de Atención Social (UTF-8)
 *   3. Comunidad de Madrid (datos.comunidad.madrid) - Registro General de Servicios de Atención Social (UTF-8)
 * Valida integridad (HTTP 200, ausencia de páginas HTML 404, cabeceras y filas mínimas),
 * verifica firma SHA-256 byte a byte sobre el fichero guardado en disco y calcula diferencias reales.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface OfficialSourceSpec {
  source_id: 'madrid_municipal' | 'cam_centros' | 'cam_servicios';
  source_name: string;
  source_url: string;
  latest_file: string;
  encoding: 'latin1' | 'utf-8';
  required_headers: string[];
  min_rows: number;
}

export const OFFICIAL_SOURCES: OfficialSourceSpec[] = [
  {
    source_id: 'madrid_municipal',
    source_name: 'Catálogo de Centros de Atención Social (Ayuntamiento de Madrid - datos.madrid.es)',
    source_url: 'https://datos.madrid.es/dataset/212774-0-atencion-social/resource/212774-0-atencion-social-csv/download/212774-0-atencion-social-csv.csv',
    latest_file: 'snapshot-latest.csv',
    encoding: 'latin1',
    required_headers: ['PK', 'NOMBRE', 'ACCESIBILIDAD'],
    min_rows: 100
  },
  {
    source_id: 'cam_centros',
    source_name: 'Registro de Centros de Atención Social (Comunidad de Madrid - datos.comunidad.madrid)',
    source_url: 'https://datos.comunidad.madrid/dataset/b8cdb7f7-3185-4938-800a-fefda72333f5/resource/0d815439-396e-4975-983e-5bb421f617a0/download/atencion_social_registro_centros.csv',
    latest_file: 'cam-centros-latest.csv',
    encoding: 'utf-8',
    required_headers: ['numero_registro', 'sector', 'denominacion', 'plazas_autorizadas_numero'],
    min_rows: 100
  },
  {
    source_id: 'cam_servicios',
    source_name: 'Registro de Servicios de Atención Social (Comunidad de Madrid - datos.comunidad.madrid)',
    source_url: 'https://datos.comunidad.madrid/dataset/95c75a5f-40ea-4af7-8b62-860918224c02/resource/1feb4b85-58da-4178-9391-f8821629ed7e/download/atencion_social_registro_servicios.csv',
    latest_file: 'cam-servicios-latest.csv',
    encoding: 'utf-8',
    required_headers: ['numero_registro', 'sector', 'tipo', 'denominacion'],
    min_rows: 100
  }
];

export interface SourceIngestionRecord {
  source_id: 'madrid_municipal' | 'cam_centros' | 'cam_servicios';
  source_name: string;
  source_url: string;
  file: string;
  encoding: 'latin1' | 'utf-8';
  sha256_hash: string;
  file_size_bytes: number;
  extracted_records_count: number;
  status: 'SUCCESS' | 'FAILED';
}

export interface IngestionMetadata {
  ingestion_id: string;
  timestamp: string;
  previous_timestamp?: string | null;
  source_url: string;
  sha256_hash: string;
  file_size_bytes: number;
  extracted_records_count: number;
  total_combined_records: number;
  status: 'SUCCESS' | 'FAILED';
  verification_notes: string;
  sources: SourceIngestionRecord[];
}

export interface RealSnapshotDiff {
  change_id: string;
  change_type:
    | 'centre_added'
    | 'centre_removed'
    | 'centre_renamed'
    | 'service_added'
    | 'service_removed'
    | 'access_route_changed';
  centre_id: string;
  centre_name: string;
  previous_snapshot: string;
  current_snapshot: string;
  detail: string;
  reason: string;
  category: 'alta' | 'baja' | 'servicio' | 'acceso';
}

export function parseCSV(text: string): string[][] {
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

interface NormalizedRowSummary {
  id: string;
  name: string;
  phone: string;
  address: string;
  places: string;
  accessibility: string;
}

function summarizeSourceRows(sourceId: OfficialSourceSpec['source_id'], rows: string[][]): Map<string, NormalizedRowSummary> {
  const map = new Map<string, NormalizedRowSummary>();
  if (rows.length < 2) return map;
  const h = rows[0].map(col => col.trim().toLowerCase());
  const idx = (name: string) => h.indexOf(name.toLowerCase());

  if (sourceId === 'madrid_municipal') {
    const pkI = idx('pk');
    const nameI = idx('nombre');
    const phoneI = idx('telefono');
    const viaClaseI = idx('clase-vial');
    const viaNameI = idx('nombre-via');
    const numI = idx('num');
    const accI = idx('accesibilidad');

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const pk = r[pkI]?.trim();
      if (!pk) continue;
      const addr = [r[viaClaseI], r[viaNameI], r[numI]].filter(Boolean).join(' ').trim();
      map.set(`MAD-PK${pk}`, {
        id: `MAD-PK${pk}`,
        name: r[nameI] || `PK ${pk}`,
        phone: (r[phoneI] || '').trim(),
        address: addr,
        places: '',
        accessibility: (r[accI] || '').trim()
      });
    }
  } else {
    const idI = idx('numero_registro');
    const nameI = idx('denominacion');
    const phoneI = idx('contacto_telefono');
    const viaTipoI = idx('direccion_via_tipo');
    const viaNameI = idx('direccion_via_nombre');
    const portalI = idx('direccion_portal');
    const plazasI = idx('plazas_autorizadas_numero');
    const prefix = sourceId === 'cam_centros' ? 'CAM-' : 'CAM-SRV-';

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const regId = r[idI]?.trim();
      if (!regId) continue;
      const addr = [r[viaTipoI], r[viaNameI], r[portalI]].filter(Boolean).join(' ').trim();
      map.set(`${prefix}${regId}`, {
        id: `${prefix}${regId}`,
        name: r[nameI] || regId,
        phone: (r[phoneI] || '').trim(),
        address: addr,
        places: plazasI >= 0 ? (r[plazasI] || '').trim() : '',
        accessibility: ''
      });
    }
  }
  return map;
}

function computeDiffs(
  sourceId: OfficialSourceSpec['source_id'],
  prevRows: string[][] | null,
  currRows: string[][],
  prevDate: string,
  currDate: string
): RealSnapshotDiff[] {
  if (!prevRows || prevRows.length < 2) return [];
  const prevMap = summarizeSourceRows(sourceId, prevRows);
  const currMap = summarizeSourceRows(sourceId, currRows);
  const diffs: RealSnapshotDiff[] = [];
  let seq = 1;

  const sourceTag = sourceId === 'madrid_municipal'
    ? 'datos.madrid.es'
    : sourceId === 'cam_centros'
    ? 'CAM Centros'
    : 'CAM Servicios';

  for (const [id, curr] of currMap.entries()) {
    const prev = prevMap.get(id);
    if (!prev) {
      diffs.push({
        change_id: `DIFF-${sourceId.toUpperCase()}-ADD-${seq++}`,
        change_type: 'centre_added',
        centre_id: id,
        centre_name: curr.name,
        previous_snapshot: prevDate,
        current_snapshot: currDate,
        detail: `Alta detectada en la descarga oficial (${sourceTag}): ${curr.address || 'dirección registrada'}.`,
        reason: `Comparativa automática SHA-256 sobre ${sourceTag}.`,
        category: 'alta'
      });
    } else {
      const changes: string[] = [];
      if (prev.name !== curr.name) changes.push(`Denominación: "${prev.name}" -> "${curr.name}"`);
      if (prev.phone !== curr.phone) changes.push(`Teléfono: "${prev.phone || 'N/D'}" -> "${curr.phone || 'N/D'}"`);
      if (prev.address !== curr.address) changes.push(`Dirección: "${prev.address}" -> "${curr.address}"`);
      if (prev.places !== curr.places) changes.push(`Plazas autorizadas: "${prev.places || 'N/D'}" -> "${curr.places || 'N/D'}"`);
      if (prev.accessibility !== curr.accessibility) changes.push(`Accesibilidad código: "${prev.accessibility}" -> "${curr.accessibility}"`);

      if (changes.length > 0) {
        diffs.push({
          change_id: `DIFF-${sourceId.toUpperCase()}-UPD-${seq++}`,
          change_type: prev.name !== curr.name ? 'centre_renamed' : 'service_added',
          centre_id: id,
          centre_name: curr.name,
          previous_snapshot: prevDate,
          current_snapshot: currDate,
          detail: `Cambio registral real (${sourceTag}): ${changes.join(' · ')}.`,
          reason: `Comparación directa fila a fila entre descargas oficiales de ${sourceTag}.`,
          category: 'servicio'
        });
      }
    }
  }

  for (const [id, prev] of prevMap.entries()) {
    if (!currMap.has(id)) {
      diffs.push({
        change_id: `DIFF-${sourceId.toUpperCase()}-DEL-${seq++}`,
        change_type: 'centre_removed',
        centre_id: id,
        centre_name: prev.name,
        previous_snapshot: prevDate,
        current_snapshot: currDate,
        detail: `El registro ${id} ya no figura en la descarga actual de ${sourceTag}.`,
        reason: `Comparativa automática SHA-256 sobre ${sourceTag}.`,
        category: 'baja'
      });
    }
  }

  return diffs;
}

function assertValidCsvPayload(spec: OfficialSourceSpec, buffer: Buffer): string[][] {
  if (buffer.length < 1024) {
    throw new Error(`[${spec.source_id}] Tamaño anómalo (${buffer.length} bytes).`);
  }

  const headSample = buffer.subarray(0, 512).toString('utf8').toLowerCase();
  if (
    headSample.includes('<!doctype html') ||
    headSample.includes('<html') ||
    headSample.includes('var _paq') ||
    headSample.includes('<head>')
  ) {
    throw new Error(`[${spec.source_id}] El portal devolvió una página HTML en lugar de un CSV válido.`);
  }

  const decoded = new TextDecoder(spec.encoding).decode(buffer);
  const rows = parseCSV(decoded);
  if (rows.length < spec.min_rows + 1) {
    throw new Error(`[${spec.source_id}] Solo se parsearon ${Math.max(0, rows.length - 1)} filas (mínimo requerido: ${spec.min_rows}).`);
  }

  const headerSet = new Set(rows[0].map(h => h.trim().toLowerCase()));
  for (const req of spec.required_headers) {
    if (!headerSet.has(req.toLowerCase())) {
      throw new Error(`[${spec.source_id}] Falta la columna obligatoria "${req}" en la cabecera CSV.`);
    }
  }

  return rows;
}

export async function runIngestionProcess() {
  console.log('=== INICIANDO PROCESO DE INGESTA REGISTRAL MULTI-FUENTE ===');

  const snapshotsDir = path.resolve(process.cwd(), 'public/data/snapshots');
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const dateStr = timestamp.slice(0, 10);
  const metadataPath = path.join(snapshotsDir, 'snapshot-metadata.json');

  let prevTimestamp: string | null = null;
  if (fs.existsSync(metadataPath)) {
    try {
      const prevMeta = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      if (prevMeta?.timestamp) prevTimestamp = prevMeta.timestamp;
    } catch {
      prevTimestamp = null;
    }
  }

  const downloaded: {
    spec: OfficialSourceSpec;
    buffer: Buffer;
    sha256: string;
    rows: string[][];
    prevRows: string[][] | null;
  }[] = [];

  // Fase 1: Descargar y validar TODAS las fuentes antes de modificar archivos existentes en disco
  for (const spec of OFFICIAL_SOURCES) {
    console.log(`Descargando [${spec.source_id}]: ${spec.source_url}`);
    const response = await fetch(spec.source_url, {
      headers: {
        'User-Agent': 'MadridApoyoEspecializadoBot/1.7 (DataMad 2026 Audit; +https://datos.madrid.es)'
      }
    });

    if (!response.ok) {
      throw new Error(`[${spec.source_id}] Respuesta HTTP ${response.status} al descargar ${spec.source_url}. Ingesta abortada sin sobreescribir snapshots.`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const rows = assertValidCsvPayload(spec, buffer);
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

    const latestPath = path.join(snapshotsDir, spec.latest_file);
    let prevRows: string[][] | null = null;
    if (fs.existsSync(latestPath)) {
      const prevBuf = fs.readFileSync(latestPath);
      prevRows = parseCSV(new TextDecoder(spec.encoding).decode(prevBuf));
    }

    console.log(
      `✓ [${spec.source_id}] ${rows.length - 1} registros válidos (${buffer.length} bytes, SHA-256: ${sha256.slice(0, 12)}...)`
    );

    downloaded.push({ spec, buffer, sha256, rows, prevRows });
  }

  // Fase 2: Guardar buffers crudos exactos sin re-codificación y comprobar hash en disco
  const allDiffs: RealSnapshotDiff[] = [];
  const prevDateLabel = prevTimestamp ? prevTimestamp.slice(0, 10) : dateStr;

  for (const item of downloaded) {
    const latestPath = path.join(snapshotsDir, item.spec.latest_file);
    fs.writeFileSync(latestPath, item.buffer);

    if (item.spec.source_id === 'madrid_municipal') {
      fs.writeFileSync(path.join(snapshotsDir, `snapshot-${dateStr}.csv`), item.buffer);
    }

    // Verificación estricta de que el SHA-256 del archivo en disco coincide byte a byte
    const diskHash = crypto.createHash('sha256').update(fs.readFileSync(latestPath)).digest('hex');
    if (diskHash !== item.sha256) {
      throw new Error(`Fallo de integridad SHA-256 en disco para ${item.spec.latest_file}: esperado ${item.sha256}, obtenido ${diskHash}`);
    }

    const sourceDiffs = computeDiffs(item.spec.source_id, item.prevRows, item.rows, prevDateLabel, dateStr);
    allDiffs.push(...sourceDiffs);
  }

  // Fase 3: Guardar diferencias reales en snapshot-diffs.json
  const diffsPayload = {
    generated_at: timestamp,
    previous_snapshot: prevDateLabel,
    current_snapshot: dateStr,
    total_changes: allDiffs.length,
    diffs: allDiffs
  };
  fs.writeFileSync(path.join(snapshotsDir, 'snapshot-diffs.json'), JSON.stringify(diffsPayload, null, 2), 'utf-8');

  // Fase 4: Guardar metadatos de auditoría multi-fuente
  const primary = downloaded.find(d => d.spec.source_id === 'madrid_municipal')!;
  const sourcesMeta: SourceIngestionRecord[] = downloaded.map(d => ({
    source_id: d.spec.source_id,
    source_name: d.spec.source_name,
    source_url: d.spec.source_url,
    file: d.spec.latest_file,
    encoding: d.spec.encoding,
    sha256_hash: d.sha256,
    file_size_bytes: d.buffer.length,
    extracted_records_count: d.rows.length - 1,
    status: 'SUCCESS'
  }));

  const totalCombined = sourcesMeta.reduce((acc, s) => acc + s.extracted_records_count, 0);

  const metadata: IngestionMetadata = {
    ingestion_id: `ING_${Date.now()}`,
    timestamp,
    previous_timestamp: prevTimestamp,
    source_url: primary.spec.source_url,
    sha256_hash: primary.sha256,
    file_size_bytes: primary.buffer.length,
    extracted_records_count: primary.rows.length - 1,
    total_combined_records: totalCombined,
    status: 'SUCCESS',
    verification_notes: 'Descarga directa e íntegra (sin re-codificación) de 3 registros oficiales abiertos: Ayuntamiento de Madrid y Comunidad de Madrid (Centros y Servicios). Firma SHA-256 verificada byte a byte en disco.',
    sources: sourcesMeta
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log('=== INGESTA REAL FINALIZADA CON ÉXITO ===');
  console.log(`Total registros oficiales verificados (3 CSVs): ${totalCombined}`);
  console.log(`Diferencias detectadas frente al snapshot anterior: ${allDiffs.length}`);
  return metadata;
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]).endsWith('ingest.ts');
if (isDirectExecution) {
  runIngestionProcess().catch(err => {
    console.error('ERROR CRÍTICO DE INGESTA (proceso detenido sin corromper datos):', err?.message || err);
    process.exit(1);
  });
}
