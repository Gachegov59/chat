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
        messagesArr: []
    },
    name: localStorage.getItem('name'),
    nickName: localStorage.getItem('nickName'),
    text: document.querySelector('.js-text'),
    avatar: '',

    async renderMessages() {

        let chatHistory = document.querySelector('.chat__history')
        const messages = await Model.getMessages()
        const results = document.querySelector('#results');

        this.chat.messagesArr = {list: []}
        for (let item in messages) {
            this.chat.messagesArr.list.push({
                key: item,
                name: messages[item].name,
                nickName: messages[item].userNickName === this.nickName,
                messages: messages[item].messages
            })
        }

        results.innerHTML = View.render('#messages', Controller.chat.messagesArr);
        chatHistory.scrollTop = 99999; //todo костыл с запасом
    },
    sendMessage() {

        let emptyMessage = false

        let text = this.text.value.replace(/<(?!br\s*\/?)[^>]+>/g, '')
            .replace(/\n/g, ' <br/>')
            // УБИРАЕМ ПОВТОРЕНИЕ <br/> ПОДРЯД
            .split(" ").filter(function (value, index, arr) {
                return value === '<br/>' ? value !== arr[index + 1] : value
            }).join(" ")
        //ОСТАВЛЯЕМ ТОЛЬКО ПРЕОБРАЗОВАНИЕ ПЕРЕНОСА В <BR>
        if (text.split(' ')[0] === "<br/>") {
            emptyMessage = true
        }

        if (this.text.value && this.text.value !== '\n' && !emptyMessage) {
            let messageList = this.chat.messagesArr.list
            let date = new Date()
            let minutes = date.getMinutes()
            let time = date.getHours() + ':' + (minutes < 10 ? 0 + '' + minutes : minutes)
            let message = {
                name: this.name,
                userNickName: this.nickName,
                messages: [[text, time]]
            }

            if (!Controller.checkAuth(this.chat.chat)) {
                Controller.checkAuth(this.chat.chat)
            } else {
                // ЕСЛИ СООБЩЕНИЕ USER'S ПОВТОРЯЕТЬСЯ -> ОБЪЕДЕНЯЕТ В ГРУППУ
                if (messageList.length > 0 && messageList[messageList.length - 1].nickName) {
                    let lastMessage = messageList[messageList.length - 1].messages
                    let messageKey = messageList[messageList.length - 1].key

                    lastMessage.push([text, time])
                    Model.updateMessageInFB(messageKey, lastMessage)

                } else {
                    Model.sendMessageInFB(message)
                }
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
            // console.log(Controller.name)
            panelUserName.innerHTML = Controller.name
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

        document.addEventListener("keyup", function (e) {
            if (e.keyCode == 27) {
                View.closeAll(Controller.chat.chat, Controller.chat.menuBtn, Controller.chat.menu, Controller.chat.popups)
            }

            if (e.target.localName === 'input') {
                Controller.userEnter(e)
            }

            // if ((e.key === 'Control' || e.key === 'Enter') && e.ctrlKey){
            // if (e.ctrlKey && (e.keyCode === 13 || e.keyCode === 10)) {
            //     Controller.sendMessage()
            // }

            if (!e.shiftKey && !e.ctrlKey && (e.keyCode === 13 || e.keyCode === 10)) {
                Controller.sendMessage()
            }
        });
    },
}

