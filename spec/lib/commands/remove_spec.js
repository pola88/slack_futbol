import pgConnection from "../../../lib/pg/connection";
import Remove from "../../../lib/commands/remove";

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
              remove.bot = {
                send: (_payload, text) => {
                  result = text;

                  done();
                }
              };

              remove.run();
            });
          });
        });

        it("calls the method", () => {
          expect(remove._buildPayload).toHaveBeenCalled();
          expect(remove.me).toHaveBeenCalled();
        });

        it("returns the payload with text 'galgo: Daaaa...posta te vas a bajar?'", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "galgo: Daaaa...posta te vas a bajar?", type: "message" });
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
              remove.bot = {
                send: () => {
                  remove.bot = {
                    send: (_payload, text) => {
                      result = text;

                      done();
                    }
                  };

                  remove.run();
                }
              };

              remove.run();
            });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "Nunca tuviste huevos para anotarte", type: "message" });
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
                remove.bot = {
                  send: (_payload, text) => {
                    result = text;

                    done();
                  }
                };

                remove.run();
              });
            });
          });
        });

        it("calls the method", () => {
          expect(remove._buildPayload).toHaveBeenCalled();
          expect(remove.another).toHaveBeenCalled();
        });

        it("returns the payload with text 'galgo: Daaaa...posta te vas a bajar?'", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "galgo: Daaaa...posta te vas a bajar?", type: "message" });
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
                remove.bot = {
                  send: () => {
                    remove.bot = {
                      send: (_payload, text) => {
                        result = text;

                        done();
                      }
                    };

                    remove.run();
                  }
                };

                remove.run();
              });
            });
          });
        });

        it("returns the payload with error text", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "Nunca tuviste huevos para anotarte", type: "message" });
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

      describe("the user is not in bot", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            payload.text = `baja @fakeUser`;
            remove = new Remove(payload);
            remove.bot = {
              send: (_payload, text) => {
                result = text;

                done();
              }
            };

            remove.run();
          });
        });

        it("returns the payload with msg", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "Nunca tuviste huevos para anotarte", type: "message" });
        });
      }); //the user is not in bot

      describe("remove with userName", () => {
        beforeAll( done => {
          jasmine.cleanDb( () => {
            let query = `INSERT INTO players (user_name, created_at, updated_at) VALUES ('fakeuser','now()','now()')`;

            pgConnection.query( query, () => {
              payload.text = `baja fakeUser`;
              remove = new Remove(payload);

              remove.bot = {
                send: (_payload, text) => {
                  result = text;

                  done();
                }
              };

              remove.run();
            });
          });
        });

        it("returns the payload with msg", () => {
          expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "galgo: Daaaa...posta te vas a bajar?", type: "message" });
        });

        it("remove user", done => {
          let query = `SELECT * FROM players WHERE user_name = 'fakeUser';`;

          pgConnection.query( query, (selectError, selectResult) => {
            expect(selectError).toEqual(null);
            expect(selectResult.rows).toEqual([]);

            done();
          });
        });
      }); //remove with userName
    }); // with baja <usuario>
  }); // run

  xdescribe("after", () => {
    describe("with captains", () => {
      let result;

      beforeAll(done => {
        jasmine.cleanDb( () => {
          remove = new Remove(payload);

          let query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a1', 'A', true, 'now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a2', 'B', 'now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a3', 'B', true, 'now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a4', 'A', 'now()','now()')";
                pgConnection.query( query, () => {
                  remove.after(payload)
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
        expect(result.text).toEqual("lista");
      });
    });

    describe("without captains", () => {
      let result;

      beforeAll(done => {
        jasmine.cleanDb( () => {
          remove = new Remove(payload);

          let query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a1', 'A', false, 'now()','now()')";
          pgConnection.query( query, () => {
            query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a2', 'B', 'now()','now()')";
            pgConnection.query( query, () => {
              query = "INSERT INTO players (user_id, team, captain, created_at, updated_at) VALUES ('a3', 'B', false, 'now()','now()')";
              pgConnection.query( query, () => {
                query = "INSERT INTO players (user_id, team, created_at, updated_at) VALUES ('a4', 'A', 'now()','now()')";
                pgConnection.query( query, () => {
                  remove.after(payload)
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
        expect(result.text).toEqual("lista");
      });
    });
  });
}); // remove
