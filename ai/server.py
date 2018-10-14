from flask import Flask, request
from sklearn import datasets, linear_model
import numpy as np
import pickle, json

regression = pickle.load(open("durationPredictor.sav", "rb"))

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/getActualTime')
def getActualRoute():
    try:
        expected = int(request.args.get('expected'))
        actual = regression.predict(np.asarray([expected]).reshape(-1, 1))[0]
        response = {"actual": actual}
    except Exception as e:
        response = {"error": "Expected value is invalid: {}".format(e)}
    return json.dumps(response)

if __name__ == "__main__":
    app.run("0.0.0.0", port=80)
