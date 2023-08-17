import LoginPage from '../pages/LoginPage'
import FilesPage from '../pages/FilesPage'

describe('Тестирование выхода из сервиса', () => {
    beforeEach(() => {
        cy.intercept('POST', '**/login').as('login');
        LoginPage.visit();
    })

    it('Тестирование выхода из сервиса с по кнопке "Выйти" с предварительным входом', () => {

        // Проверка поля ввода имени пользователя
        LoginPage.getUsernameField().should('be.exist').and('be.visible')

        // Проверка поля ввода пароля
        LoginPage.getPasswordField().should('be.exist').and('be.visible')

        // Проверка кнопки входа
        LoginPage.getSubmitButton().should('be.exist').and('be.visible')

        // Ввод имени пользователя
        LoginPage.typeUsername('kitova')

        // Ввод пароля
        LoginPage.typePassword('1')

        // Нажатие на кнопку входа
        LoginPage.submitButtonClick()

        // Ожидание входа
        cy.wait('@login')

        // Проверка адреса страницы
        cy.url().should('eq', 'http://51.250.1.158:49153/files/')

        // Проверка кнопки выхода
        FilesPage.getLogOutButton().should('be.exist').and('be.visible').and('have.css', 'text-align', 'left')

        // Нажатие на кнопку выхода
        FilesPage.logOutButtonClick()

        // Проверка адреса страницы
        cy.url().should('eq', 'http://51.250.1.158:49153/login')
    })
})