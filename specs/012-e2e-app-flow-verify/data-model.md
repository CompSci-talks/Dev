# Data Model & E2E Scenarios

## Test Entities

### `E2EScenario`
- **id**: Unique identifier (e.g., `SCN-001`)
- **feature**: The functional area (e.g., `Semesters`, `Comments`)
- **steps**: List of Gherkin steps (Given/When/Then)
- **priority**: P1-P3 based on spec

## Scenario Definitions (Gherkin)

### Feature: Semester Management
**Scenario: Admin creates and activates a new semester**
- **Given** I am logged in as an administrator
- **When** I navigate to the Semester Management page
- **And** I fill in the form for "Spring 2027"
- **And** I click "Create"
- **Then** I should see "Spring 2027" in the list
- **When** I click "Set Active" for "Spring 2027"
- **Then** only "Spring 2027" should have the active status indicator

### Feature: Seminar CRUD
**Scenario: Admin adds a seminar with speakers and tags**
- **Given** there is an active semester "Spring 2027"
- **When** I add a seminar "Quantum Computing 101"
- **And** I select speaker "Alice Smith" and tag "Physics"
- **And** I save the seminar
- **Then** I should see the seminar in the public portal under "Spring 2027"

### Feature: Comments & Moderation
**Scenario: User interaction and Admin deletion**
- **Given** I am on a seminar detail page
- **When** I post a comment "Amazing content!"
- **Then** the global loader should appear and disappear
- **And** a success toast should be visible
- **And** the comment should be visible
- **When** I switch to an Admin session
- **And** I delete that comment
- **Then** the comment should be removed for all users

## Edge Case Scenarios

### Feature: Data Integrity
**Scenario: Attempting to create a semester with invalid dates**
- **Given** I am creating a new semester
- **When** I enter an end date that is before the start date
- **Then** the "Create" button should be disabled
- **And** I should see a validation error message.

### Feature: Content Resilience
**Scenario: Navigation to an empty semester**
- **Given** a semester with no assigned seminars
- **When** I view the portal for that semester
- **Then** I should see a "No seminars scheduled for this semester" message.
