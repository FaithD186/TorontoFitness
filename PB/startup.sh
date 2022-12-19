#!/bin/bash

pip3 install virtualenv
python3 -m virtualenv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
cd ..
cd project_frontend
#npm install
npm install --save google-maps-react --legacy-peer-deps
cd ..
cd PB

