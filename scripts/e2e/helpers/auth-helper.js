// scripts/e2e/helpers/auth-helper.js
const { LoginPage } = require('../pom/login.pom');
const { NavigationPage } = require('../pom/navigation.pom');

async function login(page, email, password) {
    const loginPage = new LoginPage(page);
    const navPage = new NavigationPage(page);

    await navPage.gotoLogin();
    await loginPage.login(email, password);

    // Wait for navigation and check if we are on admin or home
    await page.waitForURL(url => url.pathname.includes('/admin') || url.pathname === '/', { timeout: 20000 });
}

module.exports = { login };
