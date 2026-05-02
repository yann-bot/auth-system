import { describe, expect, it } from "vitest";

import { DeleteUserUseCase } from "@src/app/core/application/usesCases/DeleteUserUseCase";
import type { AuthProvider } from "@src/app/core/application/ports/auth.provider";

describe("DeleteUserUseCase", () => {
  it("forwards the session token to the auth provider", async () => {
    const calls: string[] = [];
    const authProvider = {
      deleteUser: async (sessionToken: string) => {
        calls.push(sessionToken);
      },
    } as unknown as AuthProvider;

    const useCase = new DeleteUserUseCase(authProvider);
    await useCase.execute("session-abc");

    expect(calls).toEqual(["session-abc"]);
  });
});
