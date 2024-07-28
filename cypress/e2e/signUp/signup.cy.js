import Login from '../login/index';
import Home from '../home/index'
import Register from './index';
import { faker } from '@faker-js/faker';

describe('Register feature', () => {
  beforeEach(() => {
    Home.acessHomePage();
    Home.accessLoginPage();
    Login.validateLoginPage();
  })

  it('System should not allow register accounts for users already registered', () => {
    Login.accessRegisterPage().then(() => {
      cy.url().should('include', '/register')
    })

    cy.intercept('POST', '/api/users').as('postUser')

    Register.fillRegisterForm(Cypress.env('defaultName'), Cypress.env('defaultEmail'),  Cypress.env('defaultPassword'))

    Register.submitRegisterForm().then(() => {
      cy.wait('@postUser').then(({ response }) => {
        expect(response.statusCode).to.equal(422)
      })
    })
  })

  Cypress._.times(3, () => {
    it('Create a new account', () => {
        Login.accessRegisterPage().then(() => {
          cy.url().should('include', '/register');
       })

       cy.intercept('POST', '/api/users').as('postUser')

       
       Register.fillRegisterForm(faker.person.fullName(), faker.internet.email(), faker.internet.password())
       Register.submitRegisterForm().then(() => {
          cy.wait('@postUser').then(({response}) => {
              expect(response.statusCode).to.eq(201)
          })
       })
    });
  })
})