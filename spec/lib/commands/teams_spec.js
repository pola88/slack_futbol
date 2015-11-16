import Teams from "../../../lib/commands/teams";
import pgConnection from "../../../lib/pg/connection";

describe("Teams command", () => {
  let payload;
  let team;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "equipos",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"equipos\" return true", () => {
      expect(Teams.is("equipos")).toEqual(true);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      team = new Teams(payload);
    });

    it("returns 'Teams'", () => {
      expect(team.name).toEqual("Teams");
    });
  });

  describe("run", () => {
    let result;

    describe("no team", () => {
      beforeAll(done => {
        jasmine.cleanDb( () => {
          team = new Teams(payload);
          spyOn(team, "_buildPayload").and.callThrough();

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
                    team.run()
                          .then( res => {
                            result = res;

                            done();
                          });
                  });
                });
              });
            });
          });
        });
      });

      it("calls the _buildPayload method", () => {
        expect(team._buildPayload).toHaveBeenCalled();
      });

      it("returns the payload with text", () => {
        expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "No hay ningun equipo todavia.", type: "message" });
      });
    });

    describe("more than 8 players", () => {
      beforeAll(done => {
        jasmine.cleanDb( () => {
          team = new Teams(payload);
          spyOn(team, "_buildPayload").and.callThrough();

          let query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a1','A','now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a2','A','now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a3','A','now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a4','A','now()','now()')";
                pgConnection.query( query, () => {
                  query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a5','A','now()','now()')";
                  pgConnection.query( query, () => {
                    query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a6','B','now()','now()')";
                    pgConnection.query( query, () => {
                      query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a7','B','now()','now()')";
                      pgConnection.query( query, () => {
                        query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a8','B','now()','now()')";
                        pgConnection.query( query, () => {
                          query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a9','B','now()','now()')";
                          pgConnection.query( query, () => {
                            team.run()
                                  .then( res => {
                                    result = res;

                                    done();
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
        expect(team._buildPayload).toHaveBeenCalled();
      });

      it("does not get error message", () => {
        expect(result).not.toEqual({id: result.id, channel: "C03CFASU7", text: "No hay ningun equipo todavia.", type: "message" });
      });
    });

  });
});
