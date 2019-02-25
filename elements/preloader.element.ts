import { BehElement } from "./element";
import { Page } from "puppeteer";

export class PreloaderElement extends BehElement {
    protected locators = {
        el: (context: string) => `${context}//beh-loading-overlay//*[contains(@class, "wrapper")]`,
    };

    constructor(
        _page: Page,
        context: string = '',
    ) {
        super(_page, context);
    }

    async waitForReady() {
        await this.waitForXPath(this.locators.el(this.context));
        await this.waitForXPath(this.locators.el(this.context), { hidden: true });
    }
}