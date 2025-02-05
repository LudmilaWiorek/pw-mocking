import { test, expect } from '@playwright/test'

test.describe('test user data', () => {
  test('check username visibility', async ({ page }) => {
    const userNameTestId = 'user-full-name'
    const userNameSelector = page.getByTestId(userNameTestId)

    await page.route(
      '/api/v1/data/random/simple-user', // kazemy Pw nasluchiwac adres: moze pojawic sie response z backendu, gdzie pojawi się taki response z backendu, wykonaj mi na nim pewne operacje; od tego momentu pw bedzie wyczekiwal i nasluchiwal operacji wykonywanych na stronach; BARDZO WAZNE zebysmy umieścili ten page.route przed akcjami ktore chcemy wykonywac na stronie, i które mogą spowodowac wywolanie odpowiednich requestów, które chcemy w jakis spsob przechwycic i zmodyfikowac
      async (route) => {
        const response = await route.fetch()
        const json = await response.json()
        console.log(json) // przejmujemy response z  backendu i chcemy przekazac go dalej; nie chcemy go modyfikowac tylko podgladamy, co przechodzi
        await route.fulfill({ json: json }) // metoda fulfill przejmuje obiekt json, do ktorego przypijsujemy obiekt json ktory sobie wczesniej zczytaliśmy; nasluchujemy adres, kiedy pojawi sie odpowiedz wykonujemy funkcję
      },
    )

    await page.goto('/practice/random-simple-user-v1.html')

    await expect(userNameSelector).toBeVisible()

    const userName = await userNameSelector.innerText()
    console.warn(userName)
  })
  test('Check username', async ({ page }) => {
    const userNameTestId = 'user-full-name'
    const userNameSelector = page.getByTestId(userNameTestId)
    const expectedUserName = 'John Doe'
    await page.route('/api/v1/data/random/simple-user', async (route) => {
      const response = await route.fetch()
      const json = await response.json()

      console.log(json)
      await route.fulfill({ json: mockedUserData })
    })

    await page.goto('/practice/random-simple-user-v1.html')

    await expect(userNameSelector).toHaveText(expectedUserName)
  })
  test('Missing birthdate', async ({ page }) => {
    const birthdateTestId = 'user-date-of-birth'
    const birthdateSelector = page.getByTestId(birthdateTestId)
    const expectedBirthdate = '[No Data]'
    await page.route('/api/v1/data/random/simple-user', async (route) => {
      const response = await route.fetch()
      const json = await response.json()

      console.log(json)
      json.dateOfBirth = undefined
      await route.fulfill({ json: json })
    })

    // page goto rozpoczyna komunikację z backendem
    await page.goto('/practice/random-simple-user-v1.html')

    await expect(birthdateSelector).toHaveText(expectedBirthdate)
  })
  test('birthdate over 100 years ago', async ({ page }) => {
    const ageTestId = 'user-age'
    const ageSelector = page.getByTestId(ageTestId)
    const expectedAge = '105' // blad na frontendzie ! nieprawidlowe obliczanie wieku.
    const birthDate = '1920-03-21T23:00:00.000Z'
    await page.route('/api/v1/data/random/simple-user', async (route) => {
      const response = await route.fetch()
      const json = await response.json()

      console.log(json)
      json.dateOfBirth = birthDate
      await route.fulfill({ json: json })
    })

    // page goto rozpoczyna komunikację z backendem
    await page.goto('/practice/random-simple-user-v1.html')

    await expect(ageSelector).toHaveText(expectedAge)
  })
})

const mockedUserData = {
  userId: 'U5063',
  username: 'gonzalojohansson182',
  firstName: 'John',
  lastName: 'Doe',
  email: 'gonzalojohansson182@test2.test.com',
  phone: '+845-999-778-5025',
  dateOfBirth: '1979-03-21T23:00:00.000Z',
  profilePicture: '1bd4391b-e7a0-49ed-8fb8-38fc73f76fa3.jpg',
  address: {
    street: '111 Pine Street',
    city: 'Gateway City',
    postalCode: 68164,
    country: 'Germany',
  },
  lastLogin: '2022-12-18T23:00:00.000Z',
  accountCreated: '2019-09-12T22:00:00.000Z',
  status: 3,
}
