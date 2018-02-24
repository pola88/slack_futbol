import Random from "../../../lib/commands/random";
import pgConnection from "../../../lib/pg/connection";

describe("Random command", () => {
  let payload;
  let random;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "random",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"random\" return true", () => {
      expect(Random.is("random")).toEqual(true);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      random = new Random(payload);
    });

    it("returns 'Random'", () => {
      expect(random.name).toEqual("Random");
    });
  });

  describe("run", () => {
    let result;

    describe("less than 8 players", () => {
      beforeAll(done => {
        jasmine.cleanDb( () => {
          random = new Random(payload);
          spyOn(random, "_buildPayload").and.callThrough();

          let query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a1','now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a2','now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a3','now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a4','now()','now()')";
                pgConnection.query( query, () => {
                  query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a5','now()','now()')";
                  pgConnection.query( query, () => {
                    random.bot = {
                      send: (_payload, text) => {
                        result = text;

                        done();
                      }
                    };

                    random.run();
                  });
                });
              });
            });
          });
        });
      });

      it("calls the _buildPayload method", () => {
        expect(random._buildPayload).toHaveBeenCalled();
      });

      it("returns the payload with text", () => {
        expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "Con la cantidad que son, jueguen al Fifa en la play, no molesten.", type: "message" });
      });
    });

    describe("more than 8 players", () => {
      beforeAll(done => {
        jasmine.cleanDb( () => {
          random = new Random(payload);
          spyOn(random, "_buildPayload").and.callThrough();

          let query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a1','now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a2','now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a3','now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a4','now()','now()')";
                pgConnection.query( query, () => {
                  query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a5','now()','now()')";
                  pgConnection.query( query, () => {
                    query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a6','now()','now()')";
                    pgConnection.query( query, () => {
                      query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a7','now()','now()')";
                      pgConnection.query( query, () => {
                        query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a8','now()','now()')";
                        pgConnection.query( query, () => {
                          query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a9','now()','now()')";
                          pgConnection.query( query, () => {
                            query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a10','now()','now()')";
                            pgConnection.query( query, () => {
                              query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a11','now()','now()')";
                              pgConnection.query( query, () => {
                                query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a12','now()','now()')";
                                pgConnection.query( query, () => {
                                  query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a13','now()','now()')";
                                  pgConnection.query( query, () => {
                                    random.bot = {
                                      send: (_payload, text) => {
                                        result = text;

                                        done();
                                      }
                                    };

                                    random.run();
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      it("calls the _buildPayload method", () => {
        expect(random._buildPayload).toHaveBeenCalled();
      });

      it("updates users", done => {
        let query;
        query = "SELECT count(*) FROM players WHERE team = 'A';";
        pgConnection.query( query, (errorTeamA, queryTeamA) => {
          expect(queryTeamA.rows[0].count).toEqual("6");

          query = "SELECT count(*) FROM players WHERE team = 'B';";
          pgConnection.query( query, (errorTeamB, queryTeamB) => {
            expect(queryTeamB.rows[0].count).toEqual("6");
            done();
          });
        });
      });
    });

    describe("with two players", () => {
      beforeAll(done => {
        jasmine.cleanDb( () => {
          payload.text = "random <@a1> <@a9>";

          random = new Random(payload);
          spyOn(random, "_buildPayload").and.callThrough();

          let query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a1','now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a2','now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a3','now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a4','now()','now()')";
                pgConnection.query( query, () => {
                  query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a5','now()','now()')";
                  pgConnection.query( query, () => {
                    query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a6','now()','now()')";
                    pgConnection.query( query, () => {
                      query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a7','now()','now()')";
                      pgConnection.query( query, () => {
                        query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a8','now()','now()')";
                        pgConnection.query( query, () => {
                          query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a9','now()','now()')";
                          pgConnection.query( query, () => {
                            random.bot = {
                              send: (_payload, text) => {
                                result = text;

                                done();
                              }
                            };

                            random.run();
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      it("calls the _buildPayload method", () => {
        expect(random._buildPayload).toHaveBeenCalled();
      });

      it("updates users", done => {
        let query;
        query = "SELECT count(*) FROM players WHERE team = 'A';";
        pgConnection.query( query, (errorTeamA, queryTeamA) => {
          expect(queryTeamA.rows[0].count).toEqual("5");

          query = "SELECT count(*) FROM players WHERE team = 'B';";
          pgConnection.query( query, (errorTeamB, queryTeamB) => {
            expect(queryTeamB.rows[0].count).toEqual("4");
            done();
          });
        });
      });

      xit("sets the captains", done => {
        let query;
        query = "SELECT * FROM players WHERE user_id = 'a1';";
        pgConnection.query( query, (errorTeamA, queryTeamA) => {
          expect(queryTeamA.rows[0].captain).toEqual(true);

          query = "SELECT * FROM players WHERE user_id = 'a9';";
          pgConnection.query( query, (errorTeamB, queryTeamB) => {
            expect(queryTeamB.rows[0].captain).toEqual(true);

            expect(queryTeamA.rows[0].team).not.toEqual(queryTeamB.rows[0].team);
            done();
          });
        });
      });
    });

  });
});
