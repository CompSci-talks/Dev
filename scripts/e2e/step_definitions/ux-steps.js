// scripts/e2e/step_definitions/ux-steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { NavigationPage } = require('../pom/navigation.pom');

// Note: many steps are shared with other step files, Cucumber handles this.
// We only implement specific ones here.

When('I navigate to the Semester Management page', async function () {
    await this.page.goto('/admin/semesters');
});

Then('I should see a {string} message.', async function (message) {
    await expect(this.page.locator('body')).toContainText(message);
});
