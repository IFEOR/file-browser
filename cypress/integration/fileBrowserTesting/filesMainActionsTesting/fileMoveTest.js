import {mockRequests} from '../mock'
import {mockMainActionsRequests} from './mock'

describe('Тестирование перемещения файлов', function () {

    beforeEach(function () {
        cy.visit('/')
        mockRequests()
        cy.intercept('**/resources/', {times: 2}, {fixture: 'fileBrowserTesting/filesMainActionsTesting/resourcesOnlyDirectory.json'}).as('resourcesOnlyDirectory');
        cy.intercept('**/resources/', {times: 1}, {fixture: 'fileBrowserTesting/filesMainActionsTesting/resourcesWithDirectory.json'}).as('resourcesWithDirectory');
        cy.signIn('kitova', '1');
    })

    function primaryWaiting() {
        cy.wait('@usage')
        cy.wait('@resourcesWithDirectory')
    }

    it('Проверка перемещения файла', () => {

        // Перехватчики
        primaryWaiting()
        cy.intercept('PATCH', '**kitova**', {
            statusCode: 200,
            body: "action=rename&destination=%2Fdirectory%2Fkitova&override=false&rename=false"
        }).as('kitova')
        cy.intercept('**/directory/', {times: 2}, {fixture: 'fileBrowserTesting/filesMainActionsTesting/directory.json'}).as('directory');
        cy.intercept('**/directory/', {times: 1}, {fixture: 'fileBrowserTesting/filesMainActionsTesting/directoryEmpty.json'}).as('directoryEmpty');

        // Выбор перемещения
        cy.get('[aria-label="kitova"]').click()
        cy.get('#move-button').should('be.exist').and('be.visible').click()

        // Проверка существования директории в списке для перемещения
        cy.get('[data-url="/files/directory/"]').should('be.exist').and('be.visible').click()

        // Подтверждение перемещения
        cy.get('[aria-label="Переместить"]').should('be.exist').and('be.visible').click()

        // Дожидаемся запроса
        cy.wait('@directoryEmpty')
        cy.wait('@kitova')
        cy.wait('@directory')

        // Проверяем, что документ переместился в директорию
        cy.get('[aria-label="kitova"]').should('be.exist').and('be.visible')
        cy.get('a[href="/files/directory/"]').should('be.exist')

        // Проверяем, что документ переместился из home директории
        cy.get('[href="/files"]').click()
        cy.wait('@resourcesOnlyDirectory')
        cy.get('[aria-label="kitova"]').should('not.be.exist')
    })
})