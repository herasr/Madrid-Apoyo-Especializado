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

## Fuentes Oficiales Ingeridas

1. **Ayuntamiento de Madrid (`datos.madrid.es`)**: Catálogo de Centros de Atención Social (codificación Latin-1).
2. **Comunidad de Madrid (`datos.comunidad.madrid`)**: Registro General de Centros de Atención Social (UTF-8).
3. **Comunidad de Madrid (`datos.comunidad.madrid`)**: Registro General de Servicios de Atención Social (UTF-8).

*(Los registros sanitarios de REGCESS no forman parte de la ingesta automática actual de atención social y quedan documentados para fases de interoperabilidad futura).*

## Principios de Diseño

1. **Trazabilidad Registral Verificable**: Cada centro auditado contrasta teléfono, dirección, plazas autorizadas y huella SHA-256 frente a `snapshot-metadata.json` y los CSV oficiales.
2. **Modelo de Evidencia (A1, A2 apoyo, A2 entidad titular, B1, B2, C)**: Ordenación lexicográfica estricta donde la evidencia explícita prevalece sobre la proximidad geográfica.
3. **Privacidad Efímera (RGPD)**: Sin cuentas, sin telemetría de consultas ni almacenamiento de datos de salud o coordenadas en servidor; anonimización de titulares personas físicas en servicios individuales.
4. **Reproducibilidad y PWA Offline**: Filtros codificados en URL y catálogo pre-clasificado cacheado mediante Workbox.

## Licencia

Licencia Apache 2.0. Código abierto y transparente.

