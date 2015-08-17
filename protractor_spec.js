var allTests = require('./alltests');

describe('all_closure_tests', function() {

  beforeEach(function() {
    // Ignores synchronization with angular loading. Since we don't use angular,
    // enable it.
    browser.ignoreSynchronization = true;
  });

  function waitForCompletion() {
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
                  // Check every 100ms for completion.
                  setTimeout(waitForTest.bind(undefined, resolve, reject), 100);
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
    var runNextTest = function(testPath) {
      return browser.navigate()
          .to('http://localhost:8080/' + testPath)
          .then(function() { return waitForCompletion(); })
          .then(function(status) {
            // TODO: aggregate stats here.
            console.log(status.report);

            if (!status.isSuccess) {
              failedTests++;
            }

            return status;
          });
    };

    // Chains the next test to the completion of the previous's through its
    // promise.
    var chainNextTest = function(promise, test) {
      promise.then(function() {
        runNextTest(test);
      });
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
      console.log("Failed tests: " + failedTests);
      done();
    });
  });
});
