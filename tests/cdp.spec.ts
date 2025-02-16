import { test, expect } from '@playwright/test'

test.describe('CDP communication', () => {
  test('emulate network throttle', async ({ context, page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    await page.goto('/practice/random-weather-v2.html')
    // simulate slow connection; create object, which allows us to communicate with browser
    const cdpSession = await context.newCDPSession(page)
    // send - allows us to send some informations to browser
    await cdpSession.send('Network.emulateNetworkConditions', {
      // slow 3g
      downloadThroughput: ((500 * 1000) / 8) * 0.8,
      latency: 400 * 5,
      offline: false,
      uploadThroughput: ((500 * 1000) / 8) * 0.8,
    })
    await page.waitForLoadState('domcontentloaded')
    await getWeatherButton.click()

    await expect(tableOfWeather).toBeVisible()
  })
  // turn off scripts on the page
  test('script execution disabled', async ({ context, page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    await page.goto('/practice/random-weather-v2.html')

    const cdpSession = await context.newCDPSession(page)
    // send - allows us to send some informations to browser
    await cdpSession.send('Emulation.setScriptExecutionDisabled', {
      value: true,
    })
    await page.waitForLoadState('domcontentloaded')
    await getWeatherButton.click()

    await expect(tableOfWeather).not.toBeVisible()
    // that test works slower, because we reused browser that we used in previous test - with emulation slower connection; we have to remember about it and delete those settings or change them; easiest way is to close browser window and play test again.
  })
  // test mobile view
  test('mobile view', async ({ context, page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    await page.goto('/practice/random-weather-v2.html')

    const cdpSession = await context.newCDPSession(page)
    await cdpSession.send('Emulation.setDeviceMetricsOverride', {
      deviceScaleFactor: 1,
      mobile: true,
      height: 800,
      width: 400,
    })
    await page.waitForLoadState('domcontentloaded')
    await getWeatherButton.click()

    await expect(tableOfWeather).toBeVisible()
  })
  // get metrics with performance API
  test('performance metrics', async ({ context, page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    await page.goto('/practice/random-weather-v2.html')

    const cdpSession = await context.newCDPSession(page)
    await cdpSession.send('Performance.enable')

    await page.waitForLoadState('domcontentloaded')
    await getWeatherButton.click()

    await expect(tableOfWeather).toBeVisible()
    const metrics = await cdpSession.send('Performance.getMetrics')
    console.log(metrics)
  })
  // dark mode?
  test('dark mode', async ({ context, page }) => {
    const getWeatherButton = page.locator('#get-weather')
    const tableOfWeather = page.locator('#results-table')
    await page.goto('/practice/random-weather-v2.html')

    const cdpSession = await context.newCDPSession(page)
    await cdpSession.send('Emulation.setAutoDarkModeOverride', {
      enabled: true,
    })

    await page.waitForLoadState('domcontentloaded')
    await getWeatherButton.click()

    await expect(tableOfWeather).toBeVisible()
  })
})
