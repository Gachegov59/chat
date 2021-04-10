// ПРОСЛОЙКА между model и view
window.Controller = {
    chat: {
        chat: document.querySelector('.chat'),
        popups: document.querySelectorAll('.popup'),
        ava: document.querySelector('.js-change-ava'),
        popupPhoto: document.querySelector('.js-popup-photo'),
        menuBtn: document.querySelector('.js-menu-btn'),
        menu: document.querySelector('.js-menu'),
        inputName: document.querySelector('.js-user-name'),
        inputNickName: document.querySelector('.js-user-nickName'),
        panelUserName: document.querySelector('.js-panel-userName'),
        btnEnterGoogle: document.querySelector('.js-enter-google'),

        text: document.querySelector('.js-text'),
        usersQuantity: 0,
        messagesArr: []
    },
    name: localStorage.getItem('name'),
    nickName: localStorage.getItem('nickName'),  //todo  проверять уникальность т.к используетсяь в id
    uid: localStorage.getItem('uid'),
    avatar: localStorage.getItem('ava'),
    // id: '', //todo полумать как сделать реактивным
    id: localStorage.getItem('uid') || localStorage.getItem('nickName'),

    async renderMessages() {
       if(Controller.checkAuth()) {
           console.log('renderMessages')
           console.log(this.id)
           const messages = await Model.getMessages()
           const results = document.querySelector('#results');

           this.chat.messagesArr = {list: []}
           for (let item in messages) {
               this.chat.messagesArr.list.push({
                   key: item,
                   name: messages[item].name,
                   id: messages[item].id === this.id,
                   ava: messages[item].ava,
                   messages: messages[item].messages
               })
           }
           // console.log(this.chat.messagesArr.list)
           results.innerHTML = View.render('#messages', Controller.chat.messagesArr);
           View.autoscroll()
       }
    },
    sendMessage() {
        console.log('sendMessage')
        this.id = localStorage.getItem('uid') || localStorage.getItem('nickName')
        this.name = localStorage.getItem('name')

        let emptyMessage = false

        let text = this.chat.text.value
            .replace(/<(?!br\s*\/?)[^>]+>/g, '')
            .replace(/\n/g, ' <br/>')
            .split(" ")
            .filter(function (value, index, arr) {
                return value === '<br/>' ? value !== arr[index + 1] : value
            }).join(" ")  // УБИРАЕМ ПОВТОРЕНИЕ <br/> ПОДРЯД
        if (text.split(' ')[0] === "<br/>") {     //ОСТАВЛЯЕМ ТОЛЬКО ПРЕОБРАЗОВАНИЕ ПЕРЕНОСА В <BR>
            emptyMessage = true
        }

        if (this.chat.text.value && this.chat.text.value !== '\n' && !emptyMessage) {
            let messageList = this.chat.messagesArr.list
            let date = new Date()
            let minutes = date.getMinutes()
            let time = date.getHours() + ':' + (minutes < 10 ? 0 + '' + minutes : minutes)
            let message = {
                name: this.name,
                id: this.id,
                ava: this.avatar,
                messages: [[text, time]]
            }
            console.log(message)
            if (!Controller.checkAuth()) {
                Controller.checkAuth()
            } else {
                // ЕСЛИ СООБЩЕНИЕ USER'S ПОВТОРЯЕТЬСЯ -> ОБЪЕДЕНЯЕТ В ГРУППУ
                if (messageList.length > 0 && messageList[messageList.length - 1].id) {
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

    async userAuth() {
        const auth = await Model.userEnterGoogle()
        const name = auth.user.displayName
        const uid = auth.user.uid
        localStorage.setItem('name', name)
        localStorage.setItem('nickName', null)
        localStorage.setItem('uid', auth.user.uid)
        localStorage.setItem('ava', auth.user.photoURL)

        this.id = uid
        View.userAuthUpdateUI(name)
        Controller.renderMessages()
        if (name) {
            View.popupClose(this.chat.popups, this.chat.chat)
        }
    },
    userEnter(e, click) {
        let validName = false
        let validNickName = false
        let newInputName = this.chat.inputName.value
        let newInputNickName = this.chat.inputNickName.value

        if (e.target.className.match('js-user-name') || click) {      //todo: рефакторинг
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
            localStorage.setItem('name', newInputName)
            localStorage.setItem('nickName', newInputNickName)

            Model.addUser(newInputName, newInputNickName)
            View.popupClose(this.chat.popups, this.chat.chat)

            this.id = newInputNickName
            this.nickName = newInputName
            View.userAuthUpdateUI(newInputNickName)
            Controller.renderMessages()
        }
    },
    checkAuth() {
        if (!(localStorage.getItem('nickName') || localStorage.getItem('uid'))) {
            View.auth(this.chat.chat)
        }
        if (this.avatar) {
            // console.log( this.chat.ava)
            // console.log( this.avatar)
            this.chat.ava.style.background = `url(${this.avatar})`
            this.chat.ava.style.backgroundSize = `cover`
            this.chat.ava.classList.add('_ava')
        }
        this.chat.panelUserName.innerHTML = Controller.name
        return localStorage.getItem('name')
    },

    eventsListener() {
        document.addEventListener('click', (e) => {
            e.preventDefault()
            let className = e.target.className
            let action = e.target.closest("*[data-action]")
            let overlay = e.target.className.match('overlay')

            if (e.target.dataset.action === 'true' || action || overlay) {
                if (className.match('js-close') && Controller.checkAuth()) {
                    View.popupClose(this.chat.popups, this.chat.chat)
                }
                if (className.match('js-menu-btn')) {
                    View.menuToggle(this.chat.menuBtn, this.chat.menu)
                }
                if (className.match('js-enter')) {
                    Controller.userEnter(e, true)
                }
                if (className.match('js-auth-google')) {
                    Controller.userAuth(e)
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

        document.addEventListener("keyup", (e) => {
            if (e.keyCode == 27 && Controller.checkAuth()) {
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
        //
        // window.addEventListener('storage', (e) => {
        //     console.log(e)
        //     console.log(123123)
        // })
    },
    checkedIncoming() {
        Model.listenerNewMessages()
    },
}

