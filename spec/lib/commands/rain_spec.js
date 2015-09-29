import Rain from "../../../lib/commands/rain";

describe("Rain command", () => {
  let payload;
  let rain;

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
    it("with \"lluvia\" return true", () => {
      expect(Rain.is("lluvia")).toEqual(true);
    });

    it("with \"llueve\" return true", () => {
      expect(Rain.is("llueve")).toEqual(true);
    });

    it("with \"llover\" return true", () => {
      expect(Rain.is("dice que va a llover")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Rain.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      rain = new Rain(payload);
    });

    it("returns 'Rain'", () => {
      expect(rain.name).toEqual("Rain");
    });
  });

  describe("run", () => {
    beforeEach(() => {
      rain = new Rain(payload);
      spyOn(rain, "_buildPayload").and.callThrough();
    });

    it("returns the payload with text", done => {
      rain.run()
          .then( result => {
            expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "Quien dice q va a llover?? Va a estar soleado, perfecto para ver el buen futbol.", type: "message" });
            done();
          });
    });

    it("calls the _buildPayload method", done => {
      rain.run()
          .then( () => {
            expect(rain._buildPayload).toHaveBeenCalled();
            done();
          });
    });
  });
});
