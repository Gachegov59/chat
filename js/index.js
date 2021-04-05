/*eslint-disable */
document.addEventListener('DOMContentLoaded', () => {
    // let chat = document.querySelector('.chat')

    Controller.checkAuth()
    Controller.checkedIncoming()
    Controller.renderMessages()
    // .then(console.log(1))
    Controller.eventsListener()

})