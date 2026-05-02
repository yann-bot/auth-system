import { describe, expect, it } from "vitest";

import { ForgetPasswordUseCase } from "@src/app/core/application/usesCases/ForgetPasswordUseCase";
import type { AuthProvider } from "@src/app/core/application/ports/auth.provider";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";

describe("ForgetPasswordUseCase", () => {
  it("forwards the email and redirect URL to the auth provider", async () => {
    const calls: { email: Email; redirectTo?: string }[] = [];
    const authProvider = {
      forgetPassword: async (email: Email, redirectTo?: string) => {
        calls.push({ email, redirectTo });
      },
    } as unknown as AuthProvider;

    const useCase = new ForgetPasswordUseCase(authProvider);
    await useCase.execute(
      new Email("alice@example.com"),
      "https://app.example.com/reset",
    );

    expect(calls).toHaveLength(1);
    expect(calls[0]?.email.getValue()).toBe("alice@example.com");
    expect(calls[0]?.redirectTo).toBe("https://app.example.com/reset");
  });

  it("forwards the email without a redirect URL when none is provided", async () => {
    const calls: { email: Email; redirectTo?: string }[] = [];
    const authProvider = {
      forgetPassword: async (email: Email, redirectTo?: string) => {
        calls.push({ email, redirectTo });
      },
    } as unknown as AuthProvider;

    const useCase = new ForgetPasswordUseCase(authProvider);
    await useCase.execute(new Email("alice@example.com"));

    expect(calls).toHaveLength(1);
    expect(calls[0]?.email.getValue()).toBe("alice@example.com");
    expect(calls[0]?.redirectTo).toBeUndefined();
  });

  it("propagates errors from the auth provider", async () => {
    const authProvider = {
      forgetPassword: async () => {
        throw new Error("Unable to send reset email");
      },
    } as unknown as AuthProvider;

    const useCase = new ForgetPasswordUseCase(authProvider);

    await expect(
      useCase.execute(new Email("alice@example.com")),
    ).rejects.toThrow("Unable to send reset email");
  });
});
