import { test, expect } from '@playwright/test'

test('deve ter exibir o slogan na homepage', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  await expect(page).toHaveTitle(/Lunar Pass/)
})