describe('Settings', () => {
  describe('Settings Access', () => {
    it('should redirect to login when accessing settings without auth', () => {
      cy.visit('/home/settings');
      cy.url().should('include', '/login');
    });
  });
});
