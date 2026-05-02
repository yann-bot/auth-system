import { describe, expect, it } from "vitest";

import { SignOutUseCase } from "@src/app/core/application/usesCases/SignOutUseCase";
import type { AuthProvider } from "@src/app/core/application/ports/auth.provider";

describe("SignOutUseCase", () => {
  it("forwards the session token to the auth provider", async () => {
    const calls: string[] = [];
    const authProvider = {
      signOut: async (sessionToken: string) => {
        calls.push(sessionToken);
      },
    } as unknown as AuthProvider;

    const useCase = new SignOutUseCase(authProvider);
    await useCase.execute("session-abc");

    expect(calls).toEqual(["session-abc"]);
  });

  it("propagates errors from the auth provider", async () => {
    const authProvider = {
      signOut: async () => {
        throw new Error("Session expired");
      },
    } as unknown as AuthProvider;

    const useCase = new SignOutUseCase(authProvider);

    await expect(useCase.execute("session-abc")).rejects.toThrow(
      "Session expired",
    );
  });
});
