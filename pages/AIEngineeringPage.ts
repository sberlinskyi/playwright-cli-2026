import type { Page, Locator } from '@playwright/test';

export class AIEngineeringPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly body: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.body = page.locator('body');
  }
}
