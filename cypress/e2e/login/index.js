import { ELEMENTS } from "./elements";

class Login {
  validateLoginPage () {
    cy.url('/login').then(() => cy.contains('Sign in'))
  }

  accessRegisterPage () {
    return cy.contains(ELEMENTS.registerLinkText).click()
  }

  doLogin (username, password) {
    cy.get(ELEMENTS.emailInput)
      .should('have.attr', 'placeholder', 'Email')
      .type(username)

    cy.get(ELEMENTS.passwordInput)
      .should('have.attr', 'type', 'password')
      .and('have.attr', 'placeholder', 'Password')
      .type(password)

    return cy.get(ELEMENTS.loginBtn).contains('Login').click()
  }

  logout () {
    return cy.get(ELEMENTS.profileMenu).click().then(() => {
      cy.get(ELEMENTS.linkLogout)
        .contains('Logout').click()
    })
  }
}

export default new Login()