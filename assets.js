function ModelCard(DOC, userID, pID, title, type, url, status, trainingStatus, numClasses, pClasses, distribution) {
    this.DOC = DOC
    this.uID = userID
    this.pID = pID
    this.title = title
    this.type = type
    this.purl = url
    this.status = status
    this.tStatus = trainingStatus
    this.numClasses = numClasses
    this.pClasses = pClasses
    this.distribution = distribution
}

ModelCard.prototype.addModel = function(container) {
    this.card = document.createElement('div')
    this.card.classList += 'project-card'

    var cardTop = document.createElement('div')
    cardTop.classList += 'project-card-top'

    var dateNode = document.createElement('p')
    dateNode.innerHTML = this.DOC
    dateNode.classList += 'project-creation-date'

    var options = document.createElement('div')
    options.classList += 'project-top-options'

    this.optionsNodeDownload = document.createElement('i')
    this.optionsNodeDownload.innerHTML = '<i class="fas fa-file-download"></i>'
    this.optionsNodeDownload.classList += 'project-options-download'

    this.optionsNodeTS = document.createElement('i')
    this.optionsNodeTS.classList += 'project-options-toggle-status'
    if (this.status == 'Inactive') {
        this.optionsNodeTS.innerHTML = '<i class="fas fa-play"></i>'
    } else if (this.status == 'Active') {
        this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
    }

    this.optionsNodeDel = document.createElement('i')
    this.optionsNodeDel.innerHTML = '<i class="fas fa-trash-alt"></i>'
    this.optionsNodeDel.classList += 'project-options-delete'

    options.appendChild(this.optionsNodeDownload)
    options.appendChild(this.optionsNodeTS)
    options.appendChild(this.optionsNodeDel)

    this.optionsNodeDownload.onclick = () => {
        // Download H5 weights from server
        console.log('Downloading file')
    }

    this.optionsNodeTS.onclick = () => {
        this.handleDeployment()
    }

    this.optionsNodeDel.onclick = () => {
        this.handleDeletion(container)
    }

    var cardDisplay = document.createElement('div')
    cardDisplay.classList = 'model-display'

    // var cardDisplayP = document.createElement('p')
    // cardDisplayP.innerHTML = '<i class="far fa-images"></i>'

    var cardTitle = document.createElement('p')
    cardTitle.classList += 'model-title'
    cardTitle.innerText = this.title

    var cardClasses = document.createElement('p')
    cardClasses.classList += 'model-classes'
    cardClasses.innerText = 'Classes: '

    var cardClassesSpan = document.createElement('span')
    cardClassesSpan.innerText = this.numClasses
    cardClasses.appendChild(cardClassesSpan)

    var statusNode = document.createElement('div')
    statusNode.classList = 'model-status-node'

    this.cardTrainingStatus = document.createElement('p')
    this.cardTrainingStatus.classList = 'model-training-status'
    if (this.tStatus) {
        this.cardTrainingStatus.innerHTML = 'Trained'
    } else if (this.tStatus == false) {
        this.cardTrainingStatus.innerHTML = 'Untrained'
    }

    this.cardStatus = document.createElement('p')
    this.cardStatus.classList += 'model-status'
    this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
    if (this.status == 'Inactive') {
        this.cardStatus.style.color = '#ee5253'
    } else if (this.status == 'Active') {
        this.cardStatus.style.color = '#10ac84'
    }

    statusNode.appendChild(this.cardTrainingStatus)
    statusNode.appendChild(this.cardStatus)

    var cardDivider = document.createElement('div')
    cardDivider.classList += 'model-divider'

    var cardType = document.createElement('p')
    cardType.innerHTML = this.purl + ' <i class="far fa-copy"></i>'
    cardType.classList = 'model-type'

    cardType.onclick = () => {
        const el = document.createElement('textarea');
        el.value = this.purl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        var msg = new MessageCard('Copied to clipboard!')
        msg.addMessage()
    }

    cardTop.appendChild(dateNode)
    cardTop.appendChild(options)
    this.card.appendChild(cardTop)

    // cardDisplay.appendChild(cardDisplayP)
    // this.card.appendChild(cardDisplay)

    this.card.appendChild(cardTitle)
    this.card.appendChild(cardClasses)
    this.card.appendChild(statusNode)

    this.card.appendChild(cardDivider)
    this.card.appendChild(cardType)

    container.prepend(this.card)
}

ModelCard.prototype.updateLoadingBar = function() {
    var elem = document.getElementsByClassName("")[0]; 
    var width = 1;
    var id = setInterval(frame, 20);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}

ModelCard.prototype.handleDeployment = function() {
    if (this.status == 'Inactive') {
        if (this.tStatus == false) {
            var task = window.confirm('The model is untrained. Are you sure you want to deploy it?')
            if (task) {
                this.status = 'Active'
                this.cardStatus.style.color = '#10ac84'
                this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
                this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
                firebase.database().ref().child('Projects').child(this.uID).child(this.pID).child('STATUS').set('Active')
                var msg = new MessageCard('Model has been successfully deployed.')
                msg.addMessage()
            } else if (this.tStatus == true) {
                this.status = 'Active'
                this.cardStatus.style.color = '#10ac84'
                this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
                this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
                firebase.database().ref().child('Projects').child(this.uID).child(this.pID).child('STATUS').set('Active')
                var msg = new MessageCard('Model has been successfully deployed.')
                msg.addMessage()                
            }
        }
    } else if (this.status == 'Active') {
        this.status = 'Inactive'
        this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
        this.cardStatus.style.color = '#ee5253'
        this.optionsNodeTS.innerHTML = '<i class="fas fa-play"></i>'
        firebase.database().ref().child('Projects').child(this.uID).child(this.pID).child('STATUS').set('Inactive')
        var msg = new MessageCard('Model has been successfully deactivated.')
        msg.addMessage()
    }
}

ModelCard.prototype.handleDeletion = function(workspace) {
    let task
    if (this.status == 'Active') {
        task = window.confirm('Warning: The project is Live. Are you sure you want to delete the project? This cannot be undone.')
    } else {
        task = window.confirm('Are you sure you want to delete the project? This cannot be undone.')
    }
    if (task) {

        // var http = new XMLHttpRequest()
        // var url = 'http://mlblocks-env.jimcncwcc4.ap-southeast-1.elasticbeanstalk.com/' + this.pID + '/delete'
        // var url = 'http://10.180.9.33:5000' + this.pID + '/delete'

        // http.open('POST', url, true)

        // Send the proper header information along with the request
        //http.setRequestHeader('Content-type', 'multipart/form-data')
        // var formData = new FormData();
        // formData.append("userID", this.uID);

        // http.onreadystatechange = function() {
        //     // Call a function when the state changes
        //     if (http.readyState == 4 && http.status == 200) {
        //         window.alert(http.responseText)
        //     }
        // }

        // http.send(formData)

        // Delete from Database
        const ref = firebase.database().ref()
        ref.child('Projects').child(this.uID).child(this.pID).remove()

        // Delete from Storage
        const cont = firebase.storage().ref()
        for (var i = 0; i < this.distribution.length; i++) {
            for (var j = 0; j < this.distribution[i]; j++) {
                var deleteTask = cont.child('Projects').child(this.pID).child(this.pClasses[i]).child('image' + j + '.jpg').delete()
                deleteTask.then(()=> {
                    console.log('Deleting: image' + j + '.jpg from Storage')
                }, (error) => {
                    console.log(error)
                })
            }
        }

        
        workspace.removeChild(this.card)
        var msg = new MessageCard('Project successfully deleted!')
        msg.addMessage()
    }
}

ModelCard.prototype.addModelList = function(container) {
    this.card = document.createElement('div')
    this.card.classList += 'project-card-list'

    var cardTop = document.createElement('div')
    cardTop.classList += 'project-card-top'

    var dateNode = document.createElement('p')
    dateNode.innerHTML = this.DOC
    dateNode.classList += 'project-creation-date'

    var options = document.createElement('div')
    options.classList += 'project-top-options'

    this.optionsNodeDownload = document.createElement('i')
    this.optionsNodeDownload.innerHTML = '<i class="fas fa-file-download"></i>'
    this.optionsNodeDownload.classList += 'project-options-download'

    this.optionsNodeTS = document.createElement('i')
    this.optionsNodeTS.classList += 'project-options-toggle-status'
    if (this.status == 'Inactive') {
        this.optionsNodeTS.innerHTML = '<i class="fas fa-play"></i>'
    } else if (this.status == 'Active') {
        this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
    }

    this.optionsNodeDel = document.createElement('i')
    this.optionsNodeDel.innerHTML = '<i class="fas fa-trash-alt"></i>'
    this.optionsNodeDel.classList += 'project-options-delete'

    options.appendChild(this.optionsNodeDownload)
    options.appendChild(this.optionsNodeTS)
    options.appendChild(this.optionsNodeDel)

    this.optionsNodeDownload.onclick = () => {
        // Download H5 weights from server
        console.log('Downloading file')
    }

    this.optionsNodeTS.onclick = () => {
        this.handleDeployment()
    }

    this.optionsNodeDel.onclick = () => {
        this.handleDeletion(container)
    }

    var cardDisplay = document.createElement('div')
    cardDisplay.classList = 'model-display'

    var cardDisplayP = document.createElement('p')
    var matches = this.title[0].toUpperCase()
    cardDisplayP.innerText = matches

    var cardTitle = document.createElement('p')
    cardTitle.classList += 'model-title'
    cardTitle.innerText = this.title

    var cardClasses = document.createElement('p')
    cardClasses.classList += 'model-classes'
    cardClasses.innerText = 'Classes: '

    var cardClassesSpan = document.createElement('span')
    cardClassesSpan.innerText = this.numClasses
    cardClasses.appendChild(cardClassesSpan)

    var statusNode = document.createElement('div')
    statusNode.classList = 'model-status-node'

    this.cardTrainingStatus = document.createElement('p')
    this.cardTrainingStatus.classList = 'model-training-status'
    if (this.tStatus) {
        this.cardTrainingStatus.innerHTML = 'Trained'
    } else if (this.tStatus == false) {
        this.cardTrainingStatus.innerHTML = 'Untrained'
    }

    this.cardStatus = document.createElement('p')
    this.cardStatus.classList += 'model-status'
    this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
    if (this.status == 'Inactive') {
        this.cardStatus.style.color = '#ee5253'
    } else if (this.status == 'Active') {
        this.cardStatus.style.color = '#10ac84'
    }

    statusNode.appendChild(this.cardTrainingStatus)
    statusNode.appendChild(this.cardStatus)

    var cardDivider = document.createElement('div')
    cardDivider.classList += 'model-divider'

    var cardType = document.createElement('p')
    cardType.innerHTML = this.purl + ' <i class="far fa-copy"></i>'
    cardType.classList = 'model-type'

    cardType.onclick = () => {
        const el = document.createElement('textarea');
        el.value = this.purl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        var msg = new MessageCard('Copied to clipboard!')
        msg.addMessage()
    }

    cardTop.appendChild(dateNode)
    cardTop.appendChild(options)
    this.card.appendChild(cardTop)

    cardDisplay.appendChild(cardDisplayP)
    this.card.appendChild(cardDisplay)

    this.card.appendChild(cardTitle)
    this.card.appendChild(cardClasses)
    this.card.appendChild(statusNode)

    this.card.appendChild(cardDivider)
    this.card.appendChild(cardType)

    container.prepend(this.card)
}


ModelCard.prototype.handleDeployment = function() {
    if (this.status == 'Inactive') {
        if (this.tStatus == false) {
            var task = window.confirm('The model is untrained. Are you sure you want to deploy it?')
            if (task) {
                this.status = 'Active'
                this.cardStatus.style.color = '#10ac84'
                this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
                this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
                firebase.database().ref().child('Projects').child(this.uID).child(this.pID).child('STATUS').set('Active')
                var msg = new MessageCard('Model has been successfully deployed.')
                msg.addMessage()
            } else if (this.tStatus == true) {
                this.status = 'Active'
                this.cardStatus.style.color = '#10ac84'
                this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
                this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
                firebase.database().ref().child('Projects').child(this.uID).child(this.pID).child('STATUS').set('Active')
                var msg = new MessageCard('Model has been successfully deployed.')
                msg.addMessage()                
            }
        }
    } else if (this.status == 'Active') {
        this.status = 'Inactive'
        this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
        this.cardStatus.style.color = '#ee5253'
        this.optionsNodeTS.innerHTML = '<i class="fas fa-play"></i>'
        firebase.database().ref().child('Projects').child(this.uID).child(this.pID).child('STATUS').set('Inactive')
        var msg = new MessageCard('Model has been successfully deactivated.')
        msg.addMessage()
    }
}

ModelCard.prototype.handleDeletion = function(workspace) {
    let task
    if (this.status == 'Active') {
        task = window.confirm('Warning: The project is Live. Are you sure you want to delete the project? This cannot be undone.')
    } else {
        task = window.confirm('Are you sure you want to delete the project? This cannot be undone.')
    }
    if (task) {

        // var http = new XMLHttpRequest()
        // var url = 'http://mlblocks-env.jimcncwcc4.ap-southeast-1.elasticbeanstalk.com/' + this.pID + '/delete'
        // // var url = 'http://10.180.9.33:5000' + this.pID + '/delete'

        // http.open('POST', url, true)

        // // Send the proper header information along with the request
        // //http.setRequestHeader('Content-type', 'multipart/form-data')
        // var formData = new FormData();
        // formData.append("userID", this.uID);

        // http.onreadystatechange = function() {
        //     // Call a function when the state changes
        //     if (http.readyState == 4 && http.status == 200) {
        //         window.alert(http.responseText)
        //     }
        // }

        // http.send(formData)


        // Delete from Database
        const ref = firebase.database().ref()
        ref.child('Projects').child(this.uID).child(this.pID).remove()

        // Delete from Storage
        const cont = firebase.storage().ref()
        for (var i = 0; i < this.distribution.length; i++) {
            for (var j = 0; j < this.distribution[i]; j++) {
                var deleteTask = cont.child('Projects').child(this.pID).child(this.pClasses[i]).child('image' + j + '.jpg').delete()
                deleteTask.then(()=> {
                    console.log('Deleting: image' + j + '.jpg from Storage')
                }, (error) => {
                    console.log(error)
                })
            }
        }

        
        workspace.removeChild(this.card)
        var msg = new MessageCard('Project successfully deleted!')
        msg.addMessage()
    }
}
// ------------------------------------------------------------------------------------------------------------------------

function ClassCard() {
    this.label = null
    this.numInstances = 0
    this.selectedFiles = []
}

ClassCard.prototype.addClassCard = function(workspace, cardIDarray, cardObjects) {
    var card = document.createElement('div')
    card.classList += 'training-data-card'
    card.id = 'class_card_' + cardIDarray.length
    console.log(card.id)
    
    var cardTop = document.createElement('div')
    cardTop.classList += 'tdc-top'

    var cardBottom = document.createElement('div')
    cardBottom.classList += 'tdc-bottom'

    var classLabel = document.createElement('input')
    classLabel.type = 'text'
    classLabel.placeholder = 'Class label'
    classLabel.classList += 'class-label'

    classLabel.addEventListener('change', () => {
        this.label = classLabel.value
    })

    this.numInstancesNode = document.createElement('p')
    this.numInstancesNode.innerHTML = this.numInstances + ' Instances'
    this.numInstancesNode.classList += 'class-instances'

    var fileChoose = document.createElement('input')
    fileChoose.type = 'file'
    fileChoose.setAttribute('multiple', 'true')
    fileChoose.setAttribute('directory', 'true')
    fileChoose.setAttribute('webkitdirectory', 'true')
    fileChoose.classList += 'file-choose'

    var uploadButton = document.createElement('button')
    uploadButton.innerHTML = 'Upload <i class="fas fa-upload"></i>'
    uploadButton.classList += 'upload-button'

    this.deleteButton = document.createElement('button')
    this.deleteButton.innerHTML = '<i class="fas fa-times"></i>'
    this.deleteButton.classList += 'delete-button'

    this.deleteButton.addEventListener('click', () => {
        console.log('Deleting card')
        workspace.removeChild(card)
        var index = cardIDarray.indexOf(card.id);
        if (index > -1) {
            cardIDarray.splice(index, 1);
            cardObjects.splice(index, 1)
        }
        console.log(cardIDarray, cardObjects)
    })
    
    uploadButton.onclick = () => {
        fileChoose.click()
    }

    fileChoose.addEventListener('change', (evnt) => {
        let files = evnt.target.files
        let file

        this.selectedFiles = []
        for (var i= 0; i < files.length; i++) {
            file = files[i]
            this.selectedFiles.push(file)
        }

        this.numInstances = files.length
        this.numInstancesNode.innerHTML = this.numInstances + ' Instances'
    })

    cardTop.appendChild(classLabel)
    cardTop.appendChild(this.numInstancesNode)

    cardBottom.appendChild(fileChoose)
    cardBottom.appendChild(uploadButton)
    cardBottom.appendChild(this.deleteButton)

    card.appendChild(cardTop)
    card.appendChild(cardBottom)

    workspace.appendChild(card)
    cardIDarray.push(card.id)
}

// ------------------------------------------------------------------------------------------------------------------------

function Project(ID, user, title, type, url, dataUsed, classes, status, trainingStatus, trainingData) {
    this.projectID = ID
    this.projectUser = user
    this.projectTitle = title
    this.projectType = type
    this.projectURl = url
    this.projectDataTypeUsed = dataUsed
    this.projectClasses = classes
    this.projectStatus = status
    this.projectTrainingStatus = trainingStatus
    this.projectTrainingData = trainingData
    this.dateCreated = getCreationDate()
}

Project.prototype.handleUpload = function() {
    const DBref = firebase.database().ref()
    const STref = firebase.storage().ref()

    // var url = 'http://mlblocks-env.jimcncwcc4.ap-southeast-1.elasticbeanstalk.com/' + this.projectID + '/train'

    projectData = {
        'ID': this.projectID,
        'USER': this.projectUser,
        'TITLE': this.projectTitle,
        'TYPE': this.projectType,
        'RESTURL': this.projectURl,
        'DATATYPE': this.projectDataTypeUsed,
        'STATUS': this.projectStatus,
        'TRAINED': this.projectTrainingStatus,
        'DOC': this.dateCreated
    }
    DBref.child('Projects').child(this.projectUser).child(this.projectID).set(projectData)

    for (var i = 0; i < this.projectTrainingData.length; i++) {
        for (var j = 0; j < this.projectTrainingData[i].length; j++) {
            var uploadTask = STref.child('Projects').child(this.projectID).child(this.projectClasses[i]).child('image' + j + '.jpg').put(this.projectTrainingData[i][j])
            uploadTask.on('state_changed', (snapshot) => {
            }, (error) => {
                console.log(error)
            }, () => {})
        }
        DBref.child('Projects').child(this.projectUser).child(this.projectID).child('CLASSES').child(this.projectClasses[i]).set(this.projectTrainingData[i].length)
    }

    var url = 'http://127.0.0.1:5000/train'
    console.log(url)

    formData = {
        'userID': this.projectUser,
        'modelID': this.projectID
    }

    $.post(url, formData, function(data, status, jqXHR) {
        console.log(data)
    })

    console.log('Project Sent')
    var msg = new MessageCard('Data successfully saved!')
    msg.addMessage()
}

var getCreationDate = function() {
    var currentDate = new Date()
    var allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    var date = currentDate.getDate()
    var month = allMonths[currentDate.getMonth()]
    var year = currentDate.getFullYear()

    return date + ' ' + month + ' ' + year
}

// ------------------------------------------------------------------------------------------------------------------------

function MessageCard(msg) {
    this.message = msg
}

MessageCard.prototype.addMessage = function() {
    var card = document.createElement('div')
    card.classList = 'message-card'

    var p = document.createElement('p')
    p.innerHTML = '<i class="fas fa-info-circle"></i>' + ' ' + this.message

    card.appendChild(p)
    document.body.appendChild(card)

    setTimeout(function() {
        document.body.removeChild(card)
    }, 2500)
}

// ------------------------------------------------------------------------------------------------------------------------

function DeploymentCard(DOC, title, type, url, status, trainingStatus, numClasses) {
    this.DOC = DOC 
    this.title = title
    this.type = type
    this.purl = url
    this.status = status
    this.tStatus = trainingStatus
    this.numClasses = numClasses
}

DeploymentCard.prototype.addModel = function(container) {
    this.card = document.createElement('div')
    this.card.classList += 'project-card'

    var cardTop = document.createElement('div')
    cardTop.classList += 'project-card-top'

    var dateNode = document.createElement('p')
    dateNode.innerHTML = this.DOC
    dateNode.classList += 'project-creation-date'

    var options = document.createElement('div')
    options.classList += 'project-top-options'

    this.optionsNodeTS = document.createElement('i')
    this.optionsNodeTS.classList += 'project-options-toggle-status'
    if (this.status == 'Inactive') {
        this.optionsNodeTS.innerHTML = '<i class="fas fa-play"></i>'
    } else if (this.status == 'Active') {
        this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
    }

    this.optionsNodeDel = document.createElement('i')
    this.optionsNodeDel.innerHTML = '<i class="fas fa-trash-alt"></i>'
    this.optionsNodeDel.classList += 'project-options-delete'

    options.appendChild(this.optionsNodeTS)
    options.appendChild(this.optionsNodeDel)

    var cardDisplay = document.createElement('div')
    cardDisplay.classList = 'model-display'

    var cardDisplayP = document.createElement('p')
    var matches = this.title[0].toUpperCase()
    cardDisplayP.innerText = matches

    var cardTitle = document.createElement('p')
    cardTitle.classList += 'model-title'
    cardTitle.innerText = this.title

    var cardClasses = document.createElement('p')
    cardClasses.classList += 'model-classes'
    cardClasses.innerText = 'Classes: '

    var cardClassesSpan = document.createElement('span')
    cardClassesSpan.innerText = this.numClasses
    cardClasses.appendChild(cardClassesSpan)

    var statusNode = document.createElement('div')
    statusNode.classList = 'model-status-node'

    this.cardTrainingStatus = document.createElement('p')
    this.cardTrainingStatus.classList = 'model-training-status'
    this.cardTrainingStatus.innerHTML = 'Trained'

    this.cardStatus = document.createElement('p')
    this.cardStatus.classList += 'model-status'
    this.cardStatus.innerHTML = this.status + ' <i class="fas fa-circle"></i>'
    if (this.status == 'Inactive') {
        this.cardStatus.style.color = '#ee5253'
    } else if (this.status == 'Active') {
        this.cardStatus.style.color = '#10ac84'
    }

    statusNode.appendChild(this.cardTrainingStatus)
    statusNode.appendChild(this.cardStatus)

    var cardDivider = document.createElement('div')
    cardDivider.classList += 'model-divider'

    this.cardType = document.createElement('p')
    this.cardType.innerHTML = this.purl + ' <i class="far fa-copy"></i>'
    this.cardType.classList = 'model-type'

    this.cardType.onclick = () => {
        const el = document.createElement('textarea');
        el.value = this.purl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    cardTop.appendChild(dateNode)
    cardTop.appendChild(options)
    this.card.appendChild(cardTop)

    cardDisplay.appendChild(cardDisplayP)
    this.card.appendChild(cardDisplay)

    this.card.appendChild(cardTitle)
    this.card.appendChild(cardClasses)
    this.card.appendChild(statusNode)

    this.card.appendChild(cardDivider)
    this.card.appendChild(this.cardType)

    container.prepend(this.card)
}

DeploymentCard.prototype.trainingInit = function(listener) {    
    if (listener) {
        setTimeout(() => {
            this.cardTrainingStatus.innerHTML = 'Training'
        }, 500)
    } else {
        setTimeout(() => {
            this.cardTrainingStatus.innerHTML = 'Untrained'
        }, 500)
    }
}

DeploymentCard.prototype.handleDeployment = function(listener) {
    if (listener) {
        setTimeout(() => {
            this.cardTrainingStatus.innerHTML = 'Trained'
            this.cardStatus.style.color = '#10ac84'
            this.cardStatus.innerHTML = 'Active <i class="fas fa-circle"></i>'
            this.optionsNodeTS.innerHTML = '<i class="fas fa-stop"></i>'
            this.cardType.style.color = 'royalblue'
        }, 500)
    } else {
        setTimeout(() => {
            this.cardTrainingStatus.innerHTML = 'Trained'
            this.cardStatus.style.color = '#ee5253'
            this.cardStatus.innerHTML = 'Inactive <i class="fas fa-circle"></i>'
            this.optionsNodeTS.innerHTML = '<i class="fas fa-play"></i>'
            this.cardType.style.color = 'rgb(109, 102, 102)'            
        }, 500)
    }
}

// ------------------------------------------------------------------------------------------------------------------------

function ClassDisplay() {}

ClassDisplay.prototype.displayClassCard = function(workspace) {
    var card = document.createElement('div')
    card.classList += 'training-data-card'
    
    var cardTop = document.createElement('div')
    cardTop.classList += 'tdc-top'

    var cardBottom = document.createElement('div')
    cardBottom.classList += 'tdc-bottom'

    this.classLabel = document.createElement('p')
    // this.classLabel.type = 'text'
    // this.classLabel.placeholder = 'Class label'
    this.classLabel.classList += 'class-label'

    this.numInstancesNode = document.createElement('p')
    this.numInstancesNode.classList += 'class-instances'

    var uploadButton = document.createElement('button')
    uploadButton.innerHTML = 'Upload <i class="fas fa-upload"></i>'
    uploadButton.classList += 'upload-button'

    this.deleteButton = document.createElement('button')
    this.deleteButton.innerHTML = '<i class="fas fa-times"></i>'
    this.deleteButton.classList += 'delete-button'
    
    cardTop.appendChild(this.classLabel)
    cardTop.appendChild(this.numInstancesNode)

    cardBottom.appendChild(uploadButton)
    cardBottom.appendChild(this.deleteButton)

    card.appendChild(cardTop)
    card.appendChild(cardBottom)

    workspace.appendChild(card)
}

ClassDisplay.prototype.typeClassLabel = function() {
    var typewriter = new Typewriter(this.classLabel, {
		loop: true,
        typingSpeed: 100
	})

    typewriter.typeString('Dog')
        .pauseFor(2000)
        .deleteAll()
        .start()

    this.numInstancesNode.innerHTML = '50 Instances'
}