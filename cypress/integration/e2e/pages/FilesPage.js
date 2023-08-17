class FilesPage {

    visit() {
        cy.visit('/files')
    }

    getLogOutButton() {
        return cy.get('#logout')
    }

    logOutButtonClick() {
        cy.get('#logout').click()
    }
}

export default new FilesPage()