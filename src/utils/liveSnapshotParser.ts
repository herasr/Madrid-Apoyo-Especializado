/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Live Multi-Source CSV Snapshot Parser
 * Descarga e integra dinámicamente en tiempo real los 3 CSV oficiales descargados:
 *   - /data/snapshots/snapshot-latest.csv (Ayuntamiento de Madrid · Latin-1)
 *   - /data/snapshots/cam-centros-latest.csv (Comunidad de Madrid Centros · UTF-8)
 *   - /data/snapshots/cam-servicios-latest.csv (Comunidad de Madrid Servicios · UTF-8)
 * Sincroniza igualmente snapshot-metadata.json y snapshot-diffs.json calculados en ingesta.
 */

import { SpecializedCentre, SnapshotDifference } from '../types/specialized';
import {
  buildCentresFromOfficialCSVs,
  parseSemicolonCSV,
  SnapshotCentreRecord
} from './officialRegistryParser';
import {
  setSnapshotVerificationContext,
  SnapshotMetadataSummary,
  SnapshotSourceMeta
} from './specializedEngine';

export interface DynamicIngestionState {
  loaded: boolean;
  timestamp: string;
  previous_timestamp: string | null;
  sha256_hash: string;
  total_csv_records: number;
  active_centres_count: number;
  updated_centres_count: number;
  sources: SnapshotSourceMeta[];
  diffs: SnapshotDifference[];
  error: string | null;
}

export const parseCSVClient = parseSemicolonCSV;

export async function loadLiveSnapshotData(
  baseCentres: SpecializedCentre[]
): Promise<{
  centres: SpecializedCentre[];
  state: DynamicIngestionState;
  metadata: SnapshotMetadataSummary | null;
  lookupIndex: Map<string, SnapshotCentreRecord>;
}> {
  const state: DynamicIngestionState = {
    loaded: false,
    timestamp: new Date().toISOString(),
    previous_timestamp: null,
    sha256_hash: '',
    total_csv_records: 0,
    active_centres_count: baseCentres.length,
    updated_centres_count: 0,
    sources: [],
    diffs: [],
    error: null
  };

  let metaJson: SnapshotMetadataSummary | null = null;

  try {
    // 1. Obtener metadatos multi-fuente e historial real de diferencias
    const [metaRes, diffsRes] = await Promise.all([
      fetch('/data/snapshots/snapshot-metadata.json'),
      fetch('/data/snapshots/snapshot-diffs.json').catch(() => null)
    ]);

    if (metaRes.ok) {
      const rawMeta = await metaRes.json();
      metaJson = rawMeta;
      state.timestamp = rawMeta.timestamp || state.timestamp;
      state.previous_timestamp = rawMeta.previous_timestamp || null;
      state.sha256_hash = rawMeta.sha256_hash || '';
      state.total_csv_records = rawMeta.total_combined_records || rawMeta.extracted_records_count || 0;
      state.sources = Array.isArray(rawMeta.sources) ? rawMeta.sources : [];
    }

    if (diffsRes && diffsRes.ok) {
      const diffsJson = await diffsRes.json();
      if (Array.isArray(diffsJson?.diffs)) {
        state.diffs = diffsJson.diffs;
        state.updated_centres_count = diffsJson.diffs.length;
      }
    }

    // 2. Descargar en vivo los 3 ficheros CSV oficiales en sus codificaciones exactas
    const [madRes, camCentrosRes, camServiciosRes] = await Promise.all([
      fetch('/data/snapshots/snapshot-latest.csv'),
      fetch('/data/snapshots/cam-centros-latest.csv'),
      fetch('/data/snapshots/cam-servicios-latest.csv')
    ]);

    let madridCsvText: string | null = null;
    if (madRes.ok) {
      const buf = await madRes.arrayBuffer();
      madridCsvText = new TextDecoder('latin1').decode(buf);
    }

    let camCentrosCsvText: string | null = null;
    if (camCentrosRes.ok) {
      const buf = await camCentrosRes.arrayBuffer();
      camCentrosCsvText = new TextDecoder('utf-8').decode(buf);
    }

    let camServiciosCsvText: string | null = null;
    if (camServiciosRes.ok) {
      const buf = await camServiciosRes.arrayBuffer();
      camServiciosCsvText = new TextDecoder('utf-8').decode(buf);
    }

    if (!madridCsvText && !camCentrosCsvText && !camServiciosCsvText) {
      throw new Error('No se pudo cargar ninguno de los ficheros CSV oficiales desde /data/snapshots/.');
    }

    const { centres, lookupIndex } = buildCentresFromOfficialCSVs({
      madridCsvText,
      camCentrosCsvText,
      camServiciosCsvText,
      snapshotDate: state.timestamp.slice(0, 10)
    });

    if (centres.length === 0) {
      throw new Error('Los ficheros CSV cargados no devolvieron registros válidos.');
    }

    // 3. Registrar el contexto real para auditoría en specializedEngine.ts
    setSnapshotVerificationContext(metaJson, lookupIndex);

    state.loaded = true;
    state.active_centres_count = centres.length;
    if (state.total_csv_records === 0) {
      state.total_csv_records = lookupIndex.size;
    }

    return { centres, state, metadata: metaJson, lookupIndex };
  } catch (err: any) {
    console.warn('Error al cargar dinámicamente los snapshots CSV oficiales:', err);
    state.error = err?.message || 'Fallo de lectura de los archivos de captura oficial';
    return { centres: baseCentres, state, metadata: metaJson, lookupIndex: new Map() };
  }
}
