var allTests = require('./alltests');

describe('all_closure_tests', function() {

  beforeEach(function() {
    // Ignores synchronization with angular loading. Since we don't use angular,
    // enable it.
    browser.ignoreSynchronization = true;
  });

  // Timeout for individual test package to complete.
  var TEST_TIMEOUT = 45 * 1000;

  var TEST_SERVER = 'http://localhost:8080';

  // Polls currently loaded test page for test completion. Returns Promise that
  // will resolve when test is finished.
  var waitForTestSuiteCompletion = function(testPath) {
    var testStartTime = +new Date();

    var waitForTest = function(resolve, reject) {
      // executeScript runs the passed method in the "window" context of
      // the current test. JSUnit exposes hooks into the test's status through
      // the "G_testRunner" global object.
      browser.executeScript(function() {
               if (window['G_testRunner']['isFinished']()) {
                 var status = {};
                 status['isFinished'] = true;
                 status['isSuccess'] = window['G_testRunner']['isSuccess']();
                 status['report'] = window['G_testRunner']['getReport']();
                 return status;
               } else {
                 return {'isFinished': false};
               }
             })
          .then(
              function(status) {
                if (status.isFinished) {
                  resolve(status);
                } else {
                  var currTime = +new Date();
                  if (currTime - testStartTime > TEST_TIMEOUT) {
                    status.isSuccess = false;
                    status.report = testPath + ' timed out after ' +
                                    (TEST_TIMEOUT / 1000) + 's!';
                    // resolve so tests continue running.
                    resolve(status);
                  } else {
                    // Check every 100ms for completion.
                    setTimeout(waitForTest.bind(undefined, resolve, reject),
                               100);
                  }
                }
              },
              function(err) { reject(err); });
    };

    return new Promise(function(resolve, reject) {
      waitForTest(resolve, reject);
    });
  };

  it('should successfully run all tests', function(done) {
    var failedTests = 0;

    // Navigates to testPath to invoke tests. Upon completion inspects returned
    // test status and keeps track of the total number failed tests.
    var runNextTest = function(testPath) {
      return browser.navigate()
          .to(TEST_SERVER + '/' + testPath)
          .then(function() { return waitForTestSuiteCompletion(testPath); })
          .then(function(status) {
            if (!status.isSuccess) {
              console.log(status.report);
              failedTests++;
            }

            return status;
          });
    };

    // Chains the next test to the completion of the previous's through its
    // promise.
    var chainNextTest = function(promise, test) {
      promise.then(function() { runNextTest(test); });
    };

    var testPromise = null;
    for (var i = 1; i < allTests.length; i++) {
      if (testPromise != null) {
        chainNextTest(testPromise, allTests[i]);
      } else {
        testPromise = runNextTest(allTests[i]);
      }
    }

    testPromise.then(function() {
      expect(failedTests).toBe(0);
      done();
    });
  });
});
