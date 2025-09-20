describe('ui', () => {
    it('updates the max iterations field when the +25 button is clicked', () => {
        cy.visit('http://localhost:4000');
        cy.get('#iter').should('have.value', '120');
        cy.get('#iter-plus-25').click();
        cy.get('#iter').should('have.value', '145');
        cy.get('#iter-plus-25').click();
        cy.get('#iter').should('have.value', '170');
        cy.get('#reset').click();
        cy.get('#iter').should('have.value', '120');
        cy.get('#iter-plus-25').click();
        cy.get('#iter').should('have.value', '145');
    });
    it('updates the max iterations field when the -25 button is clicked', () => {
        cy.visit('http://localhost:4000');
        cy.get('#iter').should('have.value', '120');
        cy.get('#iter-minus-25').click();
        cy.get('#iter').should('have.value', '95');
        cy.get('#iter-minus-25').click();
        cy.get('#iter').should('have.value', '70');
        cy.get('#reset').click();
        cy.get('#iter').should('have.value', '120');
        cy.get('#iter-minus-25').click();
        cy.get('#iter').should('have.value', '95');
    });
});
