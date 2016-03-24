import pgConnection from "../../../lib/pg/connection";
import Add from "../../../lib/commands/add";
import _ from "lodash";

require("jasmine-before-all");

describe("Add command", () => {
  let payload;
  let add;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "juego",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"juego\" return true", () => {
      expect(Add.is("juego")).toEqual(true);
    });

    it("with \"yo juego\" return true", () => {
      expect(Add.is("yo juego")).toEqual(true);
    });

    it("with \"juega\" return true", () => {
      expect(Add.is("juega")).toEqual(true);
    });

    it("with \"juega pepito\" return true", () => {
      expect(Add.is("juega pepito")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Add.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      add = new Add(payload);
    });

    it("returns \"Add\"", () => {
      expect(add.name).toEqual("Add");
    });
  });

  describe("run", () => {
    let result;

    describe("with \"juego\"", () => {
      beforeAll( () => {
        payload.text = "juego";
      });

      describe("first time", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            add = new Add(payload);
            spyOn(add, "_buildPayload").and.callThrough();
            spyOn(add, "me").and.callThrough();
            add.run()
                .then( res => {
                  result = res;

                  done();
                });
          });
        });

        it("calls the method", () => {
          expect(add._buildPayload).toHaveBeenCalled();
          expect(add.me).toHaveBeenCalled();
        });

        it("returns the payload with text \"Que viva el futbol!!\"", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "Que viva el futbol!! Ahora somos 1: U03BKS790", type: "message" });
        });

        it("saves the user id", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).not.toEqual([]);

            done();
          });
        });
      });

      describe("Different channel id", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            payload.channel = "anotherChannel";
            add = new Add(payload);
            add.run()
                .then( res => {
                  result = res;
                  done();
                });
          });
        });

        it("returns the payload with text \"Que viva el futbol!!\" and current channel", () => {
          expect(result).toEqual({ id: result.id, channel: "anotherChannel", text: "Que viva el futbol!! Ahora somos 1: U03BKS790", type: "message" });
        });
      });

      describe("The user has already been added", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            add = new Add(payload);
            add.run()
                .then( () => {
                  add.run()
                      .then( res => {
                        result = res;
                        done();
                      });
                });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?", type: "message" });
        });

        it("does not save the user id again", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).not.toEqual([]);
            expect(selectResult.rows.length).toEqual(1);

            done();
          });
        });
      }); //The user has been added

      describe("with 12 players", () => {
        beforeAll(done => {
          jasmine.cleanDb( () => {
            add = new Add(payload);
            spyOn(add, "_buildPayload").and.callThrough();

            let created = _.after(12, () => {
              add.run()
                  .then( res => {
                    result = res;

                    done();
                  });
            });

            let query;
            _.times(12, (n) => {
              query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('a${n}','now()','now()')`;
              pgConnection.query( query, created);
            });

          });
        });

        it("returns the error text", () => {
          expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "Tarde!! Ya estamos los 12!! Pero todo tiene un precio :wink:", type: "message" });
        });
      });
    }); // with "juego"

    describe("with \"juega <usuario>\"", () => {
      let userId = "U089DAS89";

      beforeEach( () => {
        payload.text = `juega <@${userId}>`;
      });

      describe("first time", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            add = new Add(payload);
            spyOn(add, "_buildPayload").and.callThrough();
            spyOn(add, "another").and.callThrough();
            add.run()
                .then( res => {
                  result = res;

                  done();
                });
          });
        });

        it("calls the method", () => {
          expect(add._buildPayload).toHaveBeenCalled();
          expect(add.another).toHaveBeenCalled();
        });

        it("returns the payload with text \"Que viva el futbol!!\"", () => {
          expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "Que viva el futbol!! Ahora somos 1: U089DAS89", type: "message" });
        });

        it("saves the user id", done => {
          let query = `SELECT * FROM players WHERE user_id = '${userId}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).not.toEqual([]);

            done();
          });
        });

        it("does not save the user who write", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });
      });

      describe("The user has already been added", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            add = new Add(payload);
            add.run()
                .then( () => {
                  add.run()
                      .then( res => {
                        result = res;
                        done();
                      });
                });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "Ya estas anotado pibe, gracias que podes \"correr\" y queres jugar por 2?", type: "message" });
        });

        it("does not save the user id again", done => {
          let query = `SELECT * FROM players WHERE user_id = '${userId}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).not.toEqual([]);
            expect(selectResult.rows.length).toEqual(1);

            done();
          });
        });
      }); //The user has been added

      describe("without user", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            payload.text = `juega`;
            add = new Add(payload);
            add.run()
                .then( () => {
                  add.run()
                      .then( res => {
                        result = res;
                        done();
                      });
                });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.", type: "message" });
        });

        it("does not save the user who write", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });
      }); //without user

      describe("invalid user", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            payload.text = `juega @fakeUser`;
            add = new Add(payload);
            add.run()
                .then( () => {
                  add.run()
                      .then( res => {
                        result = res;
                        done();
                      });
                });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.", type: "message" });
        });

        it("does not save the user who write", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });
      }); //invalid user

      describe("without @", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            payload.text = `juega fakeUser`;
            add = new Add(payload);
            add.run()
                .then( () => {
                  add.run()
                      .then( res => {
                        result = res;
                        done();
                      });
                });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.", type: "message" });
        });

        it("does not save the user who write", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });
      }); //without @
    }); // with "juega usuario"
  }); // run

  xdescribe("after", () => {
    describe("with captains", () => {
      let result;

      beforeAll(done => {
        jasmine.cleanDb( () => {
          add = new Add(payload);

          let query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a1', 'A', true, 'now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a2', 'B', 'now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a3', 'B', true, 'now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a4', 'A', 'now()','now()')";
                pgConnection.query( query, () => {
                  add.after(payload)
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

      it("return text with captains", () => {
        expect(result.text).toEqual("random <@a1> <@a1>");
      });
    });

    describe("without captains", () => {
      let result;

      beforeAll(done => {
        jasmine.cleanDb( () => {
          add = new Add(payload);

          let query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a1', 'A', false, 'now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a2', 'B', 'now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a3', 'B', false, 'now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a4', 'A', 'now()','now()')";
                pgConnection.query( query, () => {
                  add.after(payload)
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

      it("return text with captains", () => {
        expect(result.text).toEqual("random");
      });
    });
  });
});
