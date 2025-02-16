import { test, expect } from '@playwright/test'

test.describe('Testing elements in Shadow DOM', () => {
  test('interact with regular elements', async ({ page }) => {
    const inputField = page.locator('#name-input')
    const buttonLocator = page.locator('#submit')
    const resultsLocator = page.locator('#results')
    const inputText = 'John Doe'

    await page.goto('/practice/shadow-dom-0.html')

    await inputField.fill(inputText)
    await buttonLocator.click()
    await expect(resultsLocator).toHaveText(`Hello, ${inputText}!`)
  })
  // shadow dom is for playwright like normal dom :D

  test('interact with shadow dom elements', async ({ page }) => {
    const inputField = page.locator('#shadow-name-input')
    const buttonLocator = page.locator('#shadow-submit')
    const resultsLocator = page.locator('#shadow-results')
    const inputText = 'John Doe'

    await page.goto('/practice/shadow-dom-0.html')
    await inputField.fill(inputText)
    await buttonLocator.click()
    await expect(resultsLocator).toHaveText(`Hello, ${inputText}!`)
  })

  test('interact with nested shadow dom elements', async ({ page }) => {
    const inputField = page.locator('#nested-shadow-name-input')
    const buttonLocator = page.locator('#nested-shadow-submit')
    const resultsLocator = page.locator('#nested-shadow-results')
    const inputText = 'John Doe'

    await page.goto('/practice/shadow-dom-0.html')
    await inputField.fill(inputText)
    await buttonLocator.click()
    await expect(resultsLocator).toHaveText(`Hello, ${inputText}!`)
  })

  test.fail('interact with closed shadow dom elements', async ({ page }) => {
    const inputField = page.locator('#closed-shadow-name-input')
    const buttonLocator = page.locator('#closed-shadow-submit')
    const resultsLocator = page.locator('#closed-shadow-results')
    const inputText = 'John Doe'

    await page.goto('/practice/shadow-dom-0.html')
    await inputField.fill(inputText, { timeout: 5000 })
    await buttonLocator.click()
    await expect(resultsLocator).toHaveText(`Hello, ${inputText}!`)
  })
})
// playwright can't interact with elements in closed shadow dom
