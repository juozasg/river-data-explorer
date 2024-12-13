import { test, expect } from '@playwright/test';


test('has a map with controls', async ({ page }) => {
  await page.goto('/');

  // TODO: wait for map load condition/selector
  await page.waitForTimeout(2000);
   // to be a canvas element
  expect(page.getByLabel('Map'), 'has map').toBeVisible();
  expect(page.getByLabel('Legend'), 'has map legend').toBeVisible();
  expect(page.getByLabel('Variable Selector'), 'has map variable selector').toBeVisible();
  expect(page.getByLabel('Data Controls'), 'has map data control').toBeVisible();
  expect(page.getByLabel('Time Selector'), 'has datetime controls').toBeVisible();

  // expect(page.locator('body')).toHaveText(/Hello world x1!/);

  // await page.locator('#incbtn').click();

  // expect(page.locator('body')).toHaveText(/Hello world x2!/);
});
