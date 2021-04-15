// ПОЛУЧЕНИЕ ДАННЫХ
// import {getDataFB} from "./firebase.js";
// import firebase from "./libs/firebase.js";
var firebaseConfig = {
    apiKey: "AIzaSyBKtblQjVE44WBQpkVNcgSPOeUmX-d2TCc",
    authDomain: "chat-60286.firebaseapp.com",
    projectId: "chat-60286",
    storageBucket: "chat-60286.appspot.com",
    messagingSenderId: "596111941401",
    appId: "1:596111941401:web:b71996b30b8b65dec0af88",
    measurementId: "G-T7M5T4Q1J7"
};
firebase.initializeApp(firebaseConfig);

window.Model = {
    async getMessages() {
        return new Promise(function (resolve, reject) {
            const bd = firebase.database();
            const chat = bd.ref('chat');

            chat.once('value', (snapshot) => {
                if (snapshot) {
                    resolve(snapshot.val())
                    // console.log('getMessages',snapshot.val())
                } else {
                    reject(new Error(snapshot))
                }
            });
        })
    },
    async getUsers() {
        return new Promise(function (resolve, reject) { //todo: firebase.js удалить
            const bd = firebase.database();
            const chat = bd.ref('users');
            chat.once('value', (snapshot) => {

                if (snapshot) {
                    resolve(snapshot.val())
                    // console.log('getUsers',snapshot.val())
                } else {
                    reject(new Error(snapshot))
                }
            });
        })
    },
    sendMessageInFB(message) {
        // console.log('writeUserData')
        firebase.database().ref('chat').push().set(message);
    },
    updateMessageInFB(messageKey, messages) {
        firebase.database().ref('chat/' + messageKey).update({
            messages
        });
        Controller.renderMessages()
    },
    listenerNewMessages() {
        firebase.database().ref('chat').on('child_added', function (snapshot) {
            // View.soundMessage()
            Controller.renderMessages()
        })
        firebase.database().ref('chat').on('child_changed', function (snapshot) {
            // console.log('child_changed')
            // console.log('snapshot', snapshot.val().id)
            if (snapshot.val().id !== Controller.id) {
                View.soundMessage()
            }

            Controller.renderMessages()
        })
    },
    listenerNewUsers() {
        firebase.database().ref('users').on('child_added', function (snapshot) {
            // console.log('child_added')
            Controller.renderUsers()

        })
        firebase.database().ref('users').on('child_changed', function (snapshot) {
            // console.log('child_changed')
            Controller.renderUsers()
            Controller.renderMessages()

        })
        firebase.database().ref('users').on('child_removed', function (snapshot) {
            // console.log('child_removed')
            // console.log('snapshot.val().id', snapshot.val().id)
            // console.log('Controller.id', Controller.id)
            Controller.renderUsers()
            if (snapshot.val().id === Controller.id) {
                Controller.userExit(true)
            }
        })
    },
    addUserInFB(name, id, avatar) {
        let key = firebase.database().ref().child('users').push().key;
        // console.log('key', key)
        firebase.database().ref('users/' + key).update({
            name: name,
            active: true,
            id: id,
            avatar: avatar,
            lastMessage: ''
        })
        Controller.userKey = key
        localStorage.setItem('userKey', key)
    },
    async userEnterGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        const auth = firebase.auth();
        return await auth.signInWithPopup(provider)
    },
    async userEnterVK() {
        VK.init({
            apiId: 7822786
        })
        return new Promise((res, rej) => {
            VK.Auth.login(data => {

                if (data.session) {
                    // console.log(data)
                    res(data);
                } else {
                    // console.log(data)
                    rej(new Error('не удалось авторизоватсья'))
                }
            }, 2)
        })
    },
    async userDelete(userKey) {
        firebase.database().ref('users/' + userKey).remove()
        await firebase.database().ref('users/' + userKey).onDisconnect().cancel();
    },
    async vkAPI(method, params) {
        params.v = '5.76';
        return new Promise((res, rej) => {
            VK.api(method, params, (data) => {
                if (data.error) {
                    rej(data.error);
                } else {
                    res(data.response)
                }
            })
        })
    },
    async statusDisConnect(name, id, avatar, userKey) {
        let presenceRef = firebase.database().ref('users/' + userKey + '/');
        await presenceRef.onDisconnect().update({
            active: false,
        })
    },
    async statusConnect(name, id, avatar, key) {
        let promise = new Promise(function (resolve, reject) {
            var connectedRef = firebase.database().ref(".info/connected");
            connectedRef.on("value", (snap) => {
                if (snap.val() === true) {
                    resolve(snap.val())
                    firebase.database().ref('users/' + key).update({
                        name: name,
                        active: true,
                        id: id,
                        avatar: avatar,
                    })
                    Controller.renderMessages()
                } else {
                }
            });
        })
    },
    setStatus(name, id, avatar, key) {
        firebase.database().ref('users/' + key).update({
            name: name,
            active: true,
            id: id,
            avatar: avatar,
        })
        Controller.renderMessages()
    },
    sendUserLastMessage(text, userKey) {
        firebase.database().ref('users/' + userKey + '/').update({
            lastMessage: text
        });
    }

};
