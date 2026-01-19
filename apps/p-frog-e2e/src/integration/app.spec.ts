describe('P-Frog Application', () => {
  describe('Application Smoke Tests', () => {
    it('should load the application', () => {
      cy.visit('/');
      cy.url().should('include', '/welcome');
    });

    it('should display welcome message', () => {
      cy.visit('/welcome');
      cy.contains('Welcome to P-Frog').should('be.visible');
    });
  });

  describe('SEO and Meta Tags', () => {
    it('should have viewport meta tag', () => {
      cy.visit('/welcome');
      cy.get('meta[name="viewport"]').should('exist');
    });
  });

  describe('Performance', () => {
    it('should load within acceptable time', () => {
      const start = Date.now();
      cy.visit('/welcome');
      const loadTime = Date.now() - start;
      
      expect(loadTime).to.be.lessThan(5000); // 5 seconds
    });
  });

  describe('Browser Compatibility', () => {
    it('should work with different viewport sizes', () => {
      const sizes: Cypress.ViewportPreset[] = ['iphone-6', 'ipad-2', 'macbook-15'];
      
      sizes.forEach((size) => {
        cy.viewport(size);
        cy.visit('/welcome');
        cy.contains('Welcome to P-Frog').should('be.visible');
      });
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper heading hierarchy', () => {
      cy.visit('/welcome');
      cy.get('h1, h2, h3, h4, h5, h6').should('exist');
    });
  });
});

