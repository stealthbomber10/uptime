from random import randint
from sklearn import datasets, linear_model
import numpy as np
import sys, pickle, time

if __name__ == "__main__":
    start = time.time()
    regression = pickle.load(open("durationPredictor.sav", "rb"))
    test_value = int(sys.argv[1])

    # This is to directly calculate actual value for
    # an expected value provided as an argument. It will
    # load the model from a pickle file saved on disk
    # so it is expected to be faster.

    # Usage:

    # python durationPredictorFromSavedModel.py <expected_value>

    test_expected = [test_value]
    test_calculated_values = regression.predict(np.asarray(test_expected).reshape(-1, 1))

    print test_calculated_values[0]
    # print "Total time taken was {}".format(time.time() - start)