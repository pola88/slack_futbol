import Command from "../../../lib/commands/command";

describe("Command command", () => {
  let payload;
  let command;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "same text",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("throw an exception", () => {
      expect(function() { Command.is("hora"); }).toThrow(Error("Not implemented"));
    });
  });

  describe("name", () => {
    beforeEach(() => {
      command = new Command(payload);
    });

    it("returns 'Command'", () => {
      expect(command.name).toEqual("Unnamed");
    });
  });

  describe("run", () => {
    beforeEach(() => {
      command = new Command(payload);
      spyOn(command, "_buildPayload").and.callThrough();
    });

    it("returns the payload with the same text", done => {
      command.bot = {
        send: (_payload, result) => {
          expect(result).toEqual({id: result.id, channel: "C03CFASU7", text: "same text", type: "message" });
          done();
        }
      };

      command.run();
    });

    it("calls the _buildPayload method", done => {
      command.bot = {
        send: () => {
          expect(command._buildPayload).toHaveBeenCalled();
          done();
        }
      };

      command.run();
    });
  });

  describe("_buildPayload", () => {
    beforeEach(() => {
      command = new Command(payload);
    });

    it("build the payload with the text", () => {
      let result = command._buildPayload("text changed");

      expect(result.id).not.toEqual("");
      expect(result.id).not.toEqual(undefined);
      expect(result.id).not.toEqual(null);
      expect(result).toEqual({ id: result.id, channel: "C03CFASU7", text: "text changed", type: "message" });
    });
  });
});
