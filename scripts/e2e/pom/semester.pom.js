// scripts/e2e/pom/semester.pom.js
class SemesterPage {
    constructor(page) {
        this.page = page;
        this.newSemesterBtn = page.locator('button:has-text("+ New Semester")');
        this.nameInput = page.locator('input[formControlName="name"]');
        this.startDateInput = page.locator('input[formControlName="start_date"]');
        this.endDateInput = page.locator('input[formControlName="end_date"]');
        this.saveBtn = page.locator('button:has-text("Save Semester")');
    }

    async openCreateForm() {
        await this.newSemesterBtn.click();
    }

    async createSemester(name, startDate, endDate) {
        await this.nameInput.fill(name);
        await this.startDateInput.fill(startDate);
        await this.endDateInput.fill(endDate);
        await this.saveBtn.click();
    }

    async setActive(name) {
        const row = this.page.locator('tr', { hasText: name });
        await row.locator('button:has-text("Set Active")').click();
    }

    async isActive(name) {
        const row = this.page.locator('tr', { hasText: name });
        return await row.locator('span:has-text("ACTIVE")').isVisible();
    }
}

module.exports = { SemesterPage };
