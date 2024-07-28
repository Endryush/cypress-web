import Login from "../login"
import Home from "../home"
import Editor from './index'
import { faker } from '@faker-js/faker'

describe.skip('Manage article --- Page objects', () => {
  beforeEach(() => {
    Home.acessHomePage()
    Home.accessLoginPage()
    Login.validateLoginPage()
    Login.doLogin(Cypress.env('defaultEmail'), Cypress.env('defaultPassword'))
  })

  it('Create article with success and using tag', () => {
    const title = faker.lorem.sentence(3)
    const description = faker.lorem.sentence(5)
    const text = faker.lorem.paragraph()
    const tag = faker.lorem.word()

    cy.intercept('POST', '/api/articles').as('postArticle')

    Home.accessNewArticlePage()
    Editor.fillArticleForm(title, description, text, tag)
    Editor.publishArticle().then(() => {
      cy.wait('@postArticle').then(({response}) => {
        expect(response.statusCode).to.equal(201)
      })

      cy.get('@titleArticle').then(() => {
        cy.url().should('include', '/article/')
        cy.contains(title)
        cy.contains(tag)
      })
    })
  })
})

describe('Manage article - version with custom commands and UI login', () => {
  beforeEach(() => {
    cy.visit('#/login')
    cy.loginUI(Cypress.env('defaultEmail'), Cypress.env('defaultPassword'))
  })

  it('Creating an article with tag', () => {
    const title = faker.lorem.sentence(3)
    const description = faker.lorem.sentence()
    const text = faker.lorem.paragraph(2)
    const tag = faker.lorem.word()

    cy.contains('New Article')
      .should('have.attr','href','#/editor')
      .click()

    cy.fillArticle(title, description, text, tag);

    cy.intercept('POST', '/api/articles').as('postArticle')
    cy.intercept('GET', '/api/articles/**').as('getArticles')

    cy.publishArticle().then(() => {
      cy.wait('@postArticle').then(({response}) => {
          expect(response.statusCode).to.equal(201)
      });
      cy.wait('@getArticles').its('response.statusCode').should('equal', 200)
      cy.url().should('include','/article/')
      cy.contains(title)
      cy.contains(tag)
    })
  })
})