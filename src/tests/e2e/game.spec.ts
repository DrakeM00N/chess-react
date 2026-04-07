import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test('страница загружается', async ({ page }) => {
  await expect(page).toHaveTitle(/Chess/i);
});

test('есть кнопка новой игры', async ({ page }) => {
  await expect(page.getByText('Новая игра')).toBeVisible();
});

test('новая игра работает', async ({ page }) => {
  await page.getByText('Новая игра').click();
  await expect(page.getByText('Новая игра')).toBeVisible();
});