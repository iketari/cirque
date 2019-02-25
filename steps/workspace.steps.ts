import {BaseSteps} from './base.steps';
import { Page } from 'puppeteer';
import { Catch } from '../utils/catch';
import { NotificationsElement } from '../elements/notifications.element';
import { BehDropdownElement } from '../elements/dropdown';


export class WorkspaceSteps extends BaseSteps {

    constructor(page: Page) {
        super(page);
    }

    @Catch('Can not find the page locator')
    async waitForPage() {
        await this.page.waitForSelector('beh-workspace'); // TODO: move to pages!
    }

    @Catch('Can`t open a branch')
    async openBranch(name: string) {
        const repositoryEl = await this.page.waitForXPath(`//beh-file-item[./div//*[contains(text(), "${name}")]]`);
        await repositoryEl.click({clickCount: 2});
    }

    @Catch('Can`t create a scenario')
    async addBlinkScript(scenarioName: string) {
        // wait for the branch
        await this.page.waitForXPath('//beh-file-item[./div//*[contains(text(), "correcttill13-12-2001.blink")]]');

        // add blink script
        await this.page.click('beh-workspace-project-toolbar button[title="New item"]');
        const scenarioBtn = await this.page.waitForSelector('beh-menu-item[title="Scenario"]');
        await scenarioBtn.click();
        await this.page.waitForSelector('beh-create-new-file-window');
        await this.page.click('beh-create-new-file-window input[name="name"]', { clickCount: 3 });
        await this.page.type('beh-create-new-file-window input[name="name"]', scenarioName);
        await this.page.click('beh-create-new-file-window button[type="submit"]');
    }

    @Catch('Can`t edit the file')
    async editCurrentFile(text: string) {
        const editor = await this.page.waitForSelector('.blink-editor.ace_editor textarea');
        await editor.focus();
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('KeyA');
        await this.page.keyboard.up('Control');
        await editor.type(text);
        await this.page.focus('body');
    }

    @Catch('Can`t commit the changes')
    async commitChanges(commitMsg: string) {
        await this.page.click('beh-workspace-project-toolbar [title="Commit changes to branch"]');
        const commitMsgInput = await this.page.waitForSelector('input[placeholder="Type commit message"]');
        await commitMsgInput.type(commitMsg);

        const commitBtn = await this.page.waitForXPath('//beh-modal-window//button[contains(text(), "Commit")]');
        await this.page.waitForFunction(`btn => !btn.disabled`,  { polling: 'mutation' }, commitBtn); // wait for an active submit button
        await this.page.waitForXPath('//beh-modal-window//beh-overlay//*', { hidden: true });
        await commitBtn.click();

        let notification: NotificationsElement = await NotificationsElement.byContext(this.page, '', {});
        await notification.close();
    }

    @Catch('Can not add scenario')
    async addScenarioToRelease(releaseName: string, scenarioName: string) {
        const scenarioEl = await this.page.waitForXPath(`//beh-file-item[./div//*[contains(text(), "${scenarioName}.blink")]]`);
        await scenarioEl.focus();
        await scenarioEl.click();
        await scenarioEl.click({ button: 'right' });
        await this.page.waitForSelector('.tree-context-menu');

        const menuAddToReleaseEl = await this.page.waitForXPath('//beh-fs-tree//*[contains(@class, "menuitem") and .//*[contains(text(), "Add to release")]]');
        await menuAddToReleaseEl.click();

        // BehDropdown "Add files to release"
        const addToReleaseDropdown:BehDropdownElement = await BehDropdownElement.byContext(this.page, '//beh-modal-window[@caption="Add files to release"]', {multi: false, externalMenu: true});
        await addToReleaseDropdown.waitForItemSelected();
        await addToReleaseDropdown.open();
        await addToReleaseDropdown.selectOptionByText(releaseName);

        // click to Add
        const submitBtn = await this.page.waitForSelector('beh-add-to-release-window beh-modal-window button[type="submit"]');
        await this.page.waitForFunction(`btn => !btn.disabled`, { polling: 'mutation' }, submitBtn); // wait for an active submit button
        submitBtn.click();

        let notification: NotificationsElement = await NotificationsElement.byContext(this.page, '', {});
        await notification.close();
    }
}