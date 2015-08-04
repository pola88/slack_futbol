import Time from "../../../lib/commands/time";

describe("Time command", () => {
  let payload;
  let time;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "hora",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"hora\" return true", () => {
      expect(Time.is("hora")).toEqual(true);
    });

    it("with \"a que hora?\" return true", () => {
      expect(Time.is("a que hora?")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Time.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      time = new Time(payload);
    });

    it("returns 'Time'", () => {
      expect(time.name).toEqual("Time");
    });
  });

  describe("run", () => {
    beforeEach(() => {
      GLOBAL.__ID__ = 1;
      time = new Time(payload);
      spyOn(time, "_buildPayload").and.callThrough();
    });

    it("returns the payload with text '8:45'", done => {
      time.run()
          .then( result => {
            expect(result).toEqual({id: 1, channel: "C03CFASU7", text: "8:45", type: "message" });
            done();
          });
    });

    it("calls the _buildPayload method", done => {
      time.run()
          .then( () => {
            expect(time._buildPayload).toHaveBeenCalled();
            done();
          });
    });

    describe("Different channel id", () => {
      beforeEach(() => {
        GLOBAL.__ID__ = 2;
        payload.channel = "anotherChannel";
        time = new Time(payload);
      });

      it("returns the payload with text '8:45' and current channel", done => {
        time.run()
            .then( result => {
              expect(result).toEqual({ id: 2, channel: "anotherChannel", text: "8:45", type: "message" });
              done();
            });
      });
    });
  });
});
