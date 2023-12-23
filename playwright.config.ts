import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: ["**/*.ts"],
	projects: [
		/* Test against desktop browsers */
		{
		  name: 'chromium',
		  use: { ...devices['Desktop Chrome'] },
		},
		{
		  name: 'firefox',
		  use: { ...devices['Desktop Firefox'] },
		},
		{
		  name: 'webkit',
		  use: { ...devices['Desktop Safari'] },
		},
		/* Test against mobile viewports. */
		{
		  name: 'Mobile Chrome',
		  use: { ...devices['Pixel 5'] },
		},
		{
		  name: 'Mobile Safari',
		  use: { ...devices['iPhone 12'] },
		},
		/* Test against branded browsers. */
		{
		  name: 'Google Chrome',
		  use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // or 'chrome-beta'
		},
		{
		  name: 'Microsoft Edge',
		  use: { ...devices['Desktop Edge'], channel: 'msedge' }, // or 'msedge-dev'
		},
	],
};

export default config;
