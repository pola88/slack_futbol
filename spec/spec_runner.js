require("babel/register");
process.env.NODE_ENV = "test";
var path = require("path");
require("dotenv").config({path: path.join(__dirname, "test_env") });

var Jasmine = require("jasmine");
var JasmineSpecReporter = require("jasmine-spec-reporter");

var server = require("./assets/app");

server.start( function () {
  var jasmine = new Jasmine();
  jasmine.loadConfigFile("./spec/support/jasmine.json");
  jasmine.env.addReporter(new JasmineSpecReporter( { displayStacktrace: true } ));
  //Remove the default dot.
  jasmine.configureDefaultReporter({ print: function() {} });

  jasmine.execute();

});
