import {mockRequests} from '../mock'
import {mockMainActionsRequests} from './mock'

describe('Тестирование удаления файлов', function () {

    beforeEach(function () {
        cy.visit('/')
        mockRequests()
        mockMainActionsRequests()
        cy.signIn('kitova', '1');
    })

    function primaryWaiting() {
        cy.wait('@resources')
        cy.wait('@usage')
    }

    it('Проверка удаления файла', () => {

        // Перехватчики
        primaryWaiting()
        cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/filesMainActionsTesting/resourcesEmpty.json'}).as('resources')
        cy.intercept('DELETE', '**/kitova', {statusCode: 200 }).as('kitova')

        // Выбор удаления
        cy.get('[aria-label="kitova"]').click()
        cy.get('#delete-button').should('be.exist').and('be.visible').click()

        // Подтверждение удаления
        cy.get('.card-action > [aria-label="Удалить"]').should('be.exist').and('be.visible').click()

        // Дожидаемся запросов
        cy.wait('@kitova')
        cy.wait('@resources')

        // Проверяем, что документ удалился
        cy.get('[aria-label="kitova"]').should('not.be.exist')
    })

    it.only('Проверка, что файл не удаляется, если отменить удаление', () => {

        // Перехватчики
        primaryWaiting()

        // Выбор удаления
        cy.get('[aria-label="kitova"]').click()
        cy.get('#delete-button').should('be.exist').and('be.visible').click()

        // Отменяем удаление
        cy.get('.card-action > [aria-label="Отмена"]').should('be.exist').and('be.visible').click()

        // Проверяем, что запросы не отправляются
        cy.intercept({url: '**/resources/'}, (req) => {
             throw new Error('Caught unexpected request ' + req.url)
        }).as('unexpectedRequest')
        cy.intercept({url: '**/kitova'}, (req) => {
             throw new Error('Caught unexpected request ' + req.url)
        }).as('unexpectedRequest')

        // Проверяем, что документ не удалился
        cy.get('[aria-label="kitova"]').should('be.exist')
    })
})