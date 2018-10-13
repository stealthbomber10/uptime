from random import randint
from sklearn import datasets, linear_model
import numpy as np
import sys, pickle, time

if __name__ == "__main__":

    start = time.time()
    expected = [randint(45, 181) for x in range(0, 1000)]
    actual = [(x + randint(-10, 10)) for x in expected]

    train_expected = expected[:-20]
    test_expected = expected[-20:]

    train_actual = actual[:-20]
    test_actual = actual[-20:]

    regression = linear_model.LinearRegression()

    regression.fit(np.asarray(train_expected).reshape(-1, 1), train_actual)
    
    # Steps before use:
    # * Variables 'expected' and 'actual' need to change, according to the data stored in the DB
    # (Could be saved as a json or provided as input)
    # Usage:
    
    # python durationPredictor.py -> Saves a model based on the input provided

    # python durationPredictor.py 1 -> Calculates the actual values for the test sample

    if len(sys.argv) > 1 and sys.argv[1] == "1":
    
        test_calculated_values = regression.predict(np.asarray(test_expected).reshape(-1, 1))
        print test_calculated_values, "\n", test_actual

    else:

        pickle.dump(regression, open("durationPredictor.sav", "wb"))
        print "Model saved!"

    print "Total time taken was {}".format(time.time() - start)
