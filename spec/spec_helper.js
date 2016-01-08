import pgConnection from "../lib/pg/connection";

jasmine.cleanDb = function(done) {
  pgConnection.query("TRUNCATE players RESTART IDENTITY CASCADE", function() {
    pgConnection.query("TRUNCATE users RESTART IDENTITY CASCADE", function() {
      done();
    });
  });
};
