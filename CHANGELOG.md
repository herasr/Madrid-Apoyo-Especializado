# Changelog

Todos los cambios relevantes de **Madrid Apoyo Especializado** se documentan en este fichero siguiendo [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [Semantic Versioning](https://semver.org/lang/es/).

## [1.8.0] - 2026-11-18

### Añadido
- **Integridad atómica de ingesta y regeneración real de diferencias (`snapshot-diffs.json`)**:
  - `verifyBaselineIntegrity` en `scripts/ingest.ts` valida el hash SHA-256 de la línea base en disco contra `snapshot-metadata.json` antes de sobrescribir y detiene el proceso con error explícito ante incoherencias (con recuperación opcional desde Git HEAD).
  - Escritura atómica temporal + `renameSync` (`writeFileAtomicSync`) para `-latest.csv`, `snapshot-diffs.json`, `snapshot-metadata.json` y `catalog-classified.json`.
  - Script `scripts/recompute-diffs.ts` para recomputar diferencias históricas verificando los 8 cambios reales entre el `2026-11-15` y el `2026-11-17` (7 cambios de accesibilidad `3 → 1` en Centros Base 1, 2, 3, 5, 6, 7, 8 y CRECOVI, más 1 actualización de coordenadas del Centro Base N.º 3).
- **Resiliencia UI, rendimiento y endurecimiento de seguridad**:
  - `ErrorBoundary` global y `<React.StrictMode>` en `src/main.tsx`, junto con `<noscript>` informativo en `index.html`.
  - Validación estricta en tiempo de ejecución de `localStorage` para búsquedas guardadas (`src/utils/savedSearchesStorage.ts`).
  - Meta etiqueta `Content-Security-Policy` restrictiva inyectada en compilación de producción (`vite.config.ts`).
  - Optimización de respuesta al tecleo/filtrado mediante `useDeferredValue(query)` y eliminación de subconjuntos de fuentes `latin-ext` sin uso en idioma español.
- **Calidad, CI/CD y Documentación Open Source**:
  - Configuración `vitest.config.ts` con umbrales mínimos de cobertura (`@vitest/coverage-v8`) y suite E2E con Playwright (`playwright.config.ts`, `e2e/smoke.spec.ts`).
  - Fijación por SHA completo de todas las GitHub Actions, activación declarativa `enablement: true` en GitHub Pages, alerta automática mediante *Issue* ante fallos de ingesta semanal y configuración de `.github/dependabot.yml`.
  - Documentación técnica y académica: `docs/ARCHITECTURE.md`, `docs/METHODOLOGY.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CITATION.cff` y `CHANGELOG.md`.

### Cambiado
- **Reglas negativas sin exclusión silenciosa**: Las reglas negativas limitan el nivel máximo de evidencia (`B2` o `C`) sin ocultar centros compatibles ni expulsarlos a incompatibles; texto específico `NEG-006` para TEA diferenciado de especialización neurológica.
- **Accesibilidad literal y edad no informada**: Filtrado estricto por código numérico (`1` accesible, `2` parcial, `4` lengua de signos, `5` señalización podotáctil, `6` bucle magnético, excluyendo `3` sin información) y marcación honesta `Edad: no consta, confirmar` sin excluir de búsquedas de menores.
- **Subnivel `A2_entity` y pre-clasificación PWA**: Distinción explícita entre especialización declarada en sede vs. por entidad titular, junto con catálogo `catalog-classified.json` cacheado offline y compatibilidad de rutas mediante `import.meta.env.BASE_URL`.
- **Reorganización de `package.json`**: Separación estricta de `devDependencies` de compilación/tipos, eliminación de dependencias sin uso (`motion`, `autoprefixer`) y sincronización completa de `package-lock.json`.
