describe('Navigation and Layout', () => {
  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', () => {
      cy.visit('/home');
      cy.url().should('include', '/login');
    });
  });
});
