from flask import Flask, request
from sklearn import datasets, linear_model
from random import randint
import numpy as np
import pickle, json
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("uptime-69073-firebase-adminsdk-6wylj-bfbf8cb7e4.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://uptime-69073.firebaseio.com'
})

user_parameter = 0.7
categories = ['homework', 'chore', 'selfdev']
GLOBAL_MODEL_MAP = {}

ref = db.reference('history')

for category in categories:
    GLOBAL_MODEL_MAP[category] = {}
    saved_data = ref.child(category).get()

    GLOBAL_MODEL_MAP[category]['all_expected'] = []
    GLOBAL_MODEL_MAP[category]['all_actual'] = []
    GLOBAL_MODEL_MAP[category]['docs'] = []

    for item in saved_data:

        GLOBAL_MODEL_MAP[category]['all_expected'].append(item['exp_dur'])
        GLOBAL_MODEL_MAP[category]['all_actual'].append(item['act_dur'])
        GLOBAL_MODEL_MAP[category]['docs'].append((item['title'], item['act_dur']))

    GLOBAL_MODEL_MAP[category]['all_regression'] = linear_model.LinearRegression()
    GLOBAL_MODEL_MAP[category]['all_regression'].fit(np.asarray(GLOBAL_MODEL_MAP[category]['all_expected']).reshape(-1, 1)
        , GLOBAL_MODEL_MAP[category]['all_actual'])

    GLOBAL_MODEL_MAP[category]['user_expected'] = [randint(40, 60) for x in range(0, 10)]
    GLOBAL_MODEL_MAP[category]['user_actual'] = [(x + randint(-10, 10)) for x in GLOBAL_MODEL_MAP[category]['user_expected']]
    GLOBAL_MODEL_MAP[category]['user_regression'] = linear_model.LinearRegression()
    GLOBAL_MODEL_MAP[category]['user_regression'].fit(np.asarray(GLOBAL_MODEL_MAP[category]['user_expected']).reshape(-1, 1)
        , GLOBAL_MODEL_MAP[category]['user_actual'])

# Steps before use:
# * Variables 'expected' and 'actual' need to change, according to the data stored in the DB
# (Could be saved as a json or provided as input)
# Usage:

# python durationPredictor.py -> Saves a model based on the input provided

# python durationPredictor.py 1 -> Calculates the actual values for the test sample

def calculatePredictionScore(expected, category = "homework"):
    test_all_calculated_values = GLOBAL_MODEL_MAP[category]['all_regression'].predict(np.asarray(expected).reshape(-1, 1))
    test_user_calculated_values = GLOBAL_MODEL_MAP[category]['user_regression'].predict(np.asarray(expected).reshape(-1, 1))
    print category, test_all_calculated_values, test_user_calculated_values
    if len(GLOBAL_MODEL_MAP[category]['user_actual']) == 0 & len(GLOBAL_MODEL_MAP[category]['all_actual']) == 0 : #user does a non-homework task for the first time
        test_weighted_calculated_values = expected
    elif len(GLOBAL_MODEL_MAP[category]['user_actual']) == 0 : #user does a homework task for the first time
        test_weighted_calculated_values = test_all_calculated_values
    elif len(GLOBAL_MODEL_MAP[category]['all_actual']) == 0 : #user does a non-home work task for !first time
        test_weighted_calculated_values = test_user_calculated_values
    else : #homework task and !first time
        test_weighted_calculated_values = test_user_calculated_values * user_parameter + test_all_calculated_values * (1 - user_parameter)

    return test_weighted_calculated_values[0]

def calculatePredictionScoreFromTitle(title, category="homework"):
    title_words = set(title.lower().split())
    avg = 0
    n = 1
    for doc in GLOBAL_MODEL_MAP[category]['docs']:
        if len(set(doc[0].lower().split()).intersection(title_words)) >= 2:
            avg = ((avg * n) + doc[1]) / (n + 1)
            n += 1
    return avg

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/getActualTime')
def getActualRoute():
    try:
        expected = request.args.get('expected')
        category = request.args.get('category')
        title = request.args.get('title')
        actual = 0
        if (expected is None):
            actual = calculatePredictionScoreFromTitle(title, category)
        else:
            actual = calculatePredictionScore(int(expected), category)
        response = {"actual": actual}
    except Exception as e:
        response = {"error": "Expected value is invalid: {}".format(e)}
    print "{}".format(response)
    return json.dumps(response)

if __name__ == "__main__":
    app.run("0.0.0.0", port=80)

# Actual URL to use: http://104.196.67.238/getActualTime?expected&category&title
