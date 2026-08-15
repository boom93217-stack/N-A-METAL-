import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createContactMessage: vi.fn(),
}));

import * as db from "./db";
import { appRouter } from "./routers";

describe("contact.submit", () => {
  beforeEach(() => {
    vi.mocked(db.createContactMessage).mockReset();
  });

  it("stores a valid public form message", async () => {
    vi.mocked(db.createContactMessage).mockResolvedValue(42);
    const caller = appRouter.createCaller({} as never);

    const result = await caller.contact.submit({
      name: "Noman Ahmed",
      email: "noman@example.com",
      phone: "+971 50 123 4567",
      message: "I would like to discuss a custom exhibition stand.",
    });

    expect(result).toEqual({ success: true, messageId: 42 });
    expect(db.createContactMessage).toHaveBeenCalledWith({
      name: "Noman Ahmed",
      email: "noman@example.com",
      phone: "+971 50 123 4567",
      subject: "General enquiry",
      message: "I would like to discuss a custom exhibition stand.",
    });
  });
});
