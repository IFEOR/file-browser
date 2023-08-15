export const mockSearchRequests = () => {
    cy.intercept('GET', '**/search/**', {fixture: 'fileBrowserTesting/searchFieldTesting/search.json'}).as('search');
}