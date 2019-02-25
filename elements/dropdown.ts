import { Page, WaitForSelectorOptions, ElementHandle } from "puppeteer";
import { BehElement } from "./element";

export interface IBehDropdownElementOptions {
    multi: boolean;
    externalMenu: boolean;
}

export class BehDropdownElement extends BehElement {
    protected animations: {[key: string]: number} = {
        toggleMenu: 150
    };

    protected locators = {
        el: (context: string) => `${context}//beh-select`,
        dropdownMenu: (context: string) => `${context}//beh-select//*[contains(@class, "dropdown-menu")]`,
        externalMenu: () => `//bs-dropdown-container//beh-menu-list`,
        menuItem: (context: string, order: number) => `${context}//beh-select//beh-menu-item[${order}]`,
        menuItemByText: (context: string, text: string) => `${context}//beh-select//beh-menu-item[./*[contains(text(), "${text}")]]`,
        menuItemByClassName: (context: string, className: string) => `${context}//beh-select//beh-menu-list//*[contains(@class, "${className}")]`,
        externalMenuItem: (order: number) => `//bs-dropdown-container//beh-menu-list//beh-menu-item[${order}]`,
        externalMenuItemByText: (text: string) => `//bs-dropdown-container//beh-menu-list//beh-menu-item[./*[contains(text(), "${text}")]]`,
        dropdownItemSelected: (context: string) => `${context}//beh-select//div[contains(@class, "item-selected")]`,
    };

    constructor(
        _page: Page,
        context: string = '',
        options: IBehDropdownElementOptions = {
            multi: false,
            externalMenu: false,
        }
    ) {
        super(_page, context, options);
    }

    private async waitForMenuSelectAllItemElement() {
        let locator = this.locators.menuItemByClassName(this.context, 'menu-list-select-all');
        return await this.waitForXPath(locator);
    }

    private async waitForMenuElement(options: WaitForSelectorOptions) {
        let locator = this.locators.dropdownMenu(this.context);

        if (this.options.externalMenu) {
            locator = this.locators.externalMenu();
        }

        return await this.waitForXPath(locator, options);
    }

    private async waitForMenuItemElement(order: number) {
        let locator = this.locators.menuItem(this.context, order);

        if (this.options.externalMenu) {
            locator = this.locators.externalMenuItem(order);
        }

        return await this.waitForXPath(locator);
    }

    private async waitForMenuItemElementByText(text: string) {
        let locator = this.locators.menuItemByText(this.context, text);

        if (this.options.externalMenu) {
            locator = this.locators.externalMenuItemByText(text);
        }

        return await this.waitForXPath(locator);
    }

    async open() {
        const dropdownEl = await this.waitForElement();
        await dropdownEl.click();
        await this.waitForMenuElement({ visible: true });
        await this.waitFor(this.animations.toggleMenu  * 2);
    }

    async close() {
        const dropdownEl = await this.waitForElement();
        await dropdownEl.click();
        await this.waitForMenuElement({ visible: false });
        await this.waitFor(this.animations.toggleMenu);
    }

    async selectAll() {
        await this.waitForMenuElement({ visible: true });
        await this.waitFor(this.animations.toggleMenu);
        const menuItem = await this.waitForMenuSelectAllItemElement();
        await menuItem.click();
        await this.waitForItemSelected();
        await this.waitFor(this.animations.toggleMenu);
    }

    async selectOptionByOrder(order: number) {
        await this.waitForMenuElement({ visible: true });
        await this.waitFor(this.animations.toggleMenu);
        const menuItem = await this.waitForMenuItemElement(order);
        await menuItem.click();
        if (!this.options.multi) {
            await this.waitFor(this.animations.toggleMenu);
            await this.waitForMenuElement({ hidden: true });
        }
    }

    async selectOptionByText(text: string) {
        await this.waitForMenuElement({ visible: true });
        await this.waitFor(this.animations.toggleMenu);
        const menuItem = await this.waitForMenuItemElementByText(text);
        await menuItem.click();
        if (!this.options.multi) {
            await this.waitFor(this.animations.toggleMenu);
            await this.waitForMenuElement({ hidden: true });
        }
    }

    async waitForItemSelected() {
        let locator = this.locators.dropdownItemSelected(this.context);
        return await this.waitForXPath(locator);
    }

    static async byLabel(contextPage: Page = page, labelName: string, multi: boolean = false, externalMenu: boolean = false): Promise<BehDropdownElement> {
        return <Promise<BehDropdownElement>>this.byContext(contextPage, `//beh-input-layout[@caption="${labelName}"]`, {multi, externalMenu});
    }

}