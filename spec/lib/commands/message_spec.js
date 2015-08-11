import Message from "../../../lib/commands/message";

describe("Message command", () => {
  let payload;
  let message;

  beforeEach(() => {
    payload = { "type": "message",
                "channel": "C03CFASU7",
                "user": "U03BKS790",
                "text": "msg:Algo",
                "ts": "1438279849.000552",
                "team": "T02TUBDT4"
              };
  });

  describe("validate is", () => {
    it("with \"msg:a que hora se juega? como siempre\" return true", () => {
      expect(Message.is("msg:a que hora se juega? como siempre")).toEqual(true);
    });

    it("with \"msg:lista", () => {
      expect(Message.is("msg:lista")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Message.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      message = new Message(payload);
    });

    it("returns 'Message'", () => {
      expect(message.name).toEqual("Message");
    });
  });

  describe("run", () => {
    beforeEach(() => {
      GLOBAL.__ID__ = 1;
      message = new Message(payload);
      spyOn(message, "_buildPayload").and.callThrough();
    });

    it("returns the payload with text 'Algo'", done => {
      message.run()
          .then( result => {
            expect(result).toEqual({id: 1, channel: "C03CFASU7", text: "Algo", type: "message" });
            done();
          });
    });

    it("calls the _buildPayload method", done => {
      message.run()
          .then( () => {
            expect(message._buildPayload).toHaveBeenCalled();
            done();
          });
    });

    describe("Different channel id", () => {
      beforeEach(() => {
        GLOBAL.__ID__ = 2;
        payload.channel = "anotherChannel";
        message = new Message(payload);
      });

      it("returns the payload with text 'Alog' and channel 'C03CFASU7'", done => {
        message.run()
            .then( result => {
              expect(result).toEqual({ id: 2, channel: "C03CFASU7", text: "Algo", type: "message" });
              done();
            });
      });
    });
  });
});
