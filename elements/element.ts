import { Page, WaitForSelectorOptions, ElementHandle, ClickOptions } from "puppeteer";

export interface IBehElementAnimations {[key: string]: number}
export interface IBehElementLocators {[key: string]: (...args: any[]) => string}

export interface IBehElement {
    animations: IBehElementAnimations;
    locators: IBehElementLocators;
}

export class BehElement {
    protected animations: IBehElementAnimations = {};
    protected locators: IBehElementLocators = {};

    constructor(
        protected _page: Page,
        protected context: string = '',
        protected options?: any
    ) {}

    protected async waitFor(delay: number) {
        this._page.waitFor(delay);
    }

    protected async clickOnBody() {
        await this.click('body');
    }

    protected async waitForElement() {
        const locator = this.locators.el(this.context);
        let el:ElementHandle<Element> = null;
        try {
            el = await this.waitForXPath(locator);
        } catch (e) {
            console.log(`The element ${locator} could not be located`);
            throw e;
        }

        return el;
    }

    protected async click(locator: string) {
        try {
            this._page.click(locator);
        } catch (e) {
            console.log(`The element ${locator} could not be clicked`);
            throw e;
        }
    }

    protected async waitForXPath(locator: string, options?: WaitForSelectorOptions) {
        let el:ElementHandle<Element> = null;
        try {
            el = await this._page.waitForXPath(locator, options);
        } catch (e) {
            console.log(`The element ${locator} could not be located with provided options: `, options);
            throw e;
        }

        return el;
    }

    protected async clickByXPath(locator: string, options?: ClickOptions) {
        let el:ElementHandle<Element> = await this.waitForXPath(locator);
        try {
            await el.click(options);
        } catch (e) {
            console.log(`The element ${locator} could not be clicked with provided options: `, options);
            throw e;
        }

        return el;
    }

    static async byContext(contextPage: Page = page, contextLocator: string, options: any): Promise<any> {
        const el = new this(contextPage, contextLocator, options);
        await el.waitForElement();

        return Promise.resolve(el);
    }
}