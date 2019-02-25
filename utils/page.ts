import { Page } from "puppeteer";

export const pageUtils = {
    async switchOffAnimations (page: Page) {
        const content = `
            *,
            *::after,
            *::before {
                transition-delay: 0s !important;
                transition-duration: 0s !important;
                animation-delay: -0.0001s !important;
                animation-duration: 0s !important;
                animation-play-state: paused !important;
            }`;

        return page.addStyleTag({content});
    }
}