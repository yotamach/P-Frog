describe('Projects Management', () => {
  describe('Projects Access', () => {
    it('should redirect to login when accessing projects without auth', () => {
      cy.visit('/home/projects');
      cy.url().should('include', '/login');
    });
  });
});
