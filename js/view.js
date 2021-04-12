// ОТОБРАЖЕНИЕ ДАННЫХ

window.View = {
    chatHistory: document.querySelector('.chat__history'),
    usersQuantityDiv: document.querySelector('.js-users-quantity'),
    render(templateName, model) {
        templateName = templateName + 'Template';
        console.log(templateName)
        const templateElement = document.querySelector(templateName).textContent
        // console.log(templateElement) //todo: хешировать? долго грузит
        const renderFn = Handlebars.compile(templateElement);
        // console.log('render')
        return renderFn(model);

    },
    autoscroll(){
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    },
    auth(chat) {
        chat.classList.add('overlay')
        document.querySelector('.auth.popup').classList.add('_open')
    },
    closeAll(chat, menuBtn, menu, popups) {
        chat.classList.remove('overlay')
        menuBtn.classList.remove('_open')
        menu.classList.remove('_open')
        this.popupClose(popups, chat)
    },
    usersShowAva(){

    },
    userAuthUpdateUI(name, avatar) {
        Controller.chat.panelUserName.innerHTML = name
        if(Controller.chat.avatar) {
            Controller.chat.ava.style.background = `url(${avatar})`
            Controller.chat.ava.style.backgroundSize = `cover`
            Controller.chat.ava.classList.add('_ava')
        }

    },
    popupClose(popups, chat) {
        chat.classList.remove('overlay')
        popups.forEach(item => item.classList.remove('_open'))
    },
    menuToggle(menuBtn, menu) {
        menuBtn.classList.toggle('_open')
        menu.classList.toggle('_open')
    },
    formValid() {

    },
    usersQuantity(active) {
        this.usersQuantityDiv.innerHTML = 'Участников: ' + active
    }
}

