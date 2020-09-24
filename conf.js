// Protractor Configuration file setup For reference.


var env = {

      baseUrl: 'https://blazedemo.com',
};

exports.config = {

    directConnect: false,
    // The location of the selenium standalone server .jar file if you want to manually start the selenium standalone server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    allScriptsTimeout: 120000,
    //chromedriver: '.chromedriver.exe',

   // Capabilities to be passed to the webdriver instance.
    capabilities: { 
    	'browserName': 'chrome',
	},		

    chromeOptions:{
        args: [
        	'--no-sandbox',
            '--start-maximized',
            '--disable-browser-side-navigation',
            '--disable-dev-shm-using'
        ]
    },

    // Framework to use. Jasmine is recommended.
    framework: 'jasmine',

    // Spec patterns are relative to the current working directory when
    // protractor is called.
    specs: [
        './TestCases/blazedemo-test_spec.js'
    ],  

    onPrepare: function () {
     	browser.driver.get(env.baseUrl);
        browser.driver.manage().window().maximize();

        var today = new Date(),
    	timeStamp = today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear() + '-' + today.getHours() + 'h-' + today.getMinutes() + 'm';

        var jasmineReporters = require('/usr/local/lib/node_modules/jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: './reports',
            filePrefix: 'protractor-result' + timeStamp
        }));
        var SpecReporter = require('/usr/local/lib/node_modules/jasmine-spec-reporter').SpecReporter;
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true, displaySpecDuration: true}));


        restartBrowserBetweenTests: false;

		// ----- Options to be passed to minijasminenode -----
		jasmineNodeOpts: {
	      // onComplete will be called just before the driver quits.
	      onComplete: null;
	      // If true, display spec names.
	      isVerbose: true;
	      // If true, print colors to the terminal.
	      showColors: true;
	      // If true, include stack traces in failures.
	      includeStackTrace: true;
	      defaultTimeoutInterval: 1000000000
	    }
    }

};