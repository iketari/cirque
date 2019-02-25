import { BaseSteps } from './base.steps';
import { Page } from 'puppeteer';
import { BehTopMenuElement } from '../elements/top-menu.element';
import { IBehElementLocators } from '../elements/element';
import { pageUtils } from '../utils/page';
import { config } from '../beh.config';


export class LoginPageSteps extends BaseSteps {
    private topMenuEl: BehTopMenuElement;
    constructor(page: Page, private host: string) {
        super(page);
    }

    async open() {
        try {
            await this.page.goto(`${this.host}/dashboard/login.html`);
            // await this.page.goto('http://172.31.22.163:8080/dashboard/login.html');

            await pageUtils.switchOffAnimations(this.page);
    
            await this.page.waitForSelector('.login-content');
        } catch (e) {
            expect(e).toMatch('Can not open the login page');
        }
    }

    async login() {
        try {
            await this.page.type('#username', config.user);
            await this.page.type('#password', config.password);

            await this.page.click('#submit');
            await this.page.waitForNavigation();
        } catch (e) {
            expect(e).toMatch('Can not be log in')
        }
    }
}