import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "./contactUtils";

describe("contactMessageSchema", () => {
  it("accepts a complete professional contact request", () => {
    const result = contactMessageSchema.parse({
      name: "Noman Ahmed",
      email: "noman@example.com",
      phone: "+971 50 123 4567",
      message: "I would like to discuss a custom exhibition stand.",
    });

    expect(result.name).toBe("Noman Ahmed");
    expect(result.phone).toBe("+971 50 123 4567");
  });

  it("rejects incomplete requests", () => {
    expect(() => contactMessageSchema.parse({ name: "A", email: "bad", phone: "1", message: "short" })).toThrow();
  });
});
