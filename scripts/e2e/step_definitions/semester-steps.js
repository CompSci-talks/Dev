// scripts/e2e/step_definitions/semester-steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { SemesterPage } = require('../pom/semester.pom');
const { NavigationPage } = require('../pom/navigation.pom');
const { login } = require('../helpers/auth-helper');

Given('I am logged in as an administrator', async function () {
    // Using hardcoded test credentials for verification suite
    await login(this.page, 'admin@example.com', 'admin123');
});

Given('I am on the Admin Dashboard', async function () {
    const nav = new NavigationPage(this.page);
    await nav.gotoAdminDashboard();
});



When('I fill in the semester name as {string}', async function (name) {
    const sem = new SemesterPage(this.page);
    await sem.openCreateForm();
    // Use representative dates for Spring 2027
    await sem.createSemester(name, '2027-01-01', '2027-06-30');
});

When('I create a new semester named {string}', async function (name) {
    const sem = new SemesterPage(this.page);
    await sem.openCreateForm();
    await sem.createSemester(name, '2027-01-01', '2027-06-30');
});

When('I click "Create Semester"', async function () {
    // handeled by createSemester helper above for simplicity in one step
});

Then('I should see {string} in the semester list', async function (name) {
    await expect(this.page.locator('tr', { hasText: name })).toBeVisible();
});

When('I click "Set Active" for {string}', async function (name) {
    const sem = new SemesterPage(this.page);
    await sem.setActive(name);
});

Then('{string} should have the active status indicator', async function (name) {
    const sem = new SemesterPage(this.page);
    const active = await sem.isActive(name);
    expect(active).toBeTruthy();
});
