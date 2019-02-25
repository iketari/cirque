import { BehElement } from "./element";
import { Page } from "puppeteer";

export class BehTopMenuElement extends BehElement {
    protected locators = {
        el: (context: string) => `${context}//beh-nav-panel`,
        topItemByTitle: (title: string) => `//beh-nav-panel//beh-nav-tab[.//*[contains(text(), "${title}")]]`,
        toolsDropDown: () => `//beh-nav-panel//beh-nav-tab[.//*[contains(text(), "Tools")]]//ul[contains(@class, "dropdown-menu")]`,
        toolsItemByTitle: (title: string) => `//beh-nav-panel//beh-nav-tab//li[.//*[contains(text(), "${title}")]]//a`
    };

    constructor(
        _page: Page,
        context: string = '',
    ) {
        super(_page, context);
    }

    async toggleTools() {
        await this.waitForElement();
        await this.clickByXPath(this.locators.topItemByTitle('Tools'));
        await this.waitForXPath(this.locators.toolsDropDown());
        await this._page.waitFor(500); // a dropdown animation
    }

    async goToCases() {
        await this.waitForElement();
        await this.clickByXPath(this.locators.topItemByTitle('Cases'));
    }

    async goToReleases() {
        // open Releases
        await this.clickByXPath(this.locators.toolsItemByTitle('Releases'));
    }

    async goToWorspace() {
        await this.clickByXPath(this.locators.toolsItemByTitle('Workspace'));
    }

    async goToTasks() {
        await this.clickByXPath(this.locators.toolsItemByTitle('Tasks'));
    }
}