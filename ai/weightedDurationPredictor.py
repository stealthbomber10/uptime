from random import randint
from sklearn import datasets, linear_model
import numpy as np
import sys, pickle, time

if __name__ == "__main__":
    start = time.time()
    user_parameter = 0.7
    all_expected = [randint(60,80) for x in range(0, 100)]
    all_actual = [(x + randint(-10, 10)) for x in all_expected]
    train_all_expected = all_expected[:len(all_expected)/2]
    test_all_expected = all_expected[:-len(all_expected)/2]
    train_all_actual = all_actual[:len(all_actual)/2]
    test_all_actual = all_actual[:-len(all_actual)/2]
    all_regression = linear_model.LinearRegression()
    all_regression.fit(np.asarray(train_all_expected).reshape(-1, 1), train_all_actual)

    user_expected = [randint(40, 60) for x in range(0, 10)]
    user_actual = [(x + randint(-10, 10)) for x in user_expected]
    train_user_actual = user_actual[:len(user_actual)/2]
    test_user_actual = user_actual[:-len(user_actual)/2]
    train_user_expected = user_expected[:len(user_expected)/2]
    test_user_expected = user_expected[:-len(user_expected)/2]
    user_regression = linear_model.LinearRegression()
    user_regression.fit(np.asarray(train_user_expected).reshape(-1, 1), train_user_actual)

    # Steps before use:
    # * Variables 'expected' and 'actual' need to change, according to the data stored in the DB
    # (Could be saved as a json or provided as input)
    # Usage:
    
    # python durationPredictor.py -> Saves a model based on the input provided

    # python durationPredictor.py 1 -> Calculates the actual values for the test sample

    if len(sys.argv) > 1 and sys.argv[1] == "1":
    
        test_all_calculated_values = all_regression.predict(np.asarray(test_all_expected).reshape(-1, 1))
        test_user_calculated_values = user_regression.predict(np.asarray(test_user_expected).reshape(-1, 1))
        if len(user_actual) == 0 & len(all_actual) == 0 : #user does a non-homework task for the first time
            test_weighted_calculated_values = user_expected
        elif len(user_actual) == 0 : #user does a homework task for the first time
            test_weighted_calculated_values = test_all_calculated_values
        elif len(all_actual) == 0 : #user does a non-home work task for !first time
            test_weighted_calculated_values = test_user_calculated_values
        else : #homework task and !first time
            test_weighted_calculated_values = [x * user_parameter + y * (1 - user_parameter) for x, y in zip(test_user_calculated_values, test_all_calculated_values)]

        print test_weighted_calculated_values, "\n", test_all_actual, "\n", test_user_actual

    else:

        pickle.dump(user_regression, open("durationPredictor.sav", "wb"))
        pickle.dump(all_regression, open("durationPredictor.sav", "wb"))
        print "Model saved!"

    print "Total time taken was {}".format(time.time() - start)