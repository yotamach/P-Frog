describe('p-frog', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Check if welcome content is visible
    cy.contains('Welcome').should('be.visible');
  });
});
