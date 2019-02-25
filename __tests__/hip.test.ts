import * as puppeteer from 'puppeteer';

import { LoginPageSteps } from '../steps/login-page.steps';
import { ReleasesSteps } from '../steps/releases.steps';
import { TasksSteps } from '../steps/tasks.steps';
import { TopMenuDestinations, TopMenuSteps } from '../steps/top-menu.steps';
import { WorkspaceSteps } from '../steps/workspace.steps';
import { CasesSteps } from '../steps/cases.steps';
import { config } from '../beh.config';

describe('Realeases', () => {
    let browser: puppeteer.Browser,
        page: puppeteer.Page;

    const width = 1440, height = 1024;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                `--window-size=${ width },${ height }`
            ],
            defaultViewport: { width, height }
        });
        page = await browser.newPage();

        await page.setViewport({
            width,
            height
        });

        jest.setTimeout(60 * 1000);
    });

    it('Should generate some content', async () => {
        let topMenuSteps = new TopMenuSteps(page);
        let loginPageSteps = new LoginPageSteps(page, config.host);
        let releasesPageSteps = new ReleasesSteps(page);
        let workspacePageSteps = new WorkspaceSteps(page);
        let tasksPageSteps = new TasksSteps(page);
        let casesPageSteps = new CasesSteps(page);


        await loginPageSteps.open();
        await loginPageSteps.login();

        // open releases
        await topMenuSteps.goTo(TopMenuDestinations.Releases);
        await releasesPageSteps.waitForPage();

        // create new release
        let releaseName = await releasesPageSteps.createNewRelese();

        // open workspace
        await topMenuSteps.goTo(TopMenuDestinations.Workspace);
        await workspacePageSteps.waitForPage();

        // open a branch
        await workspacePageSteps.openBranch('.repository');
        await workspacePageSteps.openBranch('disabling');

        // create a new scenario
        const scenarioName = `${releaseName}_scenario`;
        await workspacePageSteps.addBlinkScript(scenarioName);
        await workspacePageSteps.editCurrentFile('Text(value = "work")');

        // commit the changes
        const commitMsg = `${scenarioName} commit`;
        await workspacePageSteps.commitChanges(commitMsg);

        // add scenario to the release
        await workspacePageSteps.addScenarioToRelease(releaseName, scenarioName);

        // open releases
        await topMenuSteps.goTo(TopMenuDestinations.Releases);
        await releasesPageSteps.waitForPage();

        // open new releases
        await releasesPageSteps.openNew();
        await releasesPageSteps.openByName(releaseName);

        // open a scenario
        await releasesPageSteps.openScenarioByName(scenarioName);

        // conffigure the scenarion
        await releasesPageSteps.configureScenario();

        await releasesPageSteps.activateRelease();

        // open tasks
        await topMenuSteps.goTo(TopMenuDestinations.Tasks);

        await tasksPageSteps.runTasks();

        // go to Cases
        await topMenuSteps.goTo(TopMenuDestinations.Cases);
        await casesPageSteps.waitForPage();

        // check cases
        await casesPageSteps.checkCasesByName(scenarioName);
    });

    afterAll(async () => {
        await page.close();
        await browser.close();
    })
});
