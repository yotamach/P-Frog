// Page Object Model for P-Frog Application

export class WelcomePage {
  visit() {
    return cy.visit('/welcome');
  }

  getWelcomeMessage() {
    return cy.contains('Welcome to P-Frog');
  }

  clickLogin() {
    return cy.contains('Login').click();
  }

  clickSignUp() {
    return cy.contains('Sign Up').click();
  }
}

export class LoginPage {
  visit() {
    return cy.visit('/login');
  }

  getEmailInput() {
    return cy.get('input[name="email"]');
  }

  getPasswordInput() {
    return cy.get('input[name="password"]');
  }

  getSubmitButton() {
    return cy.get('button[type="submit"]');
  }

  login(email: string, password: string) {
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getSubmitButton().click();
  }

  getErrorMessage() {
    return cy.get('[data-testid="error-message"]');
  }
}

export class RegistrationPage {
  visit() {
    return cy.visit('/registration');
  }

  getNameInput() {
    return cy.get('input[name="name"]');
  }

  getEmailInput() {
    return cy.get('input[name="email"]');
  }

  getPasswordInput() {
    return cy.get('input[name="password"]');
  }

  getSubmitButton() {
    return cy.get('button[type="submit"]');
  }

  register(name: string, email: string, password: string) {
    this.getNameInput().type(name);
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getSubmitButton().click();
  }
}

export class DashboardPage {
  visit() {
    return cy.visit('/home');
  }

  getTotalTasksCard() {
    return cy.get('[data-testid="total-tasks-card"]');
  }

  getTotalProjectsCard() {
    return cy.get('[data-testid="total-projects-card"]');
  }

  getRecentTasks() {
    return cy.get('[data-testid="recent-tasks"]');
  }

  getRecentProjects() {
    return cy.get('[data-testid="recent-projects"]');
  }

  clickQuickCreateTask() {
    return cy.get('[data-testid="quick-create-task"]').click();
  }

  clickQuickCreateProject() {
    return cy.get('[data-testid="quick-create-project"]').click();
  }
}

export class TasksPage {
  visit() {
    return cy.visit('/home/tasks');
  }

  getCreateTaskButton() {
    return cy.contains('button', 'Create Task');
  }

  clickCreateTask() {
    this.getCreateTaskButton().click();
  }

  getTasksList() {
    return cy.get('[data-testid="tasks-list"]');
  }

  getSearchInput() {
    return cy.get('[data-testid="search-input"]');
  }

  getStatusFilter() {
    return cy.get('[data-testid="status-filter"]');
  }

  searchTasks(query: string) {
    this.getSearchInput().type(query);
  }

  filterByStatus(status: string) {
    this.getStatusFilter().select(status);
  }
}

export class ProjectsPage {
  visit() {
    return cy.visit('/home/projects');
  }

  getCreateProjectButton() {
    return cy.contains('button', 'Create Project');
  }

  clickCreateProject() {
    this.getCreateProjectButton().click();
  }

  getProjectsGrid() {
    return cy.get('[data-testid="projects-grid"]');
  }

  getSearchInput() {
    return cy.get('[data-testid="search-input"]');
  }

  searchProjects(query: string) {
    this.getSearchInput().type(query);
  }
}

export class SettingsPage {
  visit() {
    return cy.visit('/home/settings');
  }

  clickProfileTab() {
    return cy.contains('Profile').click();
  }

  clickAccountTab() {
    return cy.contains('Account').click();
  }

  clickPreferencesTab() {
    return cy.contains('Preferences').click();
  }

  getNameInput() {
    return cy.get('input[name="name"]');
  }

  getEmailInput() {
    return cy.get('input[name="email"]');
  }

  getSubmitButton() {
    return cy.get('button[type="submit"]');
  }

  updateProfile(name: string, email: string) {
    this.getNameInput().clear().type(name);
    this.getEmailInput().clear().type(email);
    this.getSubmitButton().click();
  }
}

export class Sidebar {
  getDashboardLink() {
    return cy.contains('Dashboard');
  }

  getTasksLink() {
    return cy.contains('Tasks');
  }

  getProjectsLink() {
    return cy.contains('Projects');
  }

  getSettingsLink() {
    return cy.contains('Settings');
  }

  navigateToDashboard() {
    this.getDashboardLink().click();
  }

  navigateToTasks() {
    this.getTasksLink().click();
  }

  navigateToProjects() {
    this.getProjectsLink().click();
  }

  navigateToSettings() {
    this.getSettingsLink().click();
  }
}

export class Header {
  getUserAvatar() {
    return cy.get('[data-testid="user-avatar"]');
  }

  openUserMenu() {
    this.getUserAvatar().click();
  }

  clickProfile() {
    return cy.contains('Profile').click();
  }

  clickLogout() {
    return cy.contains('Logout').click();
  }
}

// Export instances for easy access
export const welcomePage = new WelcomePage();
export const loginPage = new LoginPage();
export const registrationPage = new RegistrationPage();
export const dashboardPage = new DashboardPage();
export const tasksPage = new TasksPage();
export const projectsPage = new ProjectsPage();
export const settingsPage = new SettingsPage();
export const sidebar = new Sidebar();
export const header = new Header();

