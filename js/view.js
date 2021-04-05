// ОТОБРАЖЕНИЕ ДАННЫХ

window.View = {
    render(templateName, model) {
        templateName = templateName + 'Template';

        const templateElement = document.querySelector(templateName).textContent
        const renderFn = Handlebars.compile(templateElement);
        return renderFn(model);


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
    popupClose(popups, chat) {
        chat.classList.remove('overlay')
        popups.forEach(item => item.classList.remove('_open'))
    },
    menuToggle(menuBtn, menu) {
        menuBtn.classList.toggle('_open')
        menu.classList.toggle('_open')
    },
    formValid() {

    }

}

