import test from "node:test";
import assert from "node:assert/strict";
import { createContactDraft, validateContact } from "../src/lib/contactDraft.js";

test("required fields reject whitespace and malformed email", () => {
  assert.deepEqual(validateContact({ name: "  ", email: "", message: "\n" }), {
    name: "Enter your name.", email: "Enter your email address.", message: "Enter a message.",
  });
  assert.equal(validateContact({ name: "Visitor", email: "not-an-address", message: "Hello" }).email, "Enter a valid email address.");
  assert.deepEqual(validateContact({ name: " Visitor ", email: " visitor+portfolio@example.com ", message: " Hello " }), {});
});

test("draft safely encodes reserved characters, Unicode and multiline message", () => {
  const uri = createContactDraft({ name: " Renée & AJ? ", email: " visitor+tag@example.com ", message: " Hello & thanks? #1\nSecond line = yes. " });
  const [recipient, query] = uri.split("?");
  assert.equal(recipient, "mailto:amal4jith@gmail.com");
  const params = new URLSearchParams(query);
  assert.equal(params.size, 2);
  assert.equal(params.get("subject"), "Portfolio enquiry from Renée & AJ?");
  assert.equal(params.get("body"), "Name: Renée & AJ?\r\nEmail: visitor+tag@example.com\r\n\r\nHello & thanks? #1\r\nSecond line = yes.");
  assert.ok(!uri.includes("\n"));
  assert.ok(!uri.includes(" "));
});

test("name cannot introduce mail headers and existing CRLF is normalized", () => {
  const uri = createContactDraft({ name: "Visitor\r\nBcc: anyone", email: "visitor@example.com", message: "One\r\nTwo\rThree" });
  const params = new URLSearchParams(uri.slice(uri.indexOf("?") + 1));
  assert.equal(params.get("subject"), "Portfolio enquiry from Visitor Bcc: anyone");
  assert.equal(params.size, 2);
  assert.ok(params.get("body").endsWith("One\r\nTwo\r\nThree"));
});
