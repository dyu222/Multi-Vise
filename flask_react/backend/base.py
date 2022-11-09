from flask import Flask, request
import requests
# import flask_react.backend.helpers as helpers
# import os
# import sys
# sys.path.append(os.path.abspath(os.path.join('', 'helpers')))
# import helpers
# sys.path.append('./')
from helpers import *

# helpers.similarity("hello", ["hello", "hi", "hey"])

api = Flask(__name__)

@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body

@api.route('/reddit', methods=['POST']) 
def reddit():
    data = request.data
    #call the helper here ig
    # make this a post request, data can be 
    #hopefully this should work once we setup up front end and path stuff.
    output = search_reddit(data)
    print(output)
    return output