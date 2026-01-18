describe('p-frog', () => {
  beforeEach(() => cy.visit('/welcome'));

  it('should display welcome message', () => {
    // Check if welcome content is visible
    cy.contains('Welcome to P-Frog').should('be.visible');
  });
});
