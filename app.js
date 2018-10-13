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
    
    const signInButton = document.getElementById('sign-in-button')
    const signUpbutton = document.getElementById('sign-up-button')
    const signUpInput = document.getElementById('sign-up-input')

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

    const trainingSection = document.getElementById('training-section')
    const dataCollectionSection = document.getElementById('data-collection-section')
    const deploymentSection = document.getElementById('deployment-section')

    const copybutton = document.getElementById('copy-button')

    const responsiveSignInButton = document.getElementById('responsive-sign-in')

    $.fn.isInViewport = function(el) {
        var elementTop = $(this).offset().top + 200;
        var elementBottom = elementTop + $(this).outerHeight() + 200;
      
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
      
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    var dataCollectionCard = new ClassDisplay()
    dataCollectionCard.displayClassCard(dataCollectionSection)
    dataCollectionCard.typeClassLabel()

    var trainingCard = new DeploymentCard('21 Sept 18', 'My Model', 'Classification', 'www.mlblocks.com/XXXXXXXX', 'Inactive', false, 2)
    trainingCard.addModel(trainingSection)
    $(window).on('resize scroll', () => {
        if ($('#training-section').isInViewport()) {
            trainingCard.trainingInit(true)
        } else {
            trainingCard.trainingInit(false)
        }
    })

    var deploymentCard = new DeploymentCard('21 Sept 18', 'My Model', 'Classification', 'www.mlblocks.com/XXXXXXXX', 'Inactive', false, 2)
    deploymentCard.addModel(deploymentSection)
    deploymentCard.handleDeployment()
    $(window).on('resize scroll', () => {
        if ($('#deployment-section').isInViewport()) {
            deploymentCard.handleDeployment(true)
        } else {
            deploymentCard.handleDeployment(false)
        }
    })

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

    responsiveSignInButton.onclick = () => {
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
            window.location = 'project.html'
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
            window.location = 'project.html'
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

    copybutton.onclick = () => {
        const el = document.createElement('textarea')
        el.value = "import requests\nimport numpy as np\nfrom PIL import Image\n\nimg = Image.open('my_img.jpg')\n\nurl = 'mlblocks.com/XXXXXXXX/predict'\noptions  = {\n\tdata: img,\n\tapi_key: ACCESS_TOKEN\n}\n\nprediction = requests.get(url, data=options)"
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        var msg = new MessageCard('Copied to clipboard!')
        msg.addMessage()
    }
})