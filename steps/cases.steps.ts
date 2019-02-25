import {BaseSteps} from './base.steps';
import {Page} from 'puppeteer';
import { Catch } from '../utils/catch';

export class CasesSteps extends BaseSteps {
    constructor(page: Page) {
        super(page);
    }

    @Catch('Can not find the page element')
    async waitForPage() {
        await this.page.waitForSelector('beh-case-list'); // TODO: move to pages!
    }

    @Catch('Can not check cases')
    async checkCasesByName(scenarioName: string) {
        let keywordInput = await this.page.waitForXPath('//beh-new-selector-adder//input[@name="keyword"]');
        await keywordInput.type(scenarioName);
        await this.page.keyboard.press('Enter');

        await this.page.waitForXPath('//beh-case-list//tr[contains(@class, "case")]');
        const casesEls = await this.page.$x(`//a[contains(text(), "${scenarioName}")]`);

        expect(casesEls).toBeTruthy();
    }
}