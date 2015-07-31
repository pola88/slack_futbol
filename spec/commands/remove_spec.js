import pgConnection from "../../lib/pg/connection";
import Remove from "../../commands/remove";

require("jasmine-before-all");

describe("Remove command", () => {
  let payload;
  let remove;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "baja",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"baja\" return true", () => {
      expect(Remove.is("baja")).toEqual(true);
    });

    it("with \"baja pepito\" return true", () => {
      expect(Remove.is("baja pepito")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Remove.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      remove = new Remove(payload);
    });

    it("returns 'Remove'", () => {
      expect(remove.name).toEqual("Remove");
    });
  });

  describe("run", () => {
    let result;

    describe("with 'baja'", () => {
      beforeAll( () => {
        payload.text = "baja";
      });

      describe("first time", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            let query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${payload.user}','now()','now()')`;

            pgConnection.query( query, () => {
              remove = new Remove(payload);
              spyOn(remove, "_buildPayload").and.callThrough();
              spyOn(remove, "me").and.callThrough();
              remove.run()
                  .then( res => {
                    result = res;

                    done();
                  });
            });
          });
        });

        it("calls the method", () => {
          expect(remove._buildPayload).toHaveBeenCalled();
          expect(remove.me).toHaveBeenCalled();
        });

        it("returns the payload with text 'Todo Pasa...'", () => {
          expect(result).toEqual({ channel: "C03CFASU7", text: "Todo Pasa...", type: "message" });
        });

        it("removes the user id", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });
      });

      describe("The user has already been removed", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            let query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${payload.user}','now()','now()')`;

            pgConnection.query( query, () => {
              remove = new Remove(payload);
              remove.run()
                  .then( () => {
                    remove.run()
                        .then( res => {
                          result = res;
                          done();
                        });
                  });
            });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ channel: "C03CFASU7", text: "Todo Pasa...", type: "message" });
        });

        it("removes the user id", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });
      }); //The user has been removeed
    }); // with "juego"

    describe("with 'baja <usuario>'", () => {
      let userId = "U089DAS89";

      beforeEach( () => {
        payload.text = `baja <@${userId}>`;
      });

      describe("first time", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            let query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${userId}','now()','now()')`;

            pgConnection.query( query, () => {
              query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${payload.user}','now()','now()')`;

              pgConnection.query( query, () => {
                remove = new Remove(payload);
                spyOn(remove, "_buildPayload").and.callThrough();
                spyOn(remove, "another").and.callThrough();
                remove.run()
                    .then( res => {
                      result = res;

                      done();
                    });
              });
            });
          });
        });

        it("calls the method", () => {
          expect(remove._buildPayload).toHaveBeenCalled();
          expect(remove.another).toHaveBeenCalled();
        });

        it("returns the payload with text 'Todo Pasa...'", () => {
          expect(result).toEqual({ channel: "C03CFASU7", text: "Todo Pasa...", type: "message" });
        });

        it("removes the user id", done => {
          let query = `SELECT * FROM players WHERE user_id = '${userId}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });

        it("does not remove the user who write", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).not.toEqual([]);

            done();
          });
        });
      });

      describe("The user has already been removeed", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            let query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${userId}','now()','now()')`;

            pgConnection.query( query, () => {
              query = `INSERT INTO players (user_id, created_at, updated_at) VALUES ('${payload.user}','now()','now()')`;

              pgConnection.query( query, () => {
                remove = new Remove(payload);
                remove.run()
                    .then( () => {
                      remove.run()
                          .then( res => {
                            result = res;
                            done();
                          });
                    });
              });
            });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ channel: "C03CFASU7", text: "Todo Pasa...", type: "message" });
        });

        it("does not remove the user who write", done => {
          let query = `SELECT * FROM players WHERE user_id = '${payload.user}';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).not.toEqual([]);

            done();
          });
        });
      }); //The user has been removeed

      describe("invalid user", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            payload.text = `baja @fakeUser`;
            remove = new Remove(payload);
            remove.run()
                .then( () => {
                  remove.run()
                      .then( res => {
                        result = res;
                        done();
                      });
                });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ channel: "C03CFASU7", text: "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.", type: "message" });
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
            payload.text = `baja fakeUser`;
            remove = new Remove(payload);
            remove.run()
                .then( () => {
                  remove.run()
                      .then( res => {
                        result = res;
                        done();
                      });
                });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ channel: "C03CFASU7", text: "Falto el nombre o pusiste cualquier cosa, no me hagas perder el tiempo.", type: "message" });
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
}); // remove
