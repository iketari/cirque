import { BehElement } from "./element";
import { Page } from "puppeteer";

export class NotificationsElement extends BehElement {
    protected locators = {
        el: (context: string) => `${context}//beh-notification`,
        closeBtn: (context: string) => `${context}//beh-notification//*[contains(@class, "close")]`
    };

    constructor(
        _page: Page,
        context: string = '',
    ) {
        super(_page, context);
    }

    async close() {
        await this.clickByXPath(this.locators.closeBtn(this.context));
    }
}