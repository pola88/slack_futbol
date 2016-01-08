import Commands from "../../lib/command";

describe("Command", () => {
  let payload;
  let commands;

  beforeEach(() => {
    commands = new Commands(false);
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
      expect(commands.find(payload).constructor.name).toEqual("Time");
    });

    it("returns Add command", () => {
      payload.text = "Juego";
      expect(commands.find(payload).constructor.name).toEqual("Add");
    });

    it("returns Help command", () => {
      payload.text = "Help";
      expect(commands.find(payload).constructor.name).toEqual("Help");
    });

    it("returns List command", () => {
      payload.text = "Lista";
      expect(commands.find(payload).constructor.name).toEqual("List");
    });

    it("returns Phrases command", () => {
      payload.text = "Frases";
      expect(commands.find(payload).constructor.name).toEqual("Phrase");
    });

    it("returns Remove command", () => {
      payload.text = "Baja";
      expect(commands.find(payload).constructor.name).toEqual("Remove");
    });

    it("invalid command", () => {
      payload.text = "Fake";
      expect(commands.find(payload)).toEqual(null);
    });

    it("returns Rain command", () => {
      payload.text = "dicen que llueve";
      expect(commands.find(payload).constructor.name).toEqual("Rain");
    });

    it("returns Start command", () => {
      payload.text = "start";
      expect(commands.find(payload).constructor.name).toEqual("Start");
    });

    it("returns Message command", () => {
      payload.text = "msg:a que hora se juega? como siempre, lista, frases";
      expect(commands.find(payload).constructor.name).toEqual("Message");
    });

    it("returns Random command", () => {
      payload.text = "random";
      expect(commands.find(payload).constructor.name).toEqual("Random");
    });

    it("returns Teams command", () => {
      payload.text = "equipos";
      expect(commands.find(payload).constructor.name).toEqual("Teams");
    });
  });
});
