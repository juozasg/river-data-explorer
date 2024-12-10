import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/St. Joseph River Basin Data/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  expect(page.locator('body')).toHaveText(/Hello world x1!/);

  await page.locator('#incbtn').click();

  expect(page.locator('body')).toHaveText(/Hello world x2!/);
});
