describe('Tasks Management', () => {
  describe('Tasks Access', () => {
    it('should redirect to login when accessing tasks without auth', () => {
      cy.visit('/home/tasks');
      cy.url().should('include', '/login');
    });
  });
});
