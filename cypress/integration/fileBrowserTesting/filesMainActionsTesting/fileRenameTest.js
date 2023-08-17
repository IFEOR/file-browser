import {mockRequests} from '../mock'
import {mockMainActionsRequests} from './mock'

describe('Тестирование переименования файлов', function () {

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

    it('Проверка переименовывания файла', () => {

        // Перехватчики
        primaryWaiting()
        cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/filesMainActionsTesting/resourcesRename.json'}).as('resources');
        cy.intercept('PATCH', '**kitova**', {
            statusCode: 200,
            body: "action=rename&destination=%2Fname&override=false&rename=false"
        }).as('kitova')

        // Выбор переименования
        cy.get('[aria-label="kitova"]').click()
        cy.get('[aria-label="Переименовать"]').should('be.exist').and('be.visible').click()

        // Переименовываем
        cy.get('.input').type('- новое имя')
        cy.get('[type="submit"]').should('be.exist').and('be.visible').click()

        // Дожидаемся запросов
        cy.wait('@kitova')
        cy.wait('@resources')

        // Проверяем, что документ переименовался
        cy.get('[aria-label="name"]').should('be.exist').and('be.visible')
    })

    it('Проверка, что нельзя поменять имя файла на пустую строку', () => {

        // Перехватчики
        primaryWaiting()
        cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/filesMainActionsTesting/resourcesRename.json'}).as('resources');

        // Выбор переименования
        cy.get('[aria-label="kitova"]').click()
        cy.get('[aria-label="Переименовать"]').should('be.exist').and('be.visible').click()

        // Переименовываем
        cy.get('.input').type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}')
        cy.get('[type="submit"]').should('be.exist').and('be.visible').click()

        // Проверяем, что запрос не приходит
        cy.intercept({url: '**/resources/'}, (req) => {
            throw new Error('Caught unexpected request ' + req.url)
        }).as('unexpectedRequest')

        // Проверяем, что документ не переименовался
        cy.get('[aria-label="kitova"]').should('be.exist').and('be.visible')

        // Проверяем, что появилась ошибка
        cy.get('.noty_body').should('be.exist').and('be.visible')
    })

    it('Проверка, что нельзя поменять имя файла на пустую строку с помощью мока', () => {

        // Перехватчики
        primaryWaiting()
        cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/filesMainActionsTesting/resourcesRenameEmpty.json'}).as('resources');
        cy.intercept('PATCH', '**kitova**', {
            statusCode: 200,
            body: "action=rename&destination=%2F&override=false&rename=false"
        }).as('kitova')

        // Выбор переименования
        cy.get('[aria-label="kitova"]').click()
        cy.get('[aria-label="Переименовать"]').should('be.exist').and('be.visible').click()

        // Переименовываем
        cy.get('[type="submit"]').should('be.exist').and('be.visible').click()

        // Дожидаемся запросов
        cy.wait('@kitova')
        cy.intercept({url: '**/resources/'}, (req) => {
            throw new Error('Caught unexpected request ' + req.url)
        }).as('unexpectedRequest')

        // Проверяем, что документ не переименовался
        cy.get('[aria-label="kitova"]').should('be.exist').and('be.visible')
    })
})