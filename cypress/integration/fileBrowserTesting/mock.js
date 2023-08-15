export const mockRequests = () => {
    cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/searchFieldTesting/resourcesEmpty.json'}).as('resources');
    cy.intercept('GET', '**/usage/', {fixture: 'fileBrowserTesting/searchFieldTesting/usage.json'}).as('usage');
    cy.intercept('POST', '**/login').as('login');
}