require("babel/register");
process.env.NODE_ENV = "test";
var Jasmine = require("jasmine");
var JasmineSpecReporter = require("jasmine-spec-reporter");

var jasmine = new Jasmine();
jasmine.loadConfigFile("./spec/support/jasmine.json");
jasmine.env.addReporter(new JasmineSpecReporter( { displayStacktrace: true } ));
//Remove the default dot.
jasmine.configureDefaultReporter({ print: function() {} });

jasmine.execute();
