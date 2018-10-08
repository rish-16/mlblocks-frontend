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
    console.log('Dashboard loaded')

    const DBref = firebase.database().ref()
    let userID = null

    var dataBlockChosen = null
    var DATATYPES = ['Images', 'Text', 'Audio']
    var classObjects = []
    var classIDarray = []

    var allModels = []

    const logoutButton = document.getElementById('logout-button')
    const createModelButton = document.getElementById('create-project-button')
    const modelContainer = document.getElementById('workbench-cards-container')

    const newProjectModal = document.getElementById('new-project-modal')
    const newProjectTitle = document.getElementById('project-title')
    const imageBlock = document.getElementById('images')
    const textBlock = document.getElementById('text')
    const audioBlock = document.getElementById('audio')
    const addClassButton = document.getElementById('add-class-button')
    const saveProjectButton = document.getElementById('save-project-button')
    const cancelButton = document.getElementById('cancel-button')
    const tdcContainer = document.getElementById('training-data-container')
    const tdcContainerClassCards = document.getElementById('training-data-container-classcards')

    function loadProjects(param, userID) {
        if (userID) {
            DBref.child('Projects').child(userID).once(param, (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((projectID) => {
                        var data = projectID.val()
                        var title = data['TITLE']
                        var status = data['STATUS']
                        var trainingStatus = data['TRAINED']
                        var type = data['TYPE']
                        var doc = data['DOC']
                        var url = data['RESTURL']
                        var classes = data['CLASSES']
                        var pID = data['ID']
    
                        var distribution =  Object.values(classes)
                        var classLabels = Object.keys(classes)
                        var numClasses = classLabels.length
            
                        var card = new ModelCard(doc, userID, pID, title, type, url, status, trainingStatus, numClasses, classLabels, distribution)
                        card.addModel(modelContainer)
                        allModels.push(card)
                    })                    
                } else {
                    console.log('No projects')
                    showEmptyDB()
                }
            })  
        } else {
            console.log('No user logged in.')
        }
    }

    function showEmptyDB() {
        if (allModels.length == 0) {
            var img = document.createElement('img')
            img.src = 'images/emptydb.png'
            img.style.height = '300px'
            img.style.margin = '0 auto'
    
            var txt = document.createElement('p')
            txt.innerHTML = "You haven\'t created any projects yet!<br>Click <strong>Create Project</strong> to begin."
            txt.style.fontSize = '15px'
            txt.style.lineHeight = '25px'
            txt.style.color = 'gray'
            txt.style.padding = '15px'
            modelContainer.style.flexDirection = 'column'
    
            var div = document.createElement('div')
            div.style.margin = '0 auto'
            div.style.textAlign = 'center'
    
            div.appendChild(img)
            div.appendChild(txt)
            modelContainer.appendChild(div)
        } else {
            
        }
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userID = firebase.auth().currentUser.uid
            console.log(userID)
            loadProjects('value', userID)
        } else {
            // No user is signed in.
            console.log('No user has signed in.')
        }
    })

    logoutButton.onclick = () => {
        var conf = window.confirm('Are you sure you want to log out?')
        if (conf) {
            var task = firebase.auth().signOut()
            task.then(() => {
                console.log('Logout successful')
                window.location = 'index.html'
            })
            task.catch((error) => {
                console.log(error)
            })
        }
    }

    createModelButton.onclick = () => {
        newProjectModal.style.display = 'block'
    }

    imageBlock.onclick = () => {
        imageBlock.style.opacity = '1'
        textBlock.style.opacity = '0.5'
        audioBlock.style.opacity = '0.5'
        dataBlockChosen = 0
    }

    // Coming soon
    textBlock.onclick = () => {
        var msg = new MessageCard('Coming soon!')
        msg.addMessage()
        imageBlock.style.opacity = '1'
        dataBlockChosen = 0
    }

    // Coming soon
    audioBlock.onclick = () => {
        var msg = new MessageCard('Coming soon!')
        msg.addMessage()
        imageBlock.style.opacity = '1'
        dataBlockChosen = 0
    }

    addClassButton.onclick = () => {
        var card = new ClassCard()
        card.addClassCard(tdcContainerClassCards, classIDarray, classObjects)
        classObjects.push(card)
    }

    saveProjectButton.onclick = () => {
        // Check if all information has been updated
        if (newProjectTitle.value.length > 1 && dataBlockChosen != null && classObjects.length > 0) {
            var ID = makeURL()
            var status = 'Inactive'
            var trained = false
            var type = 'Classification'
            var url = 'www.mlblocks.com/' + ID
            var title = newProjectTitle.value
            var dataUsed = DATATYPES[dataBlockChosen]
    
            var classes = []
            var trainingData = []
    
            // Send project details to Database and Storage containers
            for (var i = 0; i < classObjects.length; i++) {
                var currentCard = classObjects[i]
                classes.push(currentCard.label)
                trainingData.push(currentCard.selectedFiles)
            }
    
            var project = new Project(ID, userID, title, type, url, dataUsed, classes, status, trained, trainingData)
            project.handleUpload()
    
            // Close modal and load new project into dashboard
            newProjectTitle.value = ''
            dataBlockChosen = 0
            classObjects = []
            imageBlock.style.opacity = '1.0'
            textBlock.style.opacity = '1.0'
            audioBlock.style.opacity = '1.0'
            newProjectModal.style.display = 'none'
            tdcContainerClassCards.innerHTML = ''
            modelContainer.innerHTML = ''
            loadProjects('value', userID)
            var msg = new MessageCard('Project successfully saved!')
            msg.addMessage()
        } else {
            var msg = new MessageCard('Please fill in the relevant project details.')
            msg.addMessage()
        }
    }

    cancelButton.onclick = () => {
        var task = window.confirm('Are you sure you want to scrap this project? This cannot be undone.')
        if (task) {
            newProjectTitle.value = ''
            dataBlockChosen = 0
            classObjects = []
            imageBlock.style.opacity = '1.0'
            textBlock.style.opacity = '1.0'
            audioBlock.style.opacity = '1.0'
            tdcContainerClassCards.innerHTML = ''
            newProjectModal.style.display = 'none'
        }
    }

    function makeURL() {
        var URL = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 8; i++) {
            URL += possible.charAt(Math.floor(Math.random() * possible.length))
        }
      
        return URL;
    }

})