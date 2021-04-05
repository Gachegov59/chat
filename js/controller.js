// ПРОСЛОЙКА между model и view

window.Controller = {
    chat: {
        chat: document.querySelector('.chat'),
        popups: document.querySelectorAll('.popup'),
        popupPhoto: document.querySelector('.js-popup-photo'),
        menuBtn: document.querySelector('.js-menu-btn'),
        menu: document.querySelector('.js-menu'),
        inputName: document.querySelector('.js-user-name'),
        inputNickName: document.querySelector('.js-user-nickName'),
    },
    name: localStorage.getItem('name'),
    nickName: localStorage.getItem('nickName'),
    text: document.querySelector('.js-text'),
    avatar: '',

    async renderMessages() {
        let chatHistory = document.querySelector('.chat__history')

        const messages = await Model.getMessages()
        const results = document.querySelector('#results');

        let messagesArr = {list: []}
        for (let item in messages) {
            console.log(this.nickName, messages[item].userNickName)
            messagesArr.list.push({
                key: item,
                name: messages[item].name,
                nickName: messages[item].userNickName === this.nickName ? messages[item].userNickName : false,

                text: messages[item].text.replace(/\n/g, '<br/>')
            })
        }
        console.log('arr', messagesArr)
        results.innerHTML = View.render('#messages', messagesArr);
        chatHistory.scrollTop = 9999;
    },
    updateMessages() {
        this.renderMessages()
        console.log(212111321)
    },
    sendMessage(e, at) {
        let tet = document.querySelector('.js-text')
        if (this.text.value) {
            let text = this.text.value.replace('w', 'foobar\nw')
            let now = new Date()
            let message = {
                name: this.name,
                userNickName: this.nickName,
                text: this.text.value,
                time: now.getHours() + ':' + now.getMinutes(),
                // image:
            }
            console.log(message)
            if (!Controller.checkAuth(this.chat.chat)) {
                Controller.checkAuth(this.chat.chat)
            } else {
                Model.sendMessageInFB(message)
            }
        }
        document.querySelector('.js-text').value = '';

    },
    userEnter(e, click) {
        //todo: рефакторинг
        let panelUserName = document.querySelector('.js-panel-userName')
        let validName = false
        let validNickName = false

        if (e.target.className.match('js-user-name') || click) {
            if (this.chat.inputName.value.length > 1) {
                validName = true
                this.chat.inputName.parentNode.classList.add('_isValid')
                this.chat.inputName.parentNode.classList.remove('_isNoValid')
            } else {
                this.chat.inputName.parentNode.classList.add('_isNoValid')
                this.chat.inputName.parentNode.classList.remove('_isValid')
            }
        }

        if (e.target.className.match('js-user-nickName') || click) {
            if (this.chat.inputNickName.value.length > 1) {
                validNickName = true
                this.chat.inputNickName.parentNode.classList.add('_isValid')
                this.chat.inputNickName.parentNode.classList.remove('_isNoValid')
            } else {
                this.chat.inputNickName.parentNode.classList.add('_isNoValid')
                this.chat.inputNickName.parentNode.classList.remove('_isValid')
            }
        }

        if (validName && validNickName) {
            localStorage.setItem('name', this.chat.inputName.value)
            localStorage.setItem('nickName', this.chat.inputNickName.value)
            panelUserName.innerHTML = this.chat.inputName.value
            View.popupClose(this.chat.popups, this.chat.chat)
        }
    },
    checkedIncoming() {
        Model.listenerNewMessages()
    },
    checkAuth() {
        if (!localStorage.getItem('name')) {
            View.auth(this.chat.chat)
        }
        return localStorage.getItem('name')
    },
    eventsListener() {
        document.addEventListener('click', (e) => {
            e.preventDefault()
            let className = e.target.className
            let action = e.target.closest("*[data-action]")
            let overlay = e.target.className.match('overlay')

            if (e.target.dataset.action === 'true' || action || overlay) {
                if (className.match('js-close')) {
                    View.popupClose(this.chat.popups, this.chat.chat)
                }
                if (className.match('js-menu-btn')) {
                    View.menuToggle(this.chat.menuBtn, this.chat.menu)
                }
                if (className.match('js-enter')) {
                    Controller.userEnter(e, true)
                }
                if (className.match('js-send')) {
                    // Controller.sendMessage(e, this.chat.localName, this.chat.localNickName, this.chat.text, chat)
                    Controller.sendMessage()
                }
                if (className.match('js-change-ava')) {
                    this.chat.popupPhoto.classList.add('_open')
                }

            } else {
                View.closeAll(this.chat.chat, this.chat.menuBtn, this.chat.menu, this.chat.popups)
            }
        })

        window.addEventListener("keyup", function (e) {
            if (e.keyCode == 27) {
                View.closeAll(this.chat.chat, this.chat.menuBtn, this.chat.menu, this.chat.popups)
            }

            if (e.target.localName === 'input') {
                Controller.userEnter(e)
            }

            // if ((e.key === 'Control' || e.key === 'Enter') && e.ctrlKey){
            if (e.ctrlKey && (e.keyCode === 13 || e.keyCode === 10)) {
                Controller.sendMessage()
            }
        });
    },
}

