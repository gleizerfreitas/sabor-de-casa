import {
  AdminAuthorizationError,
  AuthenticationRequiredError,
} from "@/src/server/auth/errors";
import { describe, expect, it } from "vitest";

describe("authentication errors", () => {
  it("identifies a missing session", () => {
    expect(new AuthenticationRequiredError()).toBeInstanceOf(Error);
    expect(new AuthenticationRequiredError().name).toBe("AuthenticationRequiredError");
  });

  it("identifies a missing admin authorization", () => {
    expect(new AdminAuthorizationError()).toBeInstanceOf(Error);
    expect(new AdminAuthorizationError().name).toBe("AdminAuthorizationError");
  });
});
