context('Тестирование страницы входа на сайт', () => {

    beforeEach(() => {
        cy.visit('/')
        checkElementsExist()
    })

    afterEach(() => {
        if(Cypress.currentTest.state == 'failed') cy.screenshot()
    })

    // Проверка существования полей ввода и кнопки входа
    function checkElementsExist() {
        cy.get('[type="text"]').should('be.exist')
        cy.get('[type="password"]').should('be.exist')
        cy.get('[type="submit"]').should('be.exist')
    }

    // Проверка url после входа на сайт
    function checkAfterSignInUrl() {
        cy.url().should('eq', 'http://51.250.1.158:49153/files/')
    }

    // Перевод цвета из шестнадцатеричной системы счисления в RGB
    function hexToRgb(hex) {
          const rValue = parseInt(hex.substring(1, 3), 16);
          const gValue = parseInt(hex.substring(3, 5), 16);
          const bValue = parseInt(hex.substring(5), 16);
          return `rgb(${rValue}, ${gValue}, ${bValue})`;
    }

    it('Проверка входа с существующими логином/паролем', () => {
        cy.signIn('admin', 'admin')
        checkAfterSignInUrl()
    })

    it('Проверка входа без ввода логина и пароля', () => {
        cy.get('[type="submit"]').click()
        cy.get('.wrong')
            .should('be.exist')
            .and('have.text', 'Неверные данные')
            .and('have.css', 'background-color', hexToRgb('#f44336'))
    })

    it('Проверка входа без ввода логина и пароля - после выхода', () => {
        cy.signIn('admin', 'admin')
        cy.logOut()
        cy.get('[type="submit"]').click()
        cy.get('.wrong')
            .should('be.exist')
            .and('have.text', 'Неверные данные')
            .and('have.css', 'background-color', hexToRgb('#f44336'))
    })

    it('Проверка входа с невалидным логином', () => {
        cy.signIn('login', 'admin')
        cy.get('.wrong')
            .should('be.exist')
            .and('have.text', 'Неверные данные')
            .and('have.css', 'background-color', hexToRgb('#f44336'))
    })

    it('Проверка входа с невалидным паролем', () => {
        cy.signIn('admin', 'pwd')
        cy.get('.wrong')
            .should('be.exist')
            .and('have.text', 'Неверные данные')
            .and('have.css', 'background-color', hexToRgb('#f44336'))
    })

    it('Проверка входа с моком - статусом 500', () => {

        cy.intercept('POST', 'login', '500 Internal Server Error').as('login')

        cy.signIn('admin', 'admin')
        cy.wait('@login')
        cy.get('.wrong')
            .should('be.exist')
            .and('have.text', 'Ошибка сервера, попробуйте авторизоваться позже')
            .and('have.css', 'background-color', hexToRgb('#f44336'))
    })
})