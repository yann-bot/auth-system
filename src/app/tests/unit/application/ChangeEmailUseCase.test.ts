import { describe, expect, it } from "vitest";

import { ChangeEmailUseCase } from "@src/app/core/application/usesCases/ChangeEmailUseCase";
import type { AuthProvider } from "@src/app/core/application/ports/auth.provider";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";

describe("ChangeEmailUseCase", () => {
  it("forwards sessionToken and new email to the auth provider", async () => {
    const calls: { sessionToken: string; newEmail: Email }[] = [];
    const authProvider = {
      changeEmail: async (sessionToken: string, newEmail: Email) => {
        calls.push({ sessionToken, newEmail });
      },
    } as unknown as AuthProvider;

    const useCase = new ChangeEmailUseCase(authProvider);
    await useCase.execute("session-abc", new Email("new@example.com"));

    expect(calls).toHaveLength(1);
    expect(calls[0]?.sessionToken).toBe("session-abc");
    expect(calls[0]?.newEmail.getValue()).toBe("new@example.com");
  });

  it("propagates errors from the auth provider", async () => {
    const authProvider = {
      changeEmail: async () => {
        throw new Error("Email already in use");
      },
    } as unknown as AuthProvider;

    const useCase = new ChangeEmailUseCase(authProvider);

    await expect(
      useCase.execute("session-abc", new Email("new@example.com")),
    ).rejects.toThrow("Email already in use");
  });
});
