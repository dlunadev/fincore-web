import { test, expect } from './fixtures';
import { login } from './fixtures';

test.describe('Cuentas', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/cuentas');
  });

  test('muestra la lista de cuentas', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Cuentas' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    // Al menos una fila de datos
    await expect(page.getByRole('row').nth(1)).toBeVisible();
  });

  test('busca cuentas por titular', async ({ page }) => {
    await page.getByPlaceholder(/buscar/i).fill('Empresa');
    await expect(page.getByText('Empresa Logística SA')).toBeVisible();
  });

  test('busca sin resultados muestra mensaje vacío', async ({ page }) => {
    await page.getByPlaceholder(/buscar/i).fill('xxxxxx_inexistente');
    await expect(page.getByText(/no se encontraron cuentas/i)).toBeVisible();
  });

  test('abre modal de nueva cuenta', async ({ page }) => {
    await page.getByRole('button', { name: /nueva cuenta/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /nueva cuenta/i })).toBeVisible();
  });

  test('cierra modal al presionar Escape', async ({ page }) => {
    await page.getByRole('button', { name: /nueva cuenta/i }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('crea una nueva cuenta', async ({ page }) => {
    const accountNumber = `TEST-${Date.now()}`;

    await page.getByRole('button', { name: /nueva cuenta/i }).click();
    await page.getByLabel(/número de cuenta/i).fill(accountNumber);
    await page.getByLabel(/titular/i).fill('Titular de Prueba');
    await page.getByLabel(/saldo inicial/i).fill('5000');
    await page.getByRole('button', { name: /crear cuenta/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Titular de Prueba')).toBeVisible();
  });

  test('muestra validaciones en formulario vacío', async ({ page }) => {
    await page.getByRole('button', { name: /nueva cuenta/i }).click();
    await page.getByRole('button', { name: /crear cuenta/i }).click();
    await expect(page.getByText(/número de cuenta es requerido/i)).toBeVisible();
    await expect(page.getByText(/titular es requerido/i)).toBeVisible();
  });

  test('navega a editar cuenta', async ({ page }) => {
    await page.getByRole('link', { name: /editar/i }).first().click();
    await expect(page).toHaveURL(/\/cuentas\/.+/);
    await expect(page.getByRole('heading', { name: /editar cuenta/i })).toBeVisible();
  });
});
