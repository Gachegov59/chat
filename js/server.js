/*eslint-disable */
export let firebaseConfig = {
    apiKey: 'AIzaSyC1L6hDvbdT6pplHXkKQDPsgTv8oF2h-3o',
    authDomain: 'ymap-review.firebaseapp.com',
    databaseURL: 'https://ymap-review-default-rtdb.firebaseio.com',
    projectId: 'ymap-review',
    storageBucket: 'ymap-review.appspot.com',
    messagingSenderId: '233303430202',
    appId: '1:233303430202:web:d1740f8a615de825909103',
    measurementId: 'G-M6SV40QQ08'
};


export let marksFB

export let getDataFB = new Promise(function (resolve, reject) {
    firebase.initializeApp(firebaseConfig);
    const bd = firebase.database();
    const marks = bd.ref('marks');

    marks.on('value', (elem) => {
        if (elem) {
            resolve(elem.val())
        } else {
            reject( new Error(elem))
        }

    });
})

