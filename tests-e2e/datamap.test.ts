import { test, expect } from '@playwright/test';


test('has a map with controls', async ({ page }) => {
  await page.goto('/');

  // TODO: wait for map load condition/selector
  // await page.waitForTimeout(3000);
  // to be a canvas element
  expect(page.locator('.map').first(), 'has map container').toBeDefined();
  // await page.getByLabel('Map')

  await expect(page.getByLabel('Map'), 'has map').toBeVisible();
  await expect(page.getByLabel('Map'), 'map is maplibre canvas').toHaveClass('maplibregl-canvas');
  await expect(page.getByLabel('Legend'), 'has map legend').toBeVisible();
  await expect(page.getByLabel('Variable Selector'), 'has map variable selector').toBeVisible();
  await expect(page.getByLabel('Data Controls'), 'has map data control').toBeVisible();
  // expect(page.getByLabel('Time Selector'), 'has datetime controls').toBeVisible();

  // expect(page.locator('body')).toHaveText(/Hello world x1!/);

  // await page.locator('#incbtn').click();

  // expect(page.locator('body')).toHaveText(/Hello world x2!/);
});
