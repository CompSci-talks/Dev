// scripts/e2e/helpers/auth-helper.js
const { LoginPage } = require('../pom/login.pom');
const { NavigationPage } = require('../pom/navigation.pom');

async function login(page, email, password) {
    const loginPage = new LoginPage(page);
    const navPage = new NavigationPage(page);

    await navPage.gotoLogin();
    await loginPage.login(email, password);

    // Wait for navigation
    await page.waitForURL('**/**', { timeout: 10000 });
}

module.exports = { login };
