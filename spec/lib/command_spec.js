import Commands from "../../lib/command";

describe("Command", () => {
  let payload;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("find", () => {
    it("returns Time command", () => {
      payload.text = "Hora";
      expect(Commands.find(payload).constructor.name).toEqual("Time");
    });

    it("returns Add command", () => {
      payload.text = "Juego";
      expect(Commands.find(payload).constructor.name).toEqual("Add");
    });

    it("returns Help command", () => {
      payload.text = "Help";
      expect(Commands.find(payload).constructor.name).toEqual("Help");
    });

    it("returns List command", () => {
      payload.text = "Lista";
      expect(Commands.find(payload).constructor.name).toEqual("List");
    });

    it("returns Phrases command", () => {
      payload.text = "Frases";
      expect(Commands.find(payload).constructor.name).toEqual("Phrase");
    });

    it("returns Remove command", () => {
      payload.text = "Baja";
      expect(Commands.find(payload).constructor.name).toEqual("Remove");
    });

    it("invalid command", () => {
      payload.text = "Fake";
      expect(Commands.find(payload)).toEqual(null);
    });
  });
});
