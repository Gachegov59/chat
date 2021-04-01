// /*eslint-disable */
//
//     // Your web app's Firebase configuration
//     // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//     var firebaseConfig = {
//     apiKey: "AIzaSyBKtblQjVE44WBQpkVNcgSPOeUmX-d2TCc",
//     authDomain: "chat-60286.firebaseapp.com",
//     projectId: "chat-60286",
//     storageBucket: "chat-60286.appspot.com",
//     messagingSenderId: "596111941401",
//     appId: "1:596111941401:web:b71996b30b8b65dec0af88",
//     measurementId: "G-T7M5T4Q1J7"
// };
//
// export let getDataFB = new Promise(function (resolve, reject) {
//     firebase.initializeApp(firebaseConfig);
//     const bd = firebase.database();
//     const chat = bd.ref('chat');
//
//     chat.on('value', (snapshot) => {
//         if (snapshot) {
//             resolve(snapshot.val())
//         } else {
//             reject( new Error(snapshot))
//         }
//
//     });
// })
//
