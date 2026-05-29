import { test as base, expect, type Page } from '@playwright/test';

export const CREDENTIALS = {
  email:    'admin@fincore.com',
  password: 'Admin123!',
};

export async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(CREDENTIALS.email);
  await page.getByLabel(/contraseña/i).fill(CREDENTIALS.password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await expect(page).toHaveURL(/\/cuentas/);
}

// Pre-authenticated test fixture
export const test = base.extend<{ authenticated: void }>({
  authenticated: [async ({ page }, use) => {
    await login(page);
    await use();
  }, { auto: false }],
});

export { expect };
