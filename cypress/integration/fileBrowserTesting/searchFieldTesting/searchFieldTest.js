import spok from 'cy-spok'
import {mockRequests} from '../mock'
import {mockSearchRequests} from './mock'

describe('Тестирование поисковой строки', function () {

    beforeEach(function () {
        cy.visit('/')
        mockRequests()
        mockSearchRequests()
        cy.signIn('admin', 'admin');
    })

    function primaryWaiting() {
        cy.wait('@resources')
        cy.wait('@usage')
    }

    it('Проверка правильной передачи строки через параметры', () => {

        primaryWaiting()

        cy.get('input[type="text"]').type('kitova{enter}')
        cy.wait('@search').its('request.url').should('include', 'query=kitova')
    })

    it('Проверка результатов поиска', () => {

        primaryWaiting()

        cy.get('input[type="text"]').type('kitova{enter}')
        cy.wait('@search')
        cy.get('a[href="/files/kitova/"]').should('have.text', 'folder./kitova')
        cy.get('a[href="/files/kitova/kitova"]').should('have.text', 'insert_drive_file./kitova/kitova')
        cy.get('a[href="/files/kitova/"] > :nth-child(1)').should('have.text', 'folder')
        cy.get('a[href="/files/kitova/kitova"] > :nth-child(1)').should('have.text', 'insert_drive_file')
    })

    it('Проверка, что при передаче пустой строки запрос не передается', () => {
        cy.intercept({url: '**/search/**'}, (req) => { //отлов нежелательных запросов
            throw new Error('Caught unexpected request ' + req.url)
        }).as('unexpectedRequest')

        primaryWaiting()

        cy.get('input[type="text"]').type('{enter}')
    })

    const testData = [
        {
            'value': 'Images',
            'query': 'image'
        },
        {
            'value': 'Music',
            'query': 'audio'
        },
        {
            'value': 'Video',
            'query': 'video'
        },
        {
            'value': 'PDF',
            'query': 'pdf'
        }
    ]

    testData.forEach((type) => {
        it('Проверка предлагаемых результатов с типом ' + type.value, () => {

            primaryWaiting()

            cy.get('input[type="text"]').click()
            cy.get('[aria-label="' + type.value + '"]').click()
            cy.get('input[type="text"]').type('{enter}')
            cy.wait('@search').its('request.url').should('include', 'query=type%3A' + type.query + '%20')
        });
    })

    it('Проверка правильной отправки запроса', () => {
        cy.get('@login').its('request.body').should(
            spok(Cypress._.cloneDeep(        {
            'username':'admin',
            'password':'admin',
            'recaptcha':''
    })))
    })
})