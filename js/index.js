/*eslint-disable */
// console.log(localStorage.getItem('name'))

if (!localStorage.getItem('name')) {
    document.querySelector('.auth.popup').classList.add('_open')
}

document.addEventListener('DOMContentLoaded', () => {
    let popups = document.querySelectorAll('.popup')
    let chat = document.querySelector('.chat')
    let popupPhoto = document.querySelector('.js-popup-photo')

    let menuBtn = document.querySelector('.js-menu-btn')
    let menu = document.querySelector('.js-menu')


    let localName = localStorage.getItem('name')
    let localNickName = localStorage.getItem('nickName')


    Controller.checkedIncoming()
    Controller.renderMessages()
    // .then(console.log(1))


    document.addEventListener('click', (e) => {
        e.preventDefault()
        let className = e.target.className
        let action = e.target.closest("*[data-action]")
        // console.log(e)
        // console.log(action)
        if (e.target.dataset.action === 'true' || action) {

            if (className.match('js-close')) {
                chat.classList.remove('overlay')
                closePopups()
            }

            if (className.match('js-menu-btn')) {
                menuBtn.classList.toggle('_open')
                menu.classList.toggle('_open')
            }

            if (className.match('js-enter')) {
                let name = document.querySelector('.js-user-name').value
                let nickName = document.querySelector('.js-user-nickName').value
                Controller.userEnter(e, name, nickName)
                closePopups()
            }


            if (className.match('js-send')) {
                let text = document.querySelector('.js-text').value
                if (text) {
                    console.log('send')
                    Controller.sendMessage(e, localName, localNickName, text)
                    document.querySelector('.js-text').value  = '';
                }

            }

            className.match('js-change-ava') ? popupPhoto.classList.add('_open') : false

        } else {
            closeAll()
        }

    })
    let chat__name = document.querySelector('.chat__name')
    chat__name.addEventListener('click', ()=> {
        Controller.updateMessages()

    })

    window.addEventListener("keyup", function (e) {
        if (e.keyCode == 27) {
            closeAll()
        }
    });

    function closeAll() {
        chat.classList.remove('overlay')
        menuBtn.classList.remove('_open')
        menu.classList.remove('_open')
        closePopups()
    }

    function closePopups() {
        popups.forEach(item => item.classList.remove('_open'))
    }

    function scrollDown() {
        // setInterval(function() {
        //     chatHistory.scrollTop = 9999;
        //
        // }, 100);
    }

    scrollDown()


    // let popupsClose = document.querySelectorAll('.js-close')
    // let openPopupPhoto = document.querySelector('.js-change-ava')
    // let sendMessage = document.querySelector('.js-send')
    // let login = document.querySelector('.js-enter')

    // popupsClose.forEach(item => item.addEventListener('click', () => {
    //     popups.forEach(item => item.classList.remove('_open'))
    //     chat.classList.remove('overlay')
    // }))

    // login.addEventListener('click', (e) => Controller.userEnter(e, name, nickName))
    // openPopupPhoto.addEventListener('click', (e) => popupPhoto.classList.add('_open'))
    // sendMessage.addEventListener('click', (e) => Controller.sendMessage(e, userName, userNickName))
    // menuBtn.addEventListener('click', (e) => {
    //     menuBtn.classList.toggle('_open')
    //     menu.classList.toggle('_open')
    // })
})