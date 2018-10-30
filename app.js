var config = {
    apiKey: codes.apiKey,
    authDomain: codes.authDomain,
    databaseURL: codes.databaseURL,
    projectId: codes.projectId,
    storageBucket: codes.storageBucket,
    messagingSenderId: codes.messagingSenderId
};
firebase.initializeApp(config);

document.addEventListener('DOMContentLoaded', () => {
    console.log('Add loaded')
    mixpanel.track('Site visit')

    var DBref = firebase.database().ref()

    const header = document.getElementById('header')
    
    const signInButton = document.getElementById('login-button')
    const signUpbutton = document.getElementById('sign-up-button')

    const loginModal = document.getElementById('login-box')
    const registerModal = document.getElementById('register-box')

    const loginModalEmail = document.getElementById('sign-in-email')
    const loginModalPwd = document.getElementById('sign-in-pwd')

    const registerModalName = document.getElementById('sign-up-name')
    const registerModalEmail = document.getElementById('sign-up-email')
    const registerModalPwd = document.getElementById('sign-up-pwd')

    const loginModalSubmit = document.getElementById('sign-in-submit')
    const registerModalSubmit = document.getElementById('sign-up-submit')

    const loginRegisterButton = document.getElementById('login-register-button')
    const registerLoginButton = document.getElementById('register-login-button')

    const loginModalClose = document.getElementById('close-login-modal')
    const registerModalClose = document.getElementById('close-register-modal')

    const heroTitleSpan = document.getElementById('hero-title-span')

    const containerEmail= document.getElementById('sign-up-container-email')
    const containerSubmit = document.getElementById('sign-up-container-submit')

    const copybutton = document.getElementById('copy-button')

    signUpbutton.onclick = () => {
        if (validateEmail(signUpInput.value)) {
            registerModal.style.display = 'block'
            registerModalEmail.value = signUpInput.value
        } else {
            var msg = new MessageCard("Oops! That doesn't look like an email...")
            msg.addMessage()
        }
    }

    signInButton.onclick = () => {
        mixpanel.track('User sign in clicked')
        loginModal.style.display = 'block'
    }

    loginRegisterButton.onclick = () => {
        loginModal.style.display = 'none'
        registerModal.style.display = 'block'
    }

    registerLoginButton.onclick = () => {
        loginModal.style.display = 'block'
        registerModal.style.display = 'none'
    }

    window.onscroll = (e) => {
        if ($(window).scrollTop() != 0) {
            header.style.backgroundColor = 'white'
            header.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.1)'
        } else {
            header.style.background = 'none'
            header.style.boxShadow = 'none'
        }
    }

    containerSubmit.onclick = () => {
        if (validateEmail(containerEmail.value)) {
            document.body.scrollTop = document.documentElement.scrollTop = 0
            registerModal.style.display = 'block'
            registerModalEmail.value = containerEmail.value
            containerEmail.value = ''
        } else {
            var msg = new MessageCard("Oops! That doesn't look like an email...")
            msg.addMessage()
        }
    }

    registerModalSubmit.onclick = () => {
        mixpanel.track('User submitted register info')
        var promise = firebase.auth().createUserWithEmailAndPassword(registerModalEmail.value, registerModalPwd.value)
        promise.catch((err) => {
            console.log(err.message)
            var msg = new MessageCard(err.message)
            msg.addMessage()
        })
        promise.then((user) => {
            console.log(user)
            var randomID = makeID()
            DBref.child('Users').child(randomID).set({
                'name': registerModalName.value,
                'userID': randomID,
                'email': registerModalEmail.value,
                'pwd': registerModalPwd.value
            })
            window.location = 'comingsoon.html'
        })
    }

    loginModalSubmit.onclick = () => {
        mixpanel.track('User logging in')
        var promise = firebase.auth().signInWithEmailAndPassword(loginModalEmail.value, loginModalPwd.value)
        promise.catch((err) => {
            console.log(err.message)
            var msg = new MessageCard(err.message.split('.')[0] + '!')
            msg.addMessage()
        })
        promise.then((user) => {
            console.log(user)
            window.location = 'comingsoon.html'
        })
    }

    loginModalClose.onclick = () => {
        mixpanel.track('User closed login')
        loginModal.style.display = 'none'
    }

    registerModalClose.onclick = () => {
        mixpanel.track('User closed registration')
        registerModal.style.display = 'none'
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function makeID() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 16; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }

    var typewriter = new Typewriter(heroTitleSpan, {
		loop: false,
        typingSpeed: 100
	})

    typewriter.typeString('Simplified.').start()
})