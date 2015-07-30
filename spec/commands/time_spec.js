import Time from "../../commands/time";

describe("Time command", () => {
  let payload;

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
    beforeEach( () => {
      payload.text = "Hora";
    });

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
});
