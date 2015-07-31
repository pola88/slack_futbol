import List from "../../../lib/commands/list";
import pgConnection from "../../../lib/pg/connection";

describe("List command", () => {
  let payload;
  let list;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "lista",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"lista\" return true", () => {
      expect(List.is("lista")).toEqual(true);
    });

    it("with \"quienes somos?\" return true", () => {
      expect(List.is("quienes somos?")).toEqual(true);
    });

    it("with \"dame los jugadores\" return true", () => {
      expect(List.is("dame los jugadores")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(List.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      list = new List(payload);
    });

    it("returns 'List'", () => {
      expect(list.name).toEqual("List");
    });
  });

  describe("run", () => {
    let result;

    beforeAll(done => {
      jasmine.cleanDb( () => {
        list = new List(payload);
        spyOn(list, "_buildPayload").and.callThrough();

        let query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a1','now()','now()')";
        pgConnection.query( query, () => {
          query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a2','now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, created_at, updated_at) VALUES ('a3','now()','now()')";
            pgConnection.query( query, () => {
              list.run()
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
      expect(list._buildPayload).toHaveBeenCalled();
    });

    it("returns the payload with the players", () => {
      let expectedText = "Por ahora los q juegan son: <@a1>, <@a2>, <@a3>";
      expect(result).toEqual({ channel: "C03CFASU7", text: expectedText, type: "message" });
    });
  });
});
