var config = {
    apiKey: codes.apiKey,
    authDomain: codes.authDomain,
    databaseURL: codes.databaseURL,
    projectId: codes.projectId,
    storageBucket: codes.storageBucket,
    messagingSenderId: codes.messagingSenderId
}
firebase.initializeApp(config)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Register loaded')

    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const name = document.getElementById('name')

    const submit = document.getElementById('submit')

    submit.onclick = () => {
        submit.disabled = true
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((user) => {
            console.log(user)
            firebase.database().ref().child('Users').push({
                'Name': name.value,
                'Email': email.value
            })
            window.location = 'project.html'
        })
        .catch((err) => {
            console.log(err.message)
            submit.disabled = false
        })
    }
})
