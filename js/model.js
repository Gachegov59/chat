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
        return new Promise(function (resolve, reject) { //todo: firebase.js удалить
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

    addUserInFB(name, id, avatar) {
        // console.log('addUserInFB')
        firebase.database().ref('users').push().set({
            name: name,
            active: true,
            id: id,
            avatar: avatar,
        });
    },
    listenerNewMessages() {
        firebase.database().ref('chat').on('child_added', function (snapshot) {
            Controller.renderMessages()
        })
        firebase.database().ref('chat').on('child_changed', function (snapshot) {
            Controller.renderMessages()
        })
    },
    addUser(newInputName, newInputNickName) {
        firebase.database().ref('users').push().set({
            name: newInputName, nickName: newInputNickName
        });
        View.addUser()
        // return
    },

    async userEnterGoogle() {
        // const firestore = firebase.firestore();

        const provider = new firebase.auth.GoogleAuthProvider()
        const auth = firebase.auth();
        return await auth.signInWithPopup(provider)
    }
}
