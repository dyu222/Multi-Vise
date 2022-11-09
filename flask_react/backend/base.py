from flask import Flask, request
import requests
# import flask_react.backend.helpers as helpers
import os
import sys
# sys.path.append(os.path.abspath(os.path.join('', 'helpers')))
# import helpers
sys.path.append('./')
from helpers import *

from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@app.route('/reddit', methods=['POST']) 
def reddit():
    data = request.json['query']
    print(data)
    #call the helper here ig
    # make this a post request, data can be 
    #hopefully this should work once we setup up front end and path stuff.
    output = search_reddit('hello')
    # print(output)
    return {"data":output}