// ПОЛУЧЕНИЕ ДАННЫХ

// import {getDataFB} from "./firebase.js";
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
            // chat.on('value', (snapshot) => { todo: проверить
            chat.on('value', (snapshot) => {
                if (snapshot) {
                    resolve(snapshot.val())
                } else {
                    reject( new Error(snapshot))
                }
            });
        })
    },
    sendMessageInFB(message) {
        // console.log('writeUserData')
        firebase.database().ref('chat').push().set(message);
    },
    updateMessageInFB(messageKey, messages) {
        firebase.database().ref('chat/' +messageKey).update({
            messages
        });
        Controller.renderMessages()
    },

    // addUserInFB(message) {
    //     firebase.database().ref('users').push().set(message);
    // },
    listenerNewMessages() {
        firebase.database().ref('chat').on('child_added', function (snapshot){
            // console.log(snapshot.val())
            Controller.renderMessages()
        })
    }
}
