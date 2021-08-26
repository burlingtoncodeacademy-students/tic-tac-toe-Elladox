


describe('Home Page', () => {
    before(() => {
        cy.visit("http://127.0.0.1:5500/")
    })
    it('has a header', () => {
        cy.get('#header')
    })
    it('has a header image', () => {
        cy.get('#headerImg')
    })
})