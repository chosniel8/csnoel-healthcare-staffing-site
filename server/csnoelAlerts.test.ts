import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const insert = vi.fn(async () => ({ error: null }));
  return {
    insert,
    from: vi.fn(() => ({ insert })),
    notifyOwner: vi.fn(async () => true),
  };
});

vi.mock("./supabase", () => ({ supabase: { from: mocks.from } }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));

import { dispatchOwnerAlert } from "./csnoelServices";

describe("CSNoel owner alert delivery", () => {
  beforeEach(() => {
    mocks.from.mockClear();
    mocks.insert.mockClear();
    mocks.notifyOwner.mockClear();
  });

  it("records an in-app alert and dispatches the owner notification", async () => {
    await dispatchOwnerAlert(
      "lead",
      "6cb288bb-d73d-4b0d-a6a4-c460d1ca39cf",
      "New CSNoel staffing lead",
      "A facility lead was captured.",
    );

    expect(mocks.from).toHaveBeenCalledWith("owner_notifications");
    expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
      kind: "lead",
      related_entity_id: "6cb288bb-d73d-4b0d-a6a4-c460d1ca39cf",
    }));
    expect(mocks.notifyOwner).toHaveBeenCalledWith({
      title: "New CSNoel staffing lead",
      content: "A facility lead was captured.",
    });
  });
});
