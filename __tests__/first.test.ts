import * as puppeteer from 'puppeteer';

describe('Google', () => {
    let browser: puppeteer.Browser,
        page: puppeteer.Page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        page = await browser.newPage();
        await page.goto('https://google.com');
    })

    it('should display "google" text on page', async () => {
        await expect(page).toMatch('google');
    })

    afterAll(async () => {
        await page.close();
        await browser.close();
    })
});