Cypress.Commands.add('signIn', (username, password) => {
    Cypress.log({
        command: 'signIn',
        message: `Выполнение входа с логином: ${username} и паролем: ${password}`
    })
    cy.get('[type="text"]').type(`${username}`)
    cy.get('[type="password"]').type(`${password}`)
    cy.get('[type="submit"]').click()
    cy.wait('@login')
})

Cypress.Commands.add('logOut', () => {
    Cypress.log({
        command: 'logOut',
        message: 'Попытка выхода из аккаунта'
    })
    cy.get('#logout').click()
})