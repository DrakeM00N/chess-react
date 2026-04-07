import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-square="e2"]').waitFor({ timeout: 60000 });
});

test('можно выбрать фигуру', async ({ page }) => {
  const squares = page.locator('[data-square="e2"]');
  await squares.click();
  const dots = page.locator('[data-legal="true"]');
  await expect(dots.first()).toBeVisible();
});

test('можно сделать ход', async ({ page }) => {
  await page.locator('[data-square="e2"]').click();
  await page.locator('[data-square="e4"]').click();
  await expect(page.locator('.hist-move').first()).toHaveText('e4');
});

test('новая игра сбрасывает доску', async ({ page }) => {
  await page.locator('[data-square="e2"]').click();
  await page.locator('[data-square="e4"]').click();
  await page.getByText('Новая игра').click();
  await expect(page.locator('.hist-move')).toHaveCount(0);
});