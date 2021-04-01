// ПРОСЛОЙКА между model и view

window.Controller = {
    async renderMessages() {
        let chatHistory = document.querySelector('.chat__history')
        const messages = await Model.getMessages()
        // const messages = Model.listenerNewMessages()
        const results = document.querySelector('#results');
        // console.log(messages)
        let arr = {list: []}
        for (let item in messages) {
            arr.list.push(messages[item])
        }

        results.innerHTML = View.render('#messages', arr);

        chatHistory.scrollTop = 9999;

    },
    updateMessages() {
        this.renderMessages()
        console.log(212111321)
    },
    sendMessage(e, userName, userNickName, text) {

        let now = new Date()
        let message = {
            name: userName,
            userNickName: userNickName,
            text: text,
            time: now.getHours() + ':' + now.getMinutes(),
            // image:
        }

        Model.sendMessageInFB(message)
    },
    userEnter(e, name, nickName) {
        localStorage.setItem('name', name)
        localStorage.setItem('nickName', nickName)
        // console.log(name, nickName)
    },
    checkedIncoming() {
        Model.listenerNewMessages()
    }
}

