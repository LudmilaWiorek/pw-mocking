import { test, expect } from '@playwright/test'

test.describe('abort request', () => {
   test('abort all weather data requests', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    await page.goto('/practice/random-weather-v2.html')
    await page.route('/api/v1/data/random/weather-simple', async (route) => {
      await route.abort()
    })

    await getWeatherButton.click()

    await expect(tableOfWeather).not.toBeVisible()
  })
  test('abort all weather images', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')

    await page.route(/(\.png)/, async (route) => {
      await route.abort()
    })
    await page.goto('/practice/random-weather-v2.html')
    await getWeatherButton.click()

    await expect(tableOfWeather).toBeVisible()
  })
  test('abort all css', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')

    await page.route(/(\.css)/, async (route) => {
      await route.abort()
    })
    await page.goto('/practice/random-weather-v2.html')
    await getWeatherButton.click()

    await expect(tableOfWeather).toBeVisible()
  })
})

// abort requests is useful when you want to limit data get from frontend, limit transfer with another services; we can verify if links we put, are opening in separate tabs and in the same time we don't want web site to be loaded in those another tabs.