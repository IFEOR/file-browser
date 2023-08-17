export const mockSearchRequests = () => {
    cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/searchFieldTesting/resourcesEmpty.json'}).as('resources');
    cy.intercept('GET', '**/search/**', {fixture: 'fileBrowserTesting/searchFieldTesting/search.json'}).as('search');
}