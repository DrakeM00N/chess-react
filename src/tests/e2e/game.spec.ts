import { test, expect } from '@playwright/test';

test.describe('Chess vs AI — E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('страница загружается', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Chess vs AI');
  });

  test('доска отображается с 32 фигурами', async ({ page }) => {
    const pieces = page.locator('img');
    await expect(pieces).toHaveCount(32);
  });

  test('можно выбрать фигуру', async ({ page }) => {
    // Кликаем на пешку e2 (белая пешка)
    const squares = page.locator('[data-square="e2"]');
    await squares.click();
    // После клика должны появиться подсказки легальных ходов
    const dots = page.locator('[data-legal="true"]');
    await expect(dots.first()).toBeVisible();
  });

  test('можно сделать ход', async ({ page }) => {
    await page.locator('[data-square="e2"]').click();
    await page.locator('[data-square="e4"]').click();
    // История ходов обновилась
    await expect(page.locator('.hist-move').first()).toHaveText('e4');
  });

  test('новая игра сбрасывает доску', async ({ page }) => {
    await page.locator('[data-square="e2"]').click();
    await page.locator('[data-square="e4"]').click();
    await page.getByText('Новая игра').click();
    await expect(page.locator('.hist-move')).toHaveCount(0);
  });

  test('можно сменить сложность', async ({ page }) => {
    await page.getByText('Сложный').click();
    await expect(page.getByText('Сложный')).toHaveClass(/active/);
  });

  test('статус показывает ваш ход', async ({ page }) => {
    await expect(page.locator('#turn-label, .turn-label')).toContainText('ход');
  });
});