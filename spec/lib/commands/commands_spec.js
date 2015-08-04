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
      GLOBAL.__ID__ = 1;
      spyOn(command, "_buildPayload").and.callThrough();
    });

    it("returns the payload with the same text", done => {
      command.run()
          .then( result => {
            expect(result).toEqual({id: 1, channel: "C03CFASU7", text: "same text", type: "message" });
            done();
          });
    });

    it("calls the _buildPayload method", done => {
      command.run()
          .then( () => {
            expect(command._buildPayload).toHaveBeenCalled();
            done();
          });
    });
  });

  describe("_buildPayload", () => {
    beforeEach(() => {
      GLOBAL.__ID__ = 1;
      command = new Command(payload);
    });

    it("build the payload with the text", () => {
      expect(command._buildPayload("text changed")).toEqual({ id: 1, channel: "C03CFASU7", text: "text changed", type: "message" });
    });

    describe("calls twice incremente id", () => {
      beforeEach(() => {
        GLOBAL.__ID__ = 1;
        command._buildPayload("with id 1");
      });

      it("returns with id 2", () => {
        expect(command._buildPayload("text changed")).toEqual({ id: 2, channel: "C03CFASU7", text: "text changed", type: "message" });
      });
    });
  });
});
