import { test, expect } from '@playwright/test'

test.describe('weather codes', () => {
  test.beforeEach('go to page weather', async ({ page }) => {
    await page.goto('/practice/random-weather-v2.html')
  })
  test('mock responses for weather with 404', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    const errorMessageLocator = page.getByTestId('error-message')

    await page.route('/api/v1/data/random/weather-simple', async (route) => {
      await route.fulfill({ status: 404, body: 'not Found!!' })
    })
    await getWeatherButton.click()
    await expect.soft(tableOfWeather).toBeHidden()
    await expect.soft(errorMessageLocator).toBeVisible()
  })
  test('mock responses for Warsaw in Response', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    const errorMessageLocator = page.getByTestId('error-message')
    const city = page.locator('#city')

    await page.route('/api/v1/data/random/weather-simple', async (route) => {
      if (route.request().postData()?.includes('Warsaw')) {
        await route.fulfill({ status: 404, body: 'not Found!!' })
      } else {
        await route.continue()
      }
    })
    await getWeatherButton.click()
    await expect.soft(tableOfWeather).toBeHidden()
    await expect.soft(errorMessageLocator).toBeVisible()

    await city.selectOption({ value: 'Berlin' })
    await getWeatherButton.click()
    await expect.soft(tableOfWeather).toBeVisible()
    await expect.soft(errorMessageLocator).toBeHidden()
  })
  test('mock responses for response code 200', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    const errorMessageLocator = page.getByTestId('error-message')
    const city = page.locator('#city')

    await page.route('/api/v1/data/random/weather-simple', async (route) => {
      const response = await route.fetch()
      if (response.status() === 200) {
        await route.fulfill({ status: 404, body: 'not Found!!' })
      } else {
        await route.continue()
      }
    })
    await getWeatherButton.click()

    await expect.soft(tableOfWeather).toBeHidden()
    await expect.soft(errorMessageLocator).toBeVisible()

    await city.selectOption({ value: 'Berlin' })
    await getWeatherButton.click()

    await expect.soft(tableOfWeather).toBeHidden()
    await expect.soft(errorMessageLocator).toBeVisible()
  })
})
