import pgConnection from "../lib/pg/connection";

jasmine.cleanDb = function(done) {
  pgConnection.query("TRUNCATE players RESTART IDENTITY CASCADE", function() {
    done();
  });
};
