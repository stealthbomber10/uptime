from random import randint
from sklearn import datasets, linear_model
import numpy as np
import sys, pickle, time

if __name__ == "__main__":
    start = time.time()
    allExpected = [randint(20, 40) for x in range(0, 1000)]
    allActual = [(x + randint(-10, 10)) for x in allExpected]

    userExpected = [randint(800, 3000) for x in range(0, 10)]
    userActual = [(x + randint(-10, 10)) for x in userExpected]

    allParameter = 0.3
    copy = ((float)(len(allExpected) / allParameter) * (1 - allParameter)) / len(userExpected)

    # if len(userActual) == 0:
    #     userWeightParameter = 0
    #     allWeightParameter = 1
    # else: 
    #      userWeightParameter = 0.7 * (len(userExpected) + len(allExpected)) / len(userExpected)
    #      allWeightParameter = 0.3 * (len(userExpected) + len(allExpected)) / len(allExpected)
    
    expected = allExpected[:]
    temp = userExpected * (int)(copy - 1)
    expected += temp 
    actual = [(x + randint(-10, 10)) for x in expected]
    #checked

    expected[len(allExpected)-1]
    train_expected = expected[:lern(allExpected)/2-1] + expected[len(allExpected):len(allExpected)+len(userExpected)/2-1] #the last 20 elements in all expected + the last five in user expected
    test_expected = expected[len(allExpected)/2:len(allExpected)-1] + expected[len(allExpected)+len(userExpected)/2-1:] #the first ...
    
    train_actual = actual[:len(allExpected)/2-1] + actual[len(allExpected):len(allExpected)+len(userExpected)/2-1]
    test_actual = actual[len(allExpected)/2:len(allExpected)-1] + actual[len(allExpected)+len(userExpected)/2-1:]

    regression = linear_modßel.LinearRegression()
    regression.fit(np.asarray(train_expected).reshape(-1, 1), train_actual)
    
    # Steps before use:
    # * Variables 'expected' and 'actual' need to change, according to the data stored in the DB
    # (Could be saved as a json or provided as input)
    # Usage:
    
    # python durationPredictor.py -> Saves a model based on the input provided

    # python durationPredictor.py 1 -> Calculates the actual values for the test sample

    if len(sys.argv) > 1 and sys.argv[1] == "1":
    
        test_calculated_values = regression.predict(np.asarray(test_expected).reshape(-1, 1))
        print test_calculated_values

    else:

        pickle.dump(regression, open("durationPredictor.sav", "wb"))
        print "Model saved!"

    print "Total time taken was {}".format(time.time() - start)