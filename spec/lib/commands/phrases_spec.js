import Phrase from "../../../lib/commands/phrases";

describe("Phrase command", () => {
  let payload;
  let phrase;

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
    it("with \"frases\" return true", () => {
      expect(Phrase.is("frases")).toEqual(true);
    });

    it("with \"frase\" return true", () => {
      expect(Phrase.is("frase")).toEqual(true);
    });

    it("with \"Cualquier cosa\" return true", () => {
      expect(Phrase.is("Cualquier cosa")).toEqual(false);
    });
  });

  describe("name", () => {
    beforeEach(() => {
      phrase = new Phrase(payload);
    });

    it("returns 'Phrase'", () => {
      expect(phrase.name).toEqual("Phrase");
    });
  });

  describe("run", () => {
    beforeEach(() => {
      phrase = new Phrase(payload);
      spyOn(phrase, "_buildPayload").and.callThrough();
    });

    it("returns the payload with text", done => {
      phrase.bot = {
        send: (_payload, result) => {
          expect(result.id).toEqual(result.id);
          expect(result.channel).toEqual("C03CFASU7");
          expect(result.text).not.toEqual(undefined);
          expect(result.text).not.toEqual("");
          expect(result.text).toMatch(/_.*_/);
          expect(result.text).not.toEqual(null);
          expect(result.type).toEqual("message");

          done();
        }
      };

      phrase.run();
    });

    describe("Different channel id", () => {
      beforeEach(() => {
        payload.channel = "anotherChannel";
        phrase = new Phrase(payload);
      });

      it("returns the payload with text and current channel", done => {
        phrase.bot = {
          send: (_payload, result) => {
            expect(result.id).toEqual(result.id);
            expect(result.channel).toEqual("anotherChannel");
            expect(result.text).not.toEqual(undefined);
            expect(result.text).not.toEqual("");
            expect(result.text).toMatch(/_.*_/);
            expect(result.text).not.toEqual(null);
            expect(result.type).toEqual("message");

            done();
          }
        };

        phrase.run();
      });
    });
  });
});
