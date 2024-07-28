import { ELEMENTS } from "./elements";
import { faker } from '@faker-js/faker'
class Register {
  generateFixtureUsers(qty) {
    const credentials = []
    const responses = []

    for (let i = 0; i < qty; i++) {
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
    }

    cy.writeFile('cypress/fixtures/usersCredentials.json', credentials)
    cy.writeFile('cypress/fixtures/usersRegistered.json', responses)
  }
}

export default new Register()