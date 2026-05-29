import { test, expect } from '@playwright/test';
import { login } from './fixtures';

test.describe('Autenticación', () => {
  test('redirige a /login si no está autenticado', async ({ page }) => {
    await page.goto('/cuentas');
    await expect(page).toHaveURL(/\/login/);
  });

  test('muestra error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('malo@test.com');
    await page.getByLabel(/contraseña/i).fill('wrongpass');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    await expect(page.getByText(/usuario o contraseña inválido/i)).toBeVisible();
  });

  test('login exitoso navega a /cuentas', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/cuentas/);
    await expect(page.getByRole('heading', { name: 'Cuentas' })).toBeVisible();
  });

  test('cerrar sesión redirige a /login', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: /cerrar sesión/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('no puede acceder al portal tras cerrar sesión', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: /cerrar sesión/i }).click();
    await page.goto('/cuentas');
    await expect(page).toHaveURL(/\/login/);
  });
});
