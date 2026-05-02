import { describe, expect, it } from "vitest";

import { ResetPasswordUseCase } from "@src/app/core/application/usesCases/ResetPasswordUseCase";
import type { AuthProvider } from "@src/app/core/application/ports/auth.provider";
import { Password } from "@src/app/core/domain/value-objects/password.value-object";

describe("ResetPasswordUseCase", () => {
  it("forwards the token and new password to the auth provider", async () => {
    const calls: { token: string; newPassword: Password }[] = [];
    const authProvider = {
      resetPassword: async (token: string, newPassword: Password) => {
        calls.push({ token, newPassword });
      },
    } as unknown as AuthProvider;

    const useCase = new ResetPasswordUseCase(authProvider);
    await useCase.execute("reset-token-xyz", new Password("newPassword123"));

    expect(calls).toHaveLength(1);
    expect(calls[0]?.token).toBe("reset-token-xyz");
    expect(calls[0]?.newPassword.getValue()).toBe("newPassword123");
  });

  it("throws when the token is empty", async () => {
    const authProvider = {
      resetPassword: async () => {
        throw new Error("auth provider should not be called");
      },
    } as unknown as AuthProvider;

    const useCase = new ResetPasswordUseCase(authProvider);

    await expect(
      useCase.execute("", new Password("newPassword123")),
    ).rejects.toThrow("token is required");
  });

  it("propagates errors from the auth provider", async () => {
    const authProvider = {
      resetPassword: async () => {
        throw new Error("Invalid or expired token");
      },
    } as unknown as AuthProvider;

    const useCase = new ResetPasswordUseCase(authProvider);

    await expect(
      useCase.execute("reset-token-xyz", new Password("newPassword123")),
    ).rejects.toThrow("Invalid or expired token");
  });
});
