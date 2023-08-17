import {mockRequests} from '../mock'
import {mockMainActionsRequests} from './mock'

describe('Тестирование копирования файлов', function () {

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

    it('Проверка копирования файла', () => {

        // Перехватчики
        primaryWaiting()
        cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/filesMainActionsTesting/resourcesCopy.json'}).as('resources');

        // Выбор копирования
        cy.get('[aria-label="kitova"]').click()
        cy.get('#copy-button').should('be.exist').and('be.visible').click()

        // Подтверждение копирования
        cy.get('[aria-label="Копировать"]').should('be.exist').and('be.visible').click()

        // Дожидаемся запроса
        cy.wait('@resources')

        // Проверяем, что документ скопировался
        cy.get('[aria-label="kitova(1) - копия"]').should('be.exist').and('be.visible')

        // Возвращаем состояние страницы (удаляем скопированный файл)
        cy.get('[aria-label="kitova(1) - копия"]').click()
        cy.get('#delete-button').click()
        cy.get('.card-action > [aria-label="Удалить"]').click()
    })
})