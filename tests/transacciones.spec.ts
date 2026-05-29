import { test, expect } from './fixtures';
import { login } from './fixtures';

test.describe('Transacciones', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/transacciones');
  });

  test('muestra la lista de transacciones', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Transacciones' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('row').nth(1)).toBeVisible();
  });

  test('filtra por estado Pendiente', async ({ page }) => {
    await page.getByRole('button', { name: /todos los estados/i }).click();
    await page.getByRole('button', { name: 'Pendiente' }).click();
    await expect(page.getByText('Completada')).not.toBeVisible();
    await expect(page.getByText('Rechazada')).not.toBeVisible();
  });

  test('filtra por tipo Débito', async ({ page }) => {
    await page.getByRole('button', { name: /todos los tipos/i }).click();
    await page.getByRole('button', { name: 'Débito' }).click();
    await expect(page.getByRole('cell', { name: 'Crédito' })).not.toBeVisible();
  });

  test('limpiar filtro al seleccionar "Todos los estados"', async ({ page }) => {
    await page.getByRole('button', { name: /todos los estados/i }).click();
    await page.getByRole('button', { name: 'Pendiente' }).click();
    await page.getByRole('button', { name: 'Pendiente' }).click();
    await page.getByRole('button', { name: /todos los estados/i }).click();
    // El filtro vuelve al estado neutral
    await expect(page.getByRole('button', { name: /todos los estados/i })).not.toHaveClass(/text-blue-700/);
  });

  test('abre modal de nueva transacción', async ({ page }) => {
    await page.getByRole('button', { name: /nueva transacción/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /nueva transacción/i })).toBeVisible();
  });

  test('crea una nueva transacción', async ({ page }) => {
    await page.getByRole('button', { name: /nueva transacción/i }).click();

    // Cuenta origen
    await page.getByLabel(/cuenta origen/i).click();
    await page.getByRole('button', { name: /ACC-001/i }).first().click();

    // Cuenta destino
    await page.getByLabel(/cuenta destino/i).click();
    await page.getByRole('button', { name: /ACC-002/i }).first().click();

    await page.getByLabel(/monto/i).fill('1000');
    await page.getByRole('button', { name: /crear transacción/i }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('muestra validaciones en formulario vacío', async ({ page }) => {
    await page.getByRole('button', { name: /nueva transacción/i }).click();
    await page.getByRole('button', { name: /crear transacción/i }).click();
    await expect(page.getByText(/seleccione la cuenta origen/i)).toBeVisible();
    await expect(page.getByText(/seleccione la cuenta destino/i)).toBeVisible();
  });

  test('navega al detalle de una transacción', async ({ page }) => {
    await page.getByRole('link', { name: /ver detalle/i }).first().click();
    await expect(page).toHaveURL(/\/transacciones\/.+/);
    await expect(page.getByText(/detalle de transacción/i)).toBeVisible();
  });

  test('aprueba una transacción pendiente', async ({ page }) => {
    // Busca la primera transacción pendiente
    await page.getByRole('button', { name: /todos los estados/i }).click();
    await page.getByRole('button', { name: 'Pendiente' }).click();
    await page.getByRole('link', { name: /ver detalle/i }).first().click();

    await page.getByRole('button', { name: /aprobar/i }).click();
    await page.getByRole('button', { name: /confirmar/i }).click();

    await expect(page.getByText('Completada')).toBeVisible();
  });

  test('rechaza una transacción pendiente', async ({ page }) => {
    await page.getByRole('button', { name: /todos los estados/i }).click();
    await page.getByRole('button', { name: 'Pendiente' }).click();
    await page.getByRole('link', { name: /ver detalle/i }).first().click();

    await page.getByRole('button', { name: /rechazar/i }).click();
    await page.getByRole('button', { name: /confirmar/i }).click();

    await expect(page.getByText('Rechazada')).toBeVisible();
  });
});
