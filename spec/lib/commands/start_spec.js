import Start from "../../../lib/commands/start";
import pgConnection from "../../../lib/pg/connection";
import _ from "lodash";

describe("Start command", () => {
  let payload;
  let start;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "start",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"start\" return true", () => {
      expect(Start.is("start")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Start.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      start = new Start(payload);
    });

    it("returns 'Start'", () => {
      expect(start.name).toEqual("Start");
    });
  });

  describe("run", () => {
    let result;

    describe("with 3 players", () => {
      beforeAll(done => {
        jasmine.cleanDb( () => {
          GLOBAL.__ID__ = 1;
          start = new Start(payload);
          spyOn(start, "_buildPayload").and.callThrough();

          let query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a1','now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a2','now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a3','now()','now()')";
              pgConnection.query( query, () => {
                start.run()
                    .then( res => {
                      result = res;

                      done();
                    });
              });
            });
          });
        });
      });

      it("calls the _buildPayload method", () => {
        expect(start._buildPayload).toHaveBeenCalled();
      });

      it("returns the payload with the players", () => {
        expect(result.id).toEqual(1);
        expect(result.channel).toEqual("C03CFASU7");
        expect(result.type).toEqual("message");
        expect(result.text).toMatch(/<\!channel> "_.*_", que viva el futbol!!! por ahora somos 3: <@a1>, <@a2>, <@a3>. Se suma alguien\? Alguien se baja\?/);
      });
    });

    describe("with 12 players", () => {
      beforeAll(done => {
        jasmine.cleanDb( () => {
          GLOBAL.__ID__ = 1;
          start = new Start(payload);
          spyOn(start, "_buildPayload").and.callThrough();

          let callback = _.after(12, () => {
            start.run()
                .then( res => {
                  result = res;

                  done();
                });
          });

          _.times(12, i => {
            let currentId = i + 1;
            let query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('a${currentId}','now()','now()')`;
            pgConnection.query( query, () => {
              callback();
            });
          });
        });
      });

      it("calls the _buildPayload method", () => {
        expect(start._buildPayload).toHaveBeenCalled();
      });

      it("returns the payload with the players", () => {
        expect(result.id).toEqual(1);
        expect(result.channel).toEqual("C03CFASU7");
        expect(result.type).toEqual("message");
        expect(result.text).toMatch(/<\!channel> "_.*_", que viva el futbol!!! ya estamos los 12: <@a1>, <@a2>, <@a3>, <@a4>, <@a5>, <@a6>, <@a7>, <@a8>, <@a9>, <@a10>, <@a11>, <@a12>. si alguien se baja, avise.../);
      });
    });
  });
});
