
import { title } from "process"
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Clicking draw button displays choices of bots', async() => {
    const draw = await driver.findElement(By.id('choices'))
    const displayDraw = await draw.isDisplayed()
    expect(displayDraw).toBe(true)
})

test('Clicking Add to Duo displays the bots user has added', async() => {
    const duoAdd = await driver.findElement(By.id('player-duo'))
    const duoDisplayed = await duoAdd.isDisplayed()
    expect(duoDisplayed).toBe(true)
})