import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 1000 * (process.env.CI ? 60 : 30),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['./tests/custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }], ['list']] : 'html',
  use: {
    actionTimeout: 0,
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3001',
    trace: 'retain-on-failure',
    headless: process.env.CI ? true : false
  },
  webServer: {
    command: `pnpm run --filter @axonivy/variable-editor-standalone ${process.env.CI ? 'serve' : 'dev'}`,
    url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3001',
    reuseExistingServer: !process.env.CI
  },
  projects: [
    { name: 'integration-chrome', use: { ...devices['Desktop Chrome'] }, testDir: './tests/integration' },
    { name: 'integration-firefox', use: { ...devices['Desktop Firefox'] }, testDir: './tests/integration' },
    { name: 'integration-webkit', use: { ...devices['Desktop Safari'] }, testDir: './tests/integration' },
    { name: 'screenshots', use: { ...devices['Desktop Chrome'] }, testDir: './tests/screenshots', retries: 0 }
  ]
});
