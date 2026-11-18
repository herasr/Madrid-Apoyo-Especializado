import fs from 'node:fs';
import { test, expect } from '@playwright/test';

test.describe('Madrid Apoyo Especializado — Smoke E2E', () => {
  test('flujo ciudadano: carga completa, filtro TEA, modal explicable y exportación CSV segura', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('./');

    // Verificar carga del catálogo oficial completo (>1000 recursos)
    await expect(page.getByText(/Resultados de la búsqueda/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/\d+\s+recursos/i)).toBeVisible();

    // Seleccionar perfil TEA
    const autismButton = page.getByRole('button', { name: /Trastorno del espectro del autismo/i });
    await expect(autismButton).toBeVisible();
    await autismButton.click();

    await expect(page.getByText(/Especialización Publicada/i)).toBeVisible();

    // Abrir modal "¿Por qué aparece?" en el primer resultado
    const whyBtn = page.getByRole('button', { name: /¿Por qué aparece\?/i }).first();
    await whyBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Nivel de evidencia asignado/i)).toBeVisible();

    // Cerrar modal con el botón accesible
    await dialog.getByRole('button', { name: /Cerrar modal/i }).click();
    await expect(dialog).toBeHidden();

    // Exportar CSV y validar estructura real y descarga
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Exportar resultados en formato CSV/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^madrid_apoyo_especializado_resultados_.*\.csv$/);

    const downloadedPath = await download.path();
    expect(downloadedPath).toBeTruthy();
    const csvContent = fs.readFileSync(downloadedPath!, 'utf-8');
    expect(csvContent).toContain('ID Centro');
    expect(csvContent).toContain('URLs Oficiales');
    expect(csvContent.split('\n').length).toBeGreaterThan(2);

    expect(errors).toEqual([]);
  });

  test('responsive móvil (390x844): sin desbordamiento horizontal y filtros plegados', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./');

    await expect(page.getByText(/Resultados de la búsqueda/i)).toBeVisible({ timeout: 15000 });
    const configureBtn = page.getByRole('button', { name: /Configurar filtros/i });
    await expect(configureBtn).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });
});
