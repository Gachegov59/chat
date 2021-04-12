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
        messagesArr: [],
        usersArr: []
    },
    name: localStorage.getItem('name'),
    nickName: localStorage.getItem('nickName'),  //todo  проверять уникальность т.к используетсяь в id
    uid: localStorage.getItem('uid'),
    avatar: localStorage.getItem('ava'),
    auth: !!(localStorage.getItem('uid') || localStorage.getItem('nickName')),
    // id: '', //todo полумать как сделать реактивным
    id: localStorage.getItem('uid') || localStorage.getItem('nickName'),
    async renderUsers() {
        if (this.auth) {
            const users = await Model.getUsers()
            // console.log(users)
            const usersList = document.querySelector('#users');
            let active = 0
            this.chat.usersArr = {listUsers: []}
            // console.log('users', users)
            for (let item in users) {
                this.chat.usersArr.listUsers.push({
                    name: users[item].name,
                    active: users[item].active,
                    id: users[item].id === this.id,
                    avatar: users[item].avatar,
                })
            }
            // console.log('usersArr', this.chat.usersArr  )
            for (let user in users) {
                if (users[user].active === true) {
                    active++;
                }
            }

            View.usersQuantity(active)
            usersList.innerHTML = View.render('#users', Controller.chat.usersArr);
        }
    },
    async renderMessages() {
        if (this.auth) {
            const messages = await Model.getMessages()
            const results = document.querySelector('#results');

            this.chat.messagesArr = {list: []} //todo: обнуление костыл?
            for (let item in messages) {
                this.chat.messagesArr.list.push({
                    key: item,
                    name: messages[item].name,
                    id: messages[item].id === this.id,
                    ava: messages[item].ava === null ? false: messages[item].ava,
                    messages: messages[item].messages
                });
            }

            // console.log(this.chat.messagesArr.list)
            // console.log(messages)
            results.innerHTML = View.render('#messages', Controller.chat.messagesArr);
            View.autoscroll()
        }
    },

    sendMessage() {
        // console.log('sendMessage')
        this.id = localStorage.getItem('uid') || localStorage.getItem('nickName')
        this.name = localStorage.getItem('name')

        let emptyMessage = false

        let text = this.chat.text.value
            // .replace(/<(?!br\s*\/?)[^>]+>/g, '')
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/\n/g, ' <br/>')
            .split(" ")
            .filter(function (value, index, arr) {
                return value === '<br/>' ? value !== arr[index + 1] : value
            }).join(" ")  // УБИРАЕМ ПОВТОРЕНИЕ <br/> ПОДРЯД
        if (text.split(' ')[0] === "<br/>" || text.split(' ')[0] === '<br>') {     //ОСТАВЛЯЕМ ТОЛЬКО ПРЕОБРАЗОВАНИЕ ПЕРЕНОСА В <BR>
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
            // console.log(message)
            if (!this.auth) {
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
        const avatar = auth.user.photoURL

        this.id = uid
        this.avatar = avatar
        this.auth = true

        localStorage.setItem('name', name)
        localStorage.setItem('nickName', null)
        localStorage.setItem('uid', uid)
        localStorage.setItem('ava', avatar)

        View.userAuthUpdateUI(name)
        Controller.renderUsers()
        Controller.renderMessages()

        if (name) {
            View.userAuthUpdateUI(name, avatar)
            Model.addUserInFB(name, uid, avatar)
            View.popupClose(this.chat.popups, this.chat.chat)
        }
    },
    userEnter(e, click) {
        let validName = false
        let validNickName = false

        let name = this.chat.inputName.value
        let nickName = this.chat.inputNickName.value

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
            localStorage.setItem('name', name)
            localStorage.setItem('nickName', nickName)
            localStorage.setItem('id', nickName)
            localStorage.setItem('ava', null)
            console.log('nickName',nickName)

            View.popupClose(this.chat.popups, this.chat.chat)
            Model.addUserInFB(name, nickName, false)
            View.userAuthUpdateUI(name, false)

            this.id = name
            this.nickName = nickName
            this.auth = true
            Controller.renderMessages()

        }
    },
    checkAuth() {
        if (!(localStorage.getItem('nickName') || localStorage.getItem('uid'))) {
            View.auth(this.chat.chat)
        }
        View.userAuthUpdateUI(Controller.name, this.avatar)
        return localStorage.getItem('name')
    },

    eventsListener() {
        document.addEventListener('click', (e) => {
            e.preventDefault()
            let className = e.target.className
            let action = e.target.closest("*[data-action]")
            let overlay = e.target.className.match('overlay')

            if (e.target.dataset.action === 'true' || action || overlay) {
                if (className.match('js-close') && this.auth) {
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
            if (e.keyCode == 27 && this.auth) {
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
    checkedIncoming() {
        Model.listenerNewMessages()
        // Model.listenerNewUsers()
    },
}

