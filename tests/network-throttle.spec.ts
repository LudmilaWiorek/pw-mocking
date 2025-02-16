import { test, expect } from '@playwright/test'

test.describe('test slow down response from API (network throttle)', () => {
  test('slow down response with route', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    await page.goto('/practice/random-weather-v2.html')
    await page.route('/api/**', async (route) => {
      await page.waitForTimeout(3000)
      await route.continue()
    })
    await getWeatherButton.click()

    await expect(tableOfWeather).toBeVisible()
  })
})
// we check if our tests are resilient for slower working applications and for slower network connection

// slowing down with page.route() adheres only to responses API
