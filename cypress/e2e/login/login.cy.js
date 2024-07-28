import Login from "./index";
import Home from '../home/index'
import Register from '../signUp/index'

import { ELEMENTS } from "./elements";

describe('Login Feature using Page Objects', () => {
  before(() => {
    Register.generateFixtureUsers(5)
  })

  beforeEach(() => {
    Home.acessHomePage()
  })

  it('Login with invalid credentials', () => {
    Home.accesLoginPage()
    Login.validadeLoginPage()

    cy.intercept('POST', 'api/users/login').as('loginPost')

    Login.doLogin('jjjj@mail.com', '33232232332')

    cy.wait('@loginPost').its('response.statusCode').should('equal', 404)
    cy.contains(ELEMENTS.stringEmailNotFound)
  })

  it('Login with valid credentials', () => {
    Home.accesLoginPage()
    Login.validadeLoginPage()

    cy.intercept('POST', 'api/users/login').as('postLogin')
    cy.intercept('GET', 'api/user').as('getUser')

    Login.doLogin(Cypress.env('defaultEmail'), Cypress.env('defaultPassword'))
    
    cy.wait('@postLogin').its('response.statusCode').should('equal', 200)
    cy.wait('@getUser').then((response) => {
      const { body } = response.response
      expect(response.response.statusCode).to.be.equal(200)
      expect(body).to.not.equal('undefined')

      const { user } = body
      expect(user).to.have.property('username')
      expect(user).to.have.property('email', Cypress.env('defaultEmail'))
      expect(user).to.have.property('token').and.to.be.a('string')
      expect(user).to.have.property('image').and.to.be.a('null')
      expect(user).to.have.property('bio').and.to.be.a('null')
    })
  })

  it.only('Login with multiple valid credentials', () => {
    cy.intercept('POST', 'api/users/login').as('postLogin')
    cy.intercept('GET', 'api/user').as('getUser')

    cy.fixture('usersCredentials.json').then(userFixture => {
      userFixture.forEach(user => {
        Home.accesLoginPage()
        Login.validadeLoginPage()
  
        Login.doLogin(user.user.email, user.user.password)

        cy.wait('@postLogin').its('response.statusCode').should('equal', 200)
        cy.wait('@getUser').then((response) => {
          const { body } = response.response
          expect(response.response.statusCode).to.be.equal(200)
          expect(body).to.not.equal('undefined')

          const { user } = body

          expect(user).to.have.property('username', user.username)
          expect(user).to.have.property('email', user.email)
          expect(user).to.have.property('token').and.to.be.a('string')
          expect(user).to.have.property('image').and.to.be.a('null')
          expect(user).to.have.property('bio').and.to.be.a('null')
        })

        Login.logout()
      })
    })
  })
})