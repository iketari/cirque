import { Page, WaitForSelectorOptions, ElementHandle } from "puppeteer";

export class BehdateTimePickcer {
    private locators = {
        el: (context: string) => `${context}//beh-date-time-picker`,
        button: (context: string, text: string) => `${context}//beh-date-time-picker//button[contains(text(), "${text}") or .//*[contains(text(), "${text}")]]`
    };

    constructor(
        private _page: Page,
        private context: string = ''
    ) {}

    async clickOnButtonByText(text: string) {
        const el = await this.waitForXPath(this.locators.button(this.context, text));
        await el.click();
    }

    async clickOnBody() {
        await this.click('body');
    }

    private async waitForElement() {
        return await this.waitForXPath(this.locators.el(this.context));
    }

    private async waitForButtonByText(text: string) {
        return await this.waitForXPath(this.locators.el(this.context));
    }


    private async click(locator: string) {
        try {
            this._page.click(locator);
        } catch (e) {
            console.log(`The element ${locator} could not be clicked`);
            throw e;
        }
    }

    private async waitForXPath(locator: string, options?: WaitForSelectorOptions) {
        let el:ElementHandle<Element> = null;
        try {
            el = await this._page.waitForXPath(locator, options);
        } catch (e) {
            console.log(`The element ${locator} could not be located with provided options: `, options);
            throw e;
        }

        return el;
    }

    static async byContext(contextPage: Page = page, contextLocator: string, multi: boolean = false, externalMenu: boolean = false): Promise<BehdateTimePickcer> {
        const element = new BehdateTimePickcer(contextPage, contextLocator);
        await element.waitForElement();

        return Promise.resolve(element);
    }
}