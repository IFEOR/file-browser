class LoginPage {

    visit() {
        cy.visit('/login')
    }

    getUsernameField() {
        return cy.get('[type="text"]')
    }

    getPasswordField() {
        return cy.get('[type="password"]')
    }

    getSubmitButton() {
        return cy.get('[type="submit"]')
    }

    typeUsername(username) {
        cy.get('[type="text"]').type(username)
    }

    typePassword(password) {
        cy.get('[type="password"]').type(password)
    }

    submitButtonClick() {
        cy.get('[type="submit"]').click()
    }
}

export default new LoginPage()