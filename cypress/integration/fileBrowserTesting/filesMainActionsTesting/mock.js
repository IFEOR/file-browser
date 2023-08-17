export const mockMainActionsRequests = () => {
    cy.intercept('GET', '**/resources/', {fixture: 'fileBrowserTesting/filesMainActionsTesting/resources.json'}).as('resources');
}