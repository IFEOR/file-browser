import {mockRequests} from '../mock'
import {mockDisplayingSwitcherRequests} from './mock'

describe('Тестирование переключения способов отображения файлов', function () {

    beforeEach(function () {
        cy.visit('/')
        mockRequests()
        mockDisplayingSwitcherRequests()
        cy.signIn('kitova', '1');
    })

    function primaryWaiting() {
        cy.wait('@resources')
        cy.wait('@usage')
    }

    const displayModes = [
        {
            'label': 'список',
            'json': 'list.json',
            'container': 'list',
            'icon': 'view_list'
        },
        {
            'label': 'сетку',
            'json': 'mosaic.json',
            'container': 'mosaic',
            'icon': 'grid_view'
        },
        {
            'label': 'галерею объектов',
            'json': 'mosaicGallery.json',
            'container': 'mosaic gallery',
            'icon': 'view_module'
        }
    ]

    displayModes.forEach((mode) => {
        it(`Проверка переключения отображения на ${mode.label}`, () => {

            // Перехватчики
            primaryWaiting()
            cy.intercept('PUT', '*api/users/4', {statusCode: 200, fixture: 'fileBrowserTesting/filesDisplayingTesting/' + mode.json}).as('users');

            // Клик по кнопке переключения отображения
            cy.get('[aria-label="Вид"]').click()

            // Перехват запроса
            cy.wait('@users')

            // Проверка класса контейнера документов
            cy.get('#listing').should('have.class', mode.container)

            // Проверка иконки
            cy.get('button[aria-label="Вид"]').within(() => {
                cy.get('i[class="material-icons"]').should('contain', mode.icon)
            })
        })
    })
})