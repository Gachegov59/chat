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
        usersArr: JSON.parse(localStorage.getItem('usersArr')),
        usersInFB: JSON.parse(localStorage.getItem('usersInFB'))
    },

    name: localStorage.getItem('name'),
    nickName: localStorage.getItem('nickName'),
    uid: localStorage.getItem('uid'),
    userKey: localStorage.getItem('userKey'),
    avatar: localStorage.getItem('ava'),
    auth: !!(localStorage.getItem('uid') || localStorage.getItem('nickName')),
    id: localStorage.getItem('uid') || localStorage.getItem('nickName'),

    async renderUsers() {
        let users = await Model.getUsers()
        const usersList = document.querySelector('#users');
        let active = 0
        let usersArr = {listUsers: []}

        this.chat.usersArr = usersArr
        this.chat.usersInFB = users

        for (let item in users) {
            usersArr.listUsers.push({
                key: users[item].id === this.id ? item : false, //todo: костыль
                name: users[item].name,
                active: users[item].active,
                id: users[item].id === this.id,
                avatar: users[item].avatar === '' ? false : users[item].avatar,
                lastMessage: users[item].lastMessage
            })
            // let userKey = users[item].id === this.id ? item : false; //todo: костыль
            // console.log('users', users)
            active++;

        }

        localStorage.setItem('usersInFB', JSON.stringify(users))
        localStorage.setItem('usersArr', JSON.stringify(usersArr))

        View.usersQuantity(active)
        if (this.auth) {
            usersList.innerHTML = View.render('#users', usersArr);
        } else {
            if (users === null) {
                // console.log('null')
                usersList.innerHTML = View.render('#users', usersArr);
            }
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
                    ava: messages[item].ava === null ? false : messages[item].ava,
                    messages: messages[item].messages
                });
            }
            // console.log('this.chat.messagesArr.list', this.chat.messagesArr.list)
            // console.log(messages)
            results.innerHTML = View.render('#messages', Controller.chat.messagesArr);
            View.autoscroll()
        }
    },
    async status() {
        if (this.auth) {
            Model.statusConnect(this.name, this.uid, this.avatar, this.userKey)
        }
    },
    async statusDisConnect() {
        if (this.auth) {
            Model.statusDisConnect(this.name, this.uid, this.avatar, this.userKey)
        }
    },
    async userAuth(to) {
        let name, id, avatar
        if (to === 'google') {
            const auth = await Model.userEnterGoogle()

            name = auth.user.displayName
            id = auth.user.uid
            avatar = auth.user.photoURL
        }
        if (to === 'vk') {
            const auth = await Model.userEnterVK()
            const api = await Model.vkAPI('users.get', {fields: 'photo_200'})
            const user = auth.session.user
            name = user.first_name
            id = user.id
            avatar = api[0].photo_200
        }

        this.id = id
        this.avatar = avatar
        this.auth = true

        localStorage.setItem('name', name)
        localStorage.setItem('nickName', null)
        localStorage.setItem('uid', id)
        localStorage.setItem('ava', avatar)


        if (name) {
            View.userAuthUpdateUI(name, avatar)
            View.popupClose(this.chat.popups, this.chat.chat)
        }
        View.userAuthUpdateUI(name, avatar)

        let haveInFb = true
        let keyFromFb

        for (let user in this.chat.usersInFB) {
            if (this.chat.usersInFB[user].id === this.id) {
                // console.log(this.chat.usersInFB[user].id === this.id)
                keyFromFb = user
                haveInFb = false
            }
        }
        // console.log('haveInFb', haveInFb)
        if (haveInFb) {
            Model.addUserInFB(name, id, avatar)
        } else {
            // console.log('нет')
            // console.log('this.key = keyFromFb')
            this.userKey = keyFromFb
            localStorage.setItem('userKey', keyFromFb)
        }

        Controller.renderUsers()
        Controller.renderMessages()

    },
    checkAuth() {

        if (!(localStorage.getItem('nickName') || localStorage.getItem('uid'))) {
            View.auth(this.chat.chat)
        }
        View.userAuthUpdateUI(Controller.name, this.avatar)
        return localStorage.getItem('name')
    },
    userEnter(e, click) {
        let validName = false
        let validNickName = false
        let name = this.chat.inputName.value
        let nickName = this.chat.inputNickName.value
        let newNickName = true

        for (let user in this.chat.usersInFB) {
            // console.log(this.chat.usersInFB[user].id === nickName)
            if (this.chat.usersInFB[user].id === nickName) {
                console.log(this.chat.usersInFB[user].id === nickName)
                newNickName = false
            }
        }


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

            if (this.chat.inputNickName.value.length > 1 && newNickName) {
                validNickName = true
                this.chat.inputNickName.parentNode.classList.add('_isValid')
                this.chat.inputNickName.parentNode.classList.remove('_isNoValid')
            } else {
                this.chat.inputNickName.parentNode.classList.add('_isNoValid')
                this.chat.inputNickName.parentNode.classList.remove('_isValid')
            }
        }

        if (validName && validNickName && newNickName) {
            console.log(validName)
            console.log(validNickName)
            console.log(newNickName)
            localStorage.setItem('name', name)
            localStorage.setItem('nickName', nickName)
            localStorage.setItem('id', nickName)
            localStorage.setItem('ava', '')

            View.popupClose(this.chat.popups, this.chat.chat)
            Model.addUserInFB(name, nickName, false)
            View.userAuthUpdateUI(name, '')

            this.id = nickName
            this.nickName = nickName
            this.avatar = false
            this.auth = true
            Controller.renderUsers()
            Controller.renderMessages()

        }
    },
    sendMessage() {
        this.id = localStorage.getItem('uid') || localStorage.getItem('nickName')
        this.name = localStorage.getItem('name')

        let emptyMessage = false
        let text = this.chat.text.value
            // .replace(/<(?!br\s*\/?)[^>]+>/g, '')
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/\n/g, ' <br/>')
            .split(" ")
            // УБИРАЕМ ПОВТОРЕНИЕ <br/> ПОДРЯД
            .filter(function (value, index, arr) {
                return value === '<br/>' ? value !== arr[index + 1] : value
            }).join(" ")
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
            Model.sendUserLastMessage(text.replace('<br/>', ''), this.userKey)
        }
        document.querySelector('.js-text').value = '';
    },
    userExit() {
        localStorage.removeItem('name')
        localStorage.removeItem('nickName')
        localStorage.removeItem('id')
        localStorage.removeItem('uid')
        localStorage.removeItem('ava')
        localStorage.removeItem('usersInFB')
        localStorage.removeItem('usersArr')
        localStorage.removeItem('userKey')


        View.popupClose(this.chat.popups, this.chat.chat)
        View.userRemoveUI(name, '')

        this.id = ''
        this.nickName = ''
        this.avatar = false
        this.auth = false
        Model.userDelete(this.userKey)
        View.auth(this.chat.chat)
        Controller.renderUsers()
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
                    Controller.userAuth('google')
                }
                if (className.match('js-auth-vk')) {
                    Controller.userAuth('vk')
                }
                if (className.match('js-panel-exit')) {
                    Controller.userExit()
                }
                if (className.match('js-send')) {
                    // Controller.sendMessage(e, this.chat.localName, this.chat.localNickName, this.chat.text, chat)
                    Controller.sendMessage()
                }
                if (className.match('js-change-ava')) {
                    // this.chat.popupPhoto.classList.add('_open')
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
        Model.listenerNewUsers()
    }
}

