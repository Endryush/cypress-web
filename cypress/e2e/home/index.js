class Home {
  acessHomePage () {
    cy.visit('/')
  }

  accessLoginPage () {
    cy.contains('Login')
      .should('have.attr', 'href', '#/login')
      .click()
  }

  accessNewArticlePage () {
    cy.contains('New Article')
      .should('have.attr', 'href', '#/editor')
      .click()
  }
}

export default new Home()