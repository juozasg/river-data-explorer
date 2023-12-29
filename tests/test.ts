import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
	await expect(page.getByText('A sees counter count: 0 A+')).toBeVisible();

	await page.getByRole('button', { name: 'A+' }).click();
	await expect(page.getByText('A sees counter count: 1')).toBeVisible();
	await expect(page.getByText('B sees counter count: 1')).toBeVisible();
});
