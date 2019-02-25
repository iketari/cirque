import {BaseSteps} from './base.steps';
import { Page } from 'puppeteer';
import { BehTopMenuElement } from '../elements/top-menu.element';
import { IBehElementLocators } from '../elements/element';

export enum TopMenuDestinations {
    Cases = 'Cases',
    Workspace = 'Workspace',
    Tasks = 'Tasks',
    Releases = 'Releases'
}

export class TopMenuSteps extends BaseSteps {
    private topMenuEl: BehTopMenuElement;
    constructor(page: Page) {
        super(page);

        this.topMenuEl = new BehTopMenuElement(page);
    }

    async goTo(destination: TopMenuDestinations) {
        try {
            switch (destination) {
                case TopMenuDestinations.Cases:
                    await this.topMenuEl.goToCases();
                    break;

                case TopMenuDestinations.Workspace:
                    await this.topMenuEl.toggleTools();
                    await this.topMenuEl.goToWorspace();
                    break;

                case TopMenuDestinations.Tasks:
                    await this.topMenuEl.toggleTools();
                    await this.topMenuEl.goToTasks();
                    await this.page.waitForSelector('beh-tasks'); // TODO: move to pages!
                    break;

                case TopMenuDestinations.Releases:
                    await this.topMenuEl.toggleTools();
                    await this.topMenuEl.goToReleases();
                    break;

                default:
                    break;
            }
        } catch (e) {
            console.log(`Can not got to ${destination}.`);
            expect(e).toMatch('Error')
        }
    }
}