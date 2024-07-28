import { faker } from '@faker-js/faker'
import { ELEMENTS as loginElement } from '../e2e/login/elements'
import { ELEMENTS as articleElement  } from '../e2e/editor/elements'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginUI',(email, password) => { 
  cy.get(loginElement.emailInput)
      .should('have.attr','type', 'email')
      .and('have.attr','placeholder', 'Email')
      .type(email);
  
  cy.get(loginElement.passwordInput)
      .should('have.attr','type', 'password')
      .and('have.attr','placeholder', 'Password')
      .type(password); 
  
  cy.intercept('POST', 'api/users/login').as('postLogin');
      
  cy.get(loginElement.loginBtn).contains('Login').click();
  
  cy.wait('@postLogin').its('response.statusCode').should('equal',200)
})

Cypress.Commands.add('loginAPI',(email, password) => { 
  cy.session([email, password], () => {
    cy.request({
      method: 'POST',
      url: 'api/users/login',
      body: {user:{email: email, password: password}}
      }).then((response) => {
        expect(response.status).to.be.eq(200)
        const storage = {
          headers:{
          Authorization:'Token '+ response.body.user.token},
          isAuth:true,
          loggedUser: response.body.user                       
        }
        window.localStorage.setItem('loggedUser', JSON.stringify(storage));
      }).as('postLoginAPI');
  })
})

Cypress.Commands.add('fillArticle',(title, description, text, tag = null) => { 
  cy.get(articleElement.inputTitleArticle)
    .type(title)
    .should('be.visible')
    .and('have.attr', 'required')

  cy.get(articleElement.inputDescriptionArticle)
    .type(description)
    .should('be.visible')
    .and('have.attr', 'required')

  cy.get(articleElement.inputTextArticle).type(text)
    .should('be.visible').and('have.attr', 'required')

    if(tag){
      cy.get(articleElement.inputTagArticle)
        .type(tag)
        .should('be.visible')
        .and('not.have.attr', 'required')
    }
})

Cypress.Commands.add('publishArticle',() => { 
  cy.get(articleElement.btnPublish)
    .should('be.visible')
    .and('have.attr', 'type', 'submit')
    .click();
})

Cypress.Commands.add('accessProfile',() => { 
  cy.get(loginElement.profileIcon).click().then(() => {
    cy.get(loginElement.profileMenu)
      .children()
      .eq(0)
      .click();             
  });   
})

Cypress.Commands.add('postArticleAPI',(article, loggedUser) => {      
  cy.request({
    method: 'POST',
    url: 'api/articles',
    headers: loggedUser.headers,
    body: article
  }).then((response) => {
    expect(response.status).to.be.eq(201)
  }).as('article')
})

Cypress.Commands.add('createRandomArticle',() => { 
  return {
    article:{
      body: faker.lorem.sentence(2),
      description: faker.lorem.sentence(),
      tagList: '',
      tag: faker.lorem.word(4),
      title: faker.lorem.sentence(3) 
    }
  }
})

Cypress.Commands.add('accessRecentArticle',() => { 
  cy.get('div.row').find('div.article-preview').eq(0).find('h1').click().then(() => {
    cy.get('@article').then((list) => {
      cy.contains(list.body.article.title)
    })
  })
})