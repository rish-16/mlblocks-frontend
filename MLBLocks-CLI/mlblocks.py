#!/usr/bin/env python

import os
import click
import requests
import pyrebase
import getpass
import random
import string
import datetime
from pyfiglet import Figlet
from progress.bar import Bar
from termcolor import colored

config = {
    "apiKey": "AIzaSyCTF4OsQ1tvnyabjE_dZpEJ3nwE2GkIS-4",
    "authDomain": "sigmoid-3e5f4.firebaseapp.com",
    "databaseURL": "https://sigmoid-3e5f4.firebaseio.com",
    "projectId": "sigmoid-3e5f4",
    "storageBucket": "sigmoid-3e5f4.appspot.com",
    "messagingSenderId": "841883044467"
}

firebase = pyrebase.initialize_app(config)
ref = firebase.database()
auth = firebase.auth()
storage = firebase.storage()

def get_project_id():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))

def newProject(user, projectID, title, classes):
    msg = colored(title, "cyan")
    print ('\nCreating new project {}'.format(msg))
#    projectID = get_project_id()
    date = str(datetime.datetime.today().strftime('%d-%m-%Y'))
    data = {
        'DATATYPE': 'Images',
        'DOC': date,
        'ID': projectID,
        'STATUS': "Inactive",
        'TITLE': title,
        'TRAINED': False,
        'TYPE': "Classification",
        "USER": user
    }
    ref.child('Projects').child(user).child(projectID).set(data)
    for i in range(len(classes)):
        ref.child('Projects').child(user).child(projectID).child('CLASSES').child(list(classes[i].keys())[0]).set(list(classes[i].values())[0])

def sendFiles(user, direc):
    title = input('Enter project title: ')
    projectID = get_project_id()
    folder = os.listdir(direc)
    classes = []

    print ('Project ID: {}'.format(colored(" "+projectID+" ", "cyan")))
    print ('Number of Classes: {}'.format(len(folder)))
    print ()
    print ('{0:^12}{1:^15}\t{2:^37}'.format('Class', 'Instances', 'Progress'))

    for cls in folder:
        instances = os.listdir(direc + cls)
        classes.append({cls: len(instances)})

        msg1 = colored("{:^12}".format(cls), 'cyan')
        msg2 = colored("{:^15}".format(len(instances)), 'green')
        upload_msg = "{}{}\t".format(msg1, msg2)
        bar = Bar(upload_msg, max=len(instances), suffix='%(percent)d%%')

        for i in range(len(instances)):
            path = direc+'/'+cls+'/'+instances[i]

            # Upload image to Storage
            storage.child('Projects/{0}/{1}/image{2}.jpg'.format(projectID, cls, i+1)).put(path)
            bar.next()

        bar.finish()
    
    print (colored('\nInstances have been uploaded!', "white"))

    # Create new project
    newProject(user, projectID, title, classes)

    # Downloading model
    download_model(projectID, user)

def download_model(modelID, userID):
    print ('Model is training...')
    options = {
        'modelID': modelID,
        'userID': userID
    }
    url = 'http://flask-env.nhswx46rhd.ap-southeast-1.elasticbeanstalk.com/{}/train'.format(modelID)

    resp = requests.post(url, data=options)
    data = resp.content

    with open('model.h5', 'wb') as m:
        m.write(data)
    
    f = colored('model.h5', "green")
    print ('\nModel weights: {}'.format(f))

@click.group()
def main():
    pass

@main.command()
@click.argument("direc")
def run(direc):
    email = input('Enter email: ')
    password = getpass.getpass()
    user = auth.sign_in_with_email_and_password(email, password)
    user = user['localId']
    print()
    f = Figlet()
    print(colored(f.renderText("MLBlocks"), "cyan"))
    sendFiles(user, direc)

if __name__ == "__main__":
    main()
