import { ELEMENTS } from './elements'

class Editor {
  fillArticleForm (title, description, text, tag) {
    cy.get(ELEMENTS.inputTitleArticle).type(title).as('titleArticle')
    cy.get(ELEMENTS.inputDescriptionArticle).type(description)
    cy.get(ELEMENTS.inputTextArticle).type(text)
    cy.get(ELEMENTS.inputTagArticle).type(tag)
  }

  publishArticle () {
    return cy.get(ELEMENTS.btnPublish)
      .should('be.visible')
      .and('have.attr', 'type', 'submit')
      .click()
  }
}

export default new Editor()