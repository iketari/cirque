import { Page } from "puppeteer";
import { IBehElementLocators } from "../elements/element";

export class BaseSteps {
    constructor(protected page: Page) {}
}