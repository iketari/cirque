import {BaseSteps} from './base.steps';
import { Page } from 'puppeteer';
import { Catch } from '../utils/catch';
import { BehDropdownElement } from '../elements/dropdown';
import { BehdateTimePickcer } from '../elements/datetimepicker';
import { NotificationsElement } from '../elements/notifications.element';
import { PreloaderElement } from '../elements/preloader.element';

export class TasksSteps extends BaseSteps {
    constructor(page: Page) {
        super(page);
    }

    @Catch('Can not find the page locator')
    async waitForPage() {
        await this.page.waitForXPath('//beh-releases//beh-page'); // TODO: move to pages!
    }


    @Catch('Cant run tasks')
    async runTasks() {
        // wait for a spinner
        await this.page.waitForXPath('//beh-tasks//beh-loading-overlay//*[contains(@class, "wrapper")]');
        await this.page.waitForXPath('//beh-tasks//beh-loading-overlay//*[contains(@class, "wrapper")]', { hidden: true });

        // create "Execute scenarios" if needed
        await this.page.waitForXPath('//beh-tasks//beh-grid');
        const execRow = await this.page.$x('//beh-tasks//beh-grid//tr[.//*[contains(text(), "Execute scenarios")]]');

        if (execRow === null) {
            console.log('The task "Execute scenarios" does not exist. Lets create a new one!');
            const createBtn = await this.page.waitForXPath('//beh-tasks//button[contains(text(), "Create")]');
            await createBtn.click();

            await this.page.waitForXPath('//beh-task-view');

            const taskTypeDropdown = await BehDropdownElement.byLabel(page, 'Type', false, false);
            await taskTypeDropdown.open();
            await taskTypeDropdown.selectOptionByText('Execute scenarios'); // select "Risk case generation"

            const createTaskBtn = await this.page.waitForXPath('//beh-task-view//button[contains(text(), "Create task")]');
            await createTaskBtn.click();
        }


        const runBtn = await this.page.waitForXPath('//beh-tasks//beh-grid//tr[.//*[contains(text(), "Execute scenarios")]]//button[contains(text(), "Run")]');
        await runBtn.click();

        await this.page.waitForXPath('//beh-tasks//beh-grid//tr[.//*[contains(text(), "Execute scenarios")]]//a[contains(@href, "execution")]');
        await this.page.waitForXPath('//beh-tasks//beh-grid//tr[.//*[contains(text(), "Execute scenarios")]]//button[contains(text(), "Run")]');
    }

}

