import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir:    './tests',
  fullyParallel: false,
  retries:    0,
  workers:    1,
  reporter:   'html',

  use: {
    baseURL:       'http://localhost:3000',
    trace:         'on-first-retry',
    screenshot:    'only-on-failure',
    video:         'retain-on-failure',
    locale:        'es-PE',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'bun run dev',
    url:     'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
