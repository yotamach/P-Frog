describe('Dashboard', () => {
  describe('Dashboard Access', () => {
    it('should redirect to login when not authenticated', () => {
      cy.visit('/home');
      cy.url().should('include', '/login');
    });
  });
});
