import {BaseSteps} from './base.steps';
import { Page } from 'puppeteer';
import { Catch } from '../utils/catch';
import { BehDropdownElement } from '../elements/dropdown';
import { BehdateTimePickcer } from '../elements/datetimepicker';
import { NotificationsElement } from '../elements/notifications.element';
import { PreloaderElement } from '../elements/preloader.element';

export class ReleasesSteps extends BaseSteps {
    constructor(page: Page) {
        super(page);
    }

    @Catch('Can not find the page locator')
    async waitForPage() {
        await this.page.waitForXPath('//beh-releases//beh-page'); // TODO: move to pages!
    }

    @Catch('Can not create a new release')
    async createNewRelese() {
        const releaseName = `new_release_${Date.now()}`;

        await this.page.click('[title="Create new release bucket"]');
        await this.page.type('[name="newReleaseName"]', releaseName);
        const addReleaseBtn = await this.page.waitForXPath('//beh-add-release-form//button[text()=" Save "]');
        await this.page.waitForFunction(`btn => !btn.disabled`, { polling: 'mutation' }, addReleaseBtn);
        await addReleaseBtn.click();
        await this.page.waitForXPath(`//beh-releases/beh-page/beh-side-menu-layout/div[2]/beh-releases/beh-list/div/div[2]/beh-panel[.//*[contains(text(), "${releaseName}")]]`);
        await this.page.waitForSelector('beh-notification');
        await this.page.click('beh-notification .close');

        return releaseName;
    }

    @Catch('Cant open new')
    async openNew() {
        const newReleasesLinkEl = await this.page.waitForSelector('.side-menu-content a[title="New"]');
        await newReleasesLinkEl.click();
    }


    @Catch('Cant open a release')
    async openByName(releaseName: string) {
        // open the release
        const releasePanelEl = await this.page.waitForXPath(`//beh-releases//div[@class="main-block"]//beh-list//beh-panel//div/div[.//*[contains(text(), "${releaseName}")]]`);
        await releasePanelEl.click();

        let preloader = new PreloaderElement(this.page, '//beh-release-view');
        preloader.waitForReady();
    }

    @Catch('Cant open a scenario')
    async openScenarioByName(scenarioName: string) {
        // open the scenario
        await this.page.waitForXPath(`//beh-release-view//beh-list//beh-panel`);
        await this.page.waitFor(500); // TODO: Get rid of that!
        const scenarioPanelEl = await this.page.waitForXPath(`//beh-release-view//beh-list//beh-panel[.//*[contains(text(), "${scenarioName}.blink")]]`);
        scenarioPanelEl.click({clickCount: 2});
        await this.page.waitForSelector('beh-scenario-view beh-tabset');
        await this.page.waitFor(1000);
    }

    @Catch('Cant configure')
    async configureScenario() {
        // open scenario configuration
        const configurationTabEl = await this.page.waitForXPath('//beh-scenario-view//beh-tab[.//*[contains(text(), "Configuration")]]');
        await configurationTabEl.click();
        await this.page.waitForSelector('.tabset-content beh-scenario-configuration', { visible: true });

        // add configuration
        await this.page.click('beh-scenario-configuration a.add-new');
        await this.page.waitForSelector('beh-scenario-configuration .conf-content');

        // select he first value in beh-select by label

        await this.setDrowdownOption('Category', 1, false);
        await this.setDrowdownOption('Severity', 1, false);
        await this.setDrowdownOption('ME Groups', 1, true);
        await this.setDrowdownOption('Escalation role', 1, false);

        // add an action
        const addBtn = await this.page.waitForXPath('//beh-scenario-configuration//button[contains(text(), "Add action")]');
        await addBtn.click();
        await this.page.waitForXPath('//beh-scenario-actions//beh-modal-window');

        const actionDropdown = await BehDropdownElement.byContext(this.page, '//beh-scenario-actions//beh-modal-window', {multi: false, externalMenu: true});
        await actionDropdown.open();
        await actionDropdown.selectOptionByOrder(3); // select "Risk case generation"

        const addActionBtn = await this.page.waitForXPath('//beh-scenario-actions//beh-modal-window//button[contains(text(), "Add")]');
        await addActionBtn.click();

        await this.page.waitForXPath('//beh-scenario-actions//beh-modal-window', { hidden: true });

        const saveConfBtn = await this.page.waitForXPath('//beh-scenario-configuration//button[text()="Save"]');
        await saveConfBtn.click();

        await this.page.waitForSelector('beh-notification');
        await this.page.click('beh-notification .close');


        // set till date
        const tillDropdownEl = await this.page.waitForXPath('//div[@class="date-control" and .//*[contains(text(), "Till")]]//beh-dropdown');
        await tillDropdownEl.click();

        const dateTimeElement = await BehdateTimePickcer.byContext(this.page, '//div[@class="date-control" and .//*[contains(text(), "Till")]]');
        await this.page.waitFor(150); // dropdown animation
        await dateTimeElement.clickOnButtonByText('March 2019');
        await dateTimeElement.clickOnButtonByText('2019');
        await dateTimeElement.clickOnButtonByText('‹');
        await dateTimeElement.clickOnButtonByText('2001');
        await dateTimeElement.clickOnButtonByText('December');
        await dateTimeElement.clickOnButtonByText('13');

        // click Save
        const saveBtnEl = await this.page.waitForXPath('//beh-scenario-view//button[contains(text(), "Save")]')
        await saveBtnEl.click();

        // wait for spinner
        await this.page.waitForXPath('//beh-scenario-view/beh-page/beh-loading-overlay//*[contains(@class, "wrapper")]');
        await this.page.waitForXPath('//beh-scenario-view/beh-page/beh-loading-overlay//*[contains(@class, "wrapper")]', { hidden: true });

        // notification
        let notification: NotificationsElement = await NotificationsElement.byContext(this.page, '', {});
        await notification.close();
    }

    @Catch('Cant activate a release')
    async activateRelease() {
        // go back
        await this.page.click('beh-scenario-view .back-icon-container');

        try {
            // wait for a spinner
            await this.page.waitForXPath('//beh-release-view/beh-loading-overlay//*[contains(@class, "wrapper")]');
            await this.page.waitForXPath('//beh-release-view/beh-loading-overlay//*[contains(@class, "wrapper")]', { hidden: true });
        } catch (e) {
            console.warn(e);
        }

        // activate the current release
        const activateBtn = await this.page.waitForXPath(`//button[@title="Activate"]`);
        await activateBtn.click(); // Doesn't work well!

        // wait for spinner
        await this.page.waitForXPath('//beh-release-view/beh-loading-overlay//*[contains(@class, "wrapper")]');
        await this.page.waitForXPath('//beh-release-view/beh-loading-overlay//*[contains(@class, "wrapper")]', { hidden: true });

        const activateOkBtn = await this.page.waitForXPath('//beh-modal-window//button[contains(text(), "OK")]');
        await activateOkBtn.click(); // Doesn't work well!


        // Activate release modal
        const releaseDateTime = await this.page.waitForXPath('//beh-modal-window//beh-publish-release//beh-input-date-time-picker');
        await releaseDateTime.click();

        // Set From
        const dateTimeFromElement = await BehdateTimePickcer.byContext(this.page, '//beh-modal-window//beh-publish-release//beh-input-date-time-picker');
        const month = new Date().toLocaleString('en-us', {month: 'long'});
        const year = new Date().toLocaleString('en-us', {year: 'numeric'})
        await dateTimeFromElement.clickOnButtonByText(`${month} ${year}`);
        await dateTimeFromElement.clickOnButtonByText(`${year}`);
        await dateTimeFromElement.clickOnButtonByText('‹');
        await dateTimeFromElement.clickOnButtonByText('2001');
        await dateTimeFromElement.clickOnButtonByText('October');
        await dateTimeFromElement.clickOnButtonByText('23');

        await releaseDateTime.click();

        const activateOk2Btn = await this.page.waitForXPath('//beh-modal-window//button[contains(text(), "Activate")]');
        await activateOk2Btn.focus();
        await activateOk2Btn.click();

        // notification
        let notification = await NotificationsElement.byContext(this.page, '', {});
        await notification.close();
    }

    private async setDrowdownOption(label: string, option: number, multi: boolean) {
        const catDropdown = await BehDropdownElement.byLabel(this.page, label, multi, false);
        await catDropdown.open();

        if (multi) {
            await catDropdown.selectAll();
            await catDropdown.close();
        } else {
            await catDropdown.selectOptionByOrder(option);
        }
    }
}