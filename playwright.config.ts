import { defineConfig, devices } from '@playwright/test';

const PORT = 3210;

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Production server on a throwaway PGlite database.
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    stdout: process.env.E2E_LOGS ? 'pipe' : 'ignore',
    stderr: 'pipe',
    timeout: 120_000,
    env: {
      PGLITE_DIR: '.data/e2e',
      BETTER_AUTH_SECRET: 'e2e-secret-e2e-secret-e2e-secret-32',
      BETTER_AUTH_URL: `http://localhost:${PORT}`,
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
    },
  },
});
