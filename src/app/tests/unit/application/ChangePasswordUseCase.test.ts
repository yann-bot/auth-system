import { describe, expect, it } from "vitest";

import { ChangePasswordUseCase } from "@src/app/core/application/usesCases/ChangePasswordUseCase";
import type { AuthProvider } from "@src/app/core/application/ports/auth.provider";
import { Password } from "@src/app/core/domain/value-objects/password.value-object";

describe("ChangePasswordUseCase", () => {
  it("forwards sessionToken and passwords to the auth provider", async () => {
    const calls: {
      sessionToken: string;
      currentPassword: Password;
      newPassword: Password;
    }[] = [];
    const authProvider = {
      changePassword: async (
        sessionToken: string,
        currentPassword: Password,
        newPassword: Password,
      ) => {
        calls.push({ sessionToken, currentPassword, newPassword });
      },
    } as unknown as AuthProvider;

    const useCase = new ChangePasswordUseCase(authProvider);
    await useCase.execute(
      "session-abc",
      new Password("oldPassword123"),
      new Password("newPassword456"),
    );

    expect(calls).toHaveLength(1);
    expect(calls[0]?.sessionToken).toBe("session-abc");
    expect(calls[0]?.currentPassword.getValue()).toBe("oldPassword123");
    expect(calls[0]?.newPassword.getValue()).toBe("newPassword456");
  });

  it("propagates errors from the auth provider", async () => {
    const authProvider = {
      changePassword: async () => {
        throw new Error("Current password is incorrect");
      },
    } as unknown as AuthProvider;

    const useCase = new ChangePasswordUseCase(authProvider);

    await expect(
      useCase.execute(
        "session-abc",
        new Password("oldPassword123"),
        new Password("newPassword456"),
      ),
    ).rejects.toThrow("Current password is incorrect");
  });
});
