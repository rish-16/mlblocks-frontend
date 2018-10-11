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

    var DBref = firebase.database().ref()
    
    const signInButton = document.getElementById('sign-in-button')

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

    var dataCollectionCard = new ClassDisplay()
    dataCollectionCard.displayClassCard(dataCollectionSection)
    dataCollectionCard.typeClassLabel()

    var trainingCard = new DeploymentCard('21 Sept 18', 'My Model', 'Classification', 'www.mlblocks.com/XXXXXXXX', 'Inactive', false, 2)
    trainingCard.addModel(trainingSection)
    trainingCard.trainingInit()

    var deploymentCard = new DeploymentCard('21 Sept 18', 'My Model', 'Classification', 'www.mlblocks.com/XXXXXXXX', 'Inactive', false, 2)
    deploymentCard.addModel(deploymentSection)
    deploymentCard.handleDeployment()

    signInButton.onclick = () => {
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
        var promise = firebase.auth().createUserWithEmailAndPassword(registerModalEmail.value, registerModalPwd.value)
        promise.catch((err) => {
            console.log(err.message)
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
        var promise = firebase.auth().signInWithEmailAndPassword(loginModalEmail.value, loginModalPwd.value)
        promise.catch((err) => {
            console.log(err.message)
        })
        promise.then((user) => {
            console.log(user)
            window.location = 'comingsoon.html'
        })
    }

    loginModalClose.onclick = () => {
        loginModal.style.display = 'none'
    }

    registerModalClose.onclick = () => {
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