# Madrid Apoyo Especializado v1.8 (DATAMAD 2026)

Buscador ciudadano basado en datos abiertos oficiales para localizar **recursos de atención social autorizados** en la Comunidad de Madrid y el Ayuntamiento de Madrid, con trazabilidad registro a registro y explicabilidad algorítmica.

## Requisitos e Instalación

### Requisitos previos
- Node.js >= 20.0.0
- npm >= 9.0.0

### Pasos de instalación

```bash
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

## Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en el puerto 3000.
- `npm run ingest`: Descarga los 3 CSV oficiales abiertos, verifica sus firmas SHA-256 byte a byte en disco, calcula diferencias reales (`snapshot-diffs.json`) y genera `catalog-classified.json`.
- `npm test`: Ejecuta la batería automatizada de pruebas de Vitest sobre el motor y el catálogo oficial real.
- `npm run lint`: Comprobación estricta de tipos TypeScript (`tsc --noEmit`).
- `npm run build`: Compila la aplicación web y el Service Worker PWA offline en `dist/`.
- `npm run preview`: Previsualiza la compilación de producción.

## Atribución de Datos Abiertos, Fechas y Licencias de Reutilización

Este proyecto reutiliza exclusivamente conjuntos de datos públicos oficiales publicados en los portales de datos abiertos del **Ayuntamiento de Madrid** y de la **Comunidad de Madrid** (última captura verificada: **2026-11-17**, actualización semanal automatizada los lunes mediante GitHub Actions):

| Conjunto de datos | Organismo fuente | Fecha de captura / formato | Licencia / Condiciones de reutilización |
| :--- | :--- | :--- | :--- |
| [Catálogo de Centros de Atención Social (`212774-0-atencion-social`)](https://datos.madrid.es/dataset/212774-0-atencion-social) | **Ayuntamiento de Madrid** (`datos.madrid.es`) | Snapshot vigente (`snapshot-latest.csv`, codificación `Latin-1`, 613 registros) | [Condiciones generales de reutilización del Ayuntamiento de Madrid](https://datos.madrid.es/egob/catalogo/aviso-legal) (reutilización libre con cita de la fuente y sin desnaturalizar la información) |
| [Registro General de Centros de Atención Social](https://datos.comunidad.madrid/dataset/atencion_social_registro_centros) | **Comunidad de Madrid** (`datos.comunidad.madrid`) | Snapshot vigente (`cam-centros-latest.csv`, codificación `UTF-8`, 2.633 registros) | [Licencia CC BY 4.0 / Condiciones de reutilización de la Comunidad de Madrid](https://datos.comunidad.madrid/condiciones-de-uso) |
| [Registro General de Servicios de Atención Social](https://datos.comunidad.madrid/dataset/atencion_social_registro_servicios) | **Comunidad de Madrid** (`datos.comunidad.madrid`) | Snapshot vigente (`cam-servicios-latest.csv`, codificación `UTF-8`, 2.254 registros) | [Licencia CC BY 4.0 / Condiciones de reutilización de la Comunidad de Madrid](https://datos.comunidad.madrid/condiciones-de-uso) |
| Cartografía base del visor | **OpenStreetMap contributors** | Teselas en línea en la pestaña Mapa | [Open Database License (ODbL)](https://www.openstreetmap.org/copyright) |

*(Los registros sanitarios de REGCESS no forman parte de la ingesta automática actual de atención social y quedan documentados para fases de interoperabilidad futura).*

## Principios de Diseño y Rigor Metodológico

1. **Trazabilidad Registral Verificable**: Cada centro auditado contrasta teléfono, dirección, plazas autorizadas y huella SHA-256 frente a `snapshot-metadata.json` y los CSV oficiales. Para evitar crecimiento innecesario del repositorio, solo se versionan los últimos ficheros `-latest.csv`, la firma `snapshot-metadata.json`, el informe de diferencias reales `snapshot-diffs.json` y el catálogo `catalog-classified.json` (cargado bajo demanda y cacheado en runtime por la PWA).
2. **Modelo de Evidencia (A1, A2 apoyo, A2 entidad titular, B1, B2, C)**: Ordenación lexicográfica estricta donde la evidencia explícita prevalece sobre la proximidad geográfica. Cero inferencias prohibitivas (discapacidad intelectual nunca infiere TEA; centro ocupacional nunca infiere terapia ocupacional clínica).
3. **Distancias y Tiempos Orientativos**: Las distancias se calculan mediante fórmula Haversine desde el origen elegido (GPS efímero, centroide municipal oficial o Madrid Centro por defecto) y el tiempo en transporte público mostrado es una estimación matemática orientativa en función de la distancia lineal, **no** una consulta en tiempo real a horarios CRTM/Metro/EMT.
4. **Privacidad Efímera (RGPD)**: Sin cuentas, sin telemetría de consultas ni almacenamiento de datos de salud o coordenadas en servidor; anonimización de titulares personas físicas en servicios y centros individuales sin NIF jurídico.

## Licencia del Código

Código fuente licenciado bajo **Apache License 2.0** (`SPDX-License-Identifier: Apache-2.0`). Los datos abiertos mantienen la titularidad y condiciones de reutilización de sus respectivas administraciones públicas citadas arriba.

