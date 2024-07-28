const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    defaultEmail: 'email@email.com',
    defaultPassword: '123456',
    defaultName: 'test'
  },
  e2e: {
    baseUrl: 'https://conduit-realworld-example-app.fly.dev',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
