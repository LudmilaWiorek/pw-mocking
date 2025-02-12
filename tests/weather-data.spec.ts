import { test, expect } from '@playwright/test'

test.describe('test of weather for city', () => {
  test.beforeEach('go to page', async ({ page }) => {
    await page.goto('/practice/random-weather-v2.html')
  })
  test('generate table of weather', async ({ page }) => {
    const buttonGetWeather = page.locator('#get-weather')
    const weatherTable = page.locator('#results-table')

    await buttonGetWeather.click()
    await expect(weatherTable).toBeVisible()
  })
  test('mean temperature logic', async ({ page }) => {
    const buttonGetWeather = page.locator('#get-weather')
    const temp0 = page.locator('#temperature-0')
    const temp1 = page.locator('#temperature-1')
    const temp2 = page.locator('#temperature-2')
    const tempMean = page.locator('#meanTemperature')

    await page.route('/api/v1/data/random/weather-simple', async (route) => {
      await route.fulfill({ json: mockedWeatherApiResponse })
    })
    await buttonGetWeather.click()
    const expectedMeanTemperature = '20.00'
    await expect(tempMean).toHaveText(expectedMeanTemperature)
  })
  test('mean temperature logic with one day from past', async ({ page }) => {
    const buttonGetWeather = page.locator('#get-weather')
    const tempMean = page.locator('#meanTemperature')
    const getOneMoreDayButton = page.locator('#get-weather-past-day')

    await page.route('/api/v1/data/random/weather-simple', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: mockedWeatherApiResponse })
      } else await route.fulfill({ json: mockedWeatherApiOneDayResponse })
    })
    await buttonGetWeather.click()
    const expectedMeanTemperature = '20.00'
    const expectedMeanTemperatureWithOneDayFromPast = '23.00'
    await expect(tempMean).toHaveText(expectedMeanTemperature)

    await getOneMoreDayButton.click()

    await expect(tempMean).toHaveText(expectedMeanTemperatureWithOneDayFromPast)
  })
})

const mockedWeatherApiResponse = [
  {
    date: '2025-02-12',
    city: 'Warsaw',
    temperature: 30,
    temperatureMin: 1,
    temperatureMax: 52,
    humidity: '78%',
    dayLength: 17,
    windSpeed: 29,
    windSpeedRange: '25-30 km/h',
  },
  {
    date: '2025-02-11',
    city: 'Warsaw',
    temperature: 25,
    temperatureMin: 0,
    temperatureMax: 51,
    humidity: '70%',
    dayLength: 16,
    windSpeed: 5,
    windSpeedRange: '0-5 km/h',
  },
  {
    date: '2025-02-10',
    city: 'Warsaw',
    temperature: 5,
    temperatureMin: 1,
    temperatureMax: 17,
    humidity: '44%',
    dayLength: 15,
    windSpeed: 4,
    windSpeedRange: '0-5 km/h',
  },
]

const mockedWeatherApiOneDayResponse = [
  {
    date: '2025-02-09',
    city: 'Warsaw',
    temperature: 32,
    temperatureMin: 8,
    temperatureMax: 54,
    humidity: '81%',
    dayLength: 18,
    windSpeed: 3,
    windSpeedRange: '0-5 km/h',
  },
]
