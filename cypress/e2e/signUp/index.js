import { ELEMENTS } from "./elements";
import { faker } from '@faker-js/faker'
class Register {
  generateFixtureUsers(qty) {
    const credentials = []
    const responses = []

    test : Cypress._.times(qty, () => {
      cy.request({
        method: 'POST',
        url: 'api/users',
        body: {
          user: {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password()
          }
        }
      }).then(response => {
        credentials.push(JSON.parse(response.requestBody))
        responses.push(response.body)
      })
    })

    cy.writeFile('cypress/fixtures/usersCredentials.json', credentials)
    cy.writeFile('cypress/fixtures/usersRegistered.json', responses)
  }

  fillRegisterForm (name, email, password) {
    cy.get(ELEMENTS.nameInput)
    .type(name)
    .should('have.attr', 'required');

    cy.get(ELEMENTS.emailInput)
        .type(email)
        .should('have.attr', 'type', 'email')
        .and('have.attr', 'required');

    cy.get(ELEMENTS.passwordInput)
        .type(password)
        .should('have.attr', 'type', 'password')
        .and('have.attr', 'required')
  }

  submitRegisterForm () {
    return cy.get(ELEMENTS.btnSubmit).click()
  }
}

export default new Register()