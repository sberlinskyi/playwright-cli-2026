import { test as base, expect } from '@playwright/test';
import { CodemifyHomePage } from '../pages/CodemifyHomePage';
import { AIEngineeringPage } from '../pages/AIEngineeringPage';

type Fixtures = {
  homePage: CodemifyHomePage;
  aiEngineeringPage: AIEngineeringPage;
  mockAnalytics: void;
};

export const test = base.extend<Fixtures>({
  // Auto-applied for every test: stub out third-party analytics/RUM calls
  // so they never slow down or flake the navigation under test.
  mockAnalytics: [
    async ({ page }, use) => {
      await page.route('**/stat.tildaapi.one/event*', route =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      );
      await page.route('**/codemify.com/cdn-cgi/rum*', route => route.fulfill({ status: 204, body: '' }));
      await page.route('**/k.clarity.ms/collect', route => route.fulfill({ status: 204, body: '' }));

      await use();
    },
    { auto: true },
  ],

  homePage: async ({ page }, use) => {
    await use(new CodemifyHomePage(page));
  },

  aiEngineeringPage: async ({ page }, use) => {
    await use(new AIEngineeringPage(page));
  },
});

export { expect };
