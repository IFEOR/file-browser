export const mockDisplayingSwitcherRequests = () => {
    cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/filesDisplayingTesting/resources.json'}).as('resources');
}