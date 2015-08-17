// See https://github.com/angular/protractor/blob/master/docs/referenceConf.js
// for full protractor config reference.
exports.config = {
  // Whether to connect directly to browser drivers.
  directConnect: false,

  // Address of running selenium instance.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Options specific to which browser tests are run on.
  capabilities: {
    'browserName': 'firefox'
  },

  // Testing framework used for spec file.
  framework: 'jasmine2',

  // Relative path to spec (i.e., tests).
  specs: ['protractor_spec.js'],

  jasmineNodeOpts: {
    // Timeout in ms before a test fails. 10 minutes.
    defaultTimeoutInterval: 20 * 60 * 1000
  }
};
