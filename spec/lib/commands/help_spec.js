import Help from "../../../lib/commands/help";

describe("Help command", () => {
  let payload;
  let help;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "help",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"help\" return true", () => {
      expect(Help.is("help")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Help.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      help = new Help(payload);
    });

    it("returns 'Help'", () => {
      expect(help.name).toEqual("Help");
    });
  });

  describe("run", () => {
    beforeEach(() => {
      help = new Help(payload);
      spyOn(help, "_buildPayload").and.callThrough();
    });

    it("returns the payload with menu", done => {
      help.bot = {
        send: (_payload, result) => {
          let expectedText = "Vos decime y te digo: \n";
          expectedText += "* `hora` _Cuando se juega_ \n";
          expectedText += "* `quienes` `lista` `jugadores` _Quienes juegan_ \n";
          expectedText += "* `juego` `juega @usuario` _Si jugas o agregas a alguno_ \n";
          expectedText += "* `baja` `baja @usuario` _Si te bajas o si no juega alguno_ \n";
          expectedText += "* `frases` _Te dira algo sabio de la vida (o no)_ \n";
          expectedText += "* `random` _Te arma super equipos_ \n";
          expectedText += "* `equipos` _Te muestra el ultimo gran random \n";

          expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: expectedText, type: "message" });

          done();
        }
      };

      help.run();
    });
  });
});
