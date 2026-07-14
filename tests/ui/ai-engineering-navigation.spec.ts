import { test, expect } from '../../fixtures/codemifyFixture';

test.describe('AI Engineering', () => {
  test('user has access to AI Engineering page when the request is successful', async ({ homePage, aiEngineeringPage }) => {
    await homePage.goto();

    await homePage.openAICourses();
    await homePage.openAIEngineering();

    await expect(homePage.page, 'URL should navigate to the AI Engineering page').toHaveURL(/AI-Engineering/);
    await expect(aiEngineeringPage.heading, 'Page heading should be visible after successful navigation').toBeVisible();
  });

  test('access is blocked when critical /AI-Engineering request fails', async ({ homePage, aiEngineeringPage }) => {
    await homePage.blockAIEngineeringAccess();
    await homePage.goto();

    await homePage.openAICourses();

    const responsePromise = homePage.waitForAIEngineeringResponse(403);
    await homePage.openAIEngineering();
    const response = await responsePromise;

    await expect(response.status(), 'AI Engineering page request should be blocked with a 403 status').toBe(403);
    await expect(aiEngineeringPage.body, 'Body should show the access-blocked message').toContainText('Access blocked by policy');
    await expect(aiEngineeringPage.heading, 'Page heading should not render when access is blocked').toHaveCount(0);
  });
});
