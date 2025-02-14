import { test, expect } from '@playwright/test'

test.describe('replace request', () => {
  test('modify whole request data', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const commentID = page.locator('#comment')

    const expectedCity = 'Hong Kong'
    await page.goto('/practice/random-weather-v2.html')

    await page.route('/api/v1/data/random/weather-simple', async (route) => {
      await route.continue({
        postData: { city: expectedCity, futuredays: '3', days: 1 },
      })
    })
    await getWeatherButton.click()

    await expect(commentID).toContainText(expectedCity)
  })
  test('modify part of request data', async ({ page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const commentID = page.locator('#comment')

    const expectedCity = 'Hong Kong'
    await page.goto('/practice/random-weather-v2.html')

    await page.route(
      '/api/v1/data/random/weather-simple',
      async (route, request) => {
        console.log(request.postData())
        const body = JSON.parse(request.postData() || '{}')
        console.log(body)
        body.city = expectedCity
        console.log('after modification', body)
        await route.continue({
          postData: body,
        })
      },
    )
    await getWeatherButton.click()

    await expect(commentID).toContainText(expectedCity)
  })
})
