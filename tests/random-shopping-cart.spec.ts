import { test, expect } from '@playwright/test'

test.describe('random shopping cart', () => {
  test.beforeEach('go to page', async ({ page }) => {
    await page.goto(
      'http://localhost:3000/practice/random-shopping-cart-v1.html',
    )
  })

  test('testing frontend logic', async ({ page }) => {
    const totalCostLocator = page.locator('#total-subtotal-price')
    const shippingCostLocator = page.locator('#shipping-cost')
    const taxCostLocator = page.locator('#tax-cost')
    const expectedTotalCost = '88'
    const expectedShippingCost = '8.80'
    const expectedTaxCost = '8.80'

    await page.route(
      '**/*/api/v1/data/random/ecommerce-shopping-cart-simple',
      async (route) => {
        await route.fulfill({ json: mockedApiResponse })
      },
    )
    await page.goto('/practice/random-shopping-cart-v1.html')
    await expect(totalCostLocator).toHaveText(expectedTotalCost)
    await expect(shippingCostLocator).toHaveText(expectedShippingCost)
    await expect(taxCostLocator).toHaveText(expectedTaxCost)
  })

  test('invalid product quantity and subtotal', async ({page}) => {
    const totalCostLocator = page.locator('#total-subtotal-price')
    const shippingCostLocator = page.locator('#shipping-cost')
    const taxCostLocator = page.locator('#tax-cost')
    const expectedTotalCost = '8'
    const expectedShippingCost = '0.80'
    const expectedTaxCost = '0.80'

    await page.route(
      '**/*/api/v1/data/random/ecommerce-shopping-cart-simple',
      async (route) => {
        await route.fulfill({ json: mockedApiResponseZeroQuantityAndSubtotal })
      },
    )
    await page.goto('/practice/random-shopping-cart-v1.html')
    await expect(totalCostLocator).toHaveText(expectedTotalCost)
    await expect(shippingCostLocator).toHaveText(expectedShippingCost)
    await expect(taxCostLocator).toHaveText(expectedTaxCost)
  })
  test('missing product data', async ({page}) => {
    const totalCostLocator = page.locator('#total-subtotal-price')
    const shippingCostLocator = page.locator('#shipping-cost')
    const taxCostLocator = page.locator('#tax-cost')
    const expectedTotalCost = '8'
    const expectedShippingCost = '0.80'
    const expectedTaxCost = '0.80'

    await page.route(
      '**/*/api/v1/data/random/ecommerce-shopping-cart-simple',
      async (route) => {
        await route.fulfill({ json: mockedApiResponseMissingProductData })
      },
    )
    await page.goto('/practice/random-shopping-cart-v1.html')
    await expect(totalCostLocator).toHaveText(expectedTotalCost)
    await expect(shippingCostLocator).toHaveText(expectedShippingCost)
    await expect(taxCostLocator).toHaveText(expectedTaxCost)
  })
})

const mockedApiResponse = {
  cartItems: [
    {
      product: {
        id: 11,
        name: 'Backpack',
        price: 80,
        icon: '🎒',
      },
      quantity: 1,
      subtotal: 80,
    },
    {
      product: {
        id: 4,
        name: 'Grapes',
        price: 4,
        icon: '🍇',
      },
      quantity: 2,
      subtotal: 8,
    },
  ],
}
const mockedApiResponseZeroQuantityAndSubtotal = {
  cartItems: [
    {
      product: {
        id: 11,
        name: 'Backpack',
        price: 80,
        icon: '🎒',
      },
      quantity: 0,
      subtotal: 0,
    },
    {
      product: {
        id: 4,
        name: 'Grapes',
        price: 4,
        icon: '🍇',
      },
      quantity: 2,
      subtotal: 8,
    },
  ],
}
const mockedApiResponseMissingProductData = {
  cartItems: [
    {
      product: {
          },
      quantity: 1,
      subtotal: 80,
    },
    {
      product: {
        id: 4,
        name: 'Grapes',
        price: 4,
        icon: '🍇',
      },
      quantity: 2,
      subtotal: 8,
    },
  ],
}