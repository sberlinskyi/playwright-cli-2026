import type { Page, Locator } from '@playwright/test';

const HOME_URL = 'https://codemify.com/';

export class CodemifyHomePage {
  readonly page: Page;
  readonly aiCoursesLink: Locator;
  readonly aiEngineeringLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.aiCoursesLink = page.locator('a', { hasText: 'AI Courses' }).first();
    this.aiEngineeringLink = page.locator('a', { hasText: 'AI Engineering' }).first();
  }

  async goto() {
    await this.page.goto(HOME_URL, { waitUntil: 'domcontentloaded' });
  }

  async openAICourses() {
    await this.aiCoursesLink.click();
  }

  async openAIEngineering() {
    await this.aiEngineeringLink.click();
  }

  /** Simulates the AI Engineering page request failing with a 403. */
  async blockAIEngineeringAccess() {
    await this.page.route('**/AI-Engineering*', route =>
      route.fulfill({
        status: 403,
        contentType: 'text/plain',
        body: 'Access blocked by policy',
      })
    );
  }

  waitForAIEngineeringResponse(status: number) {
    return this.page.waitForResponse(
      response => response.url().includes('/AI-Engineering') && response.status() === status
    );
  }
}
