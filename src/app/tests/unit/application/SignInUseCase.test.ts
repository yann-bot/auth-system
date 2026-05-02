import { describe, expect, it } from "vitest";

import { SignInUseCase } from "@src/app/core/application/usesCases/SignInUseCase";
import type {
  AuthProvider,
  SignInResult,
} from "@src/app/core/application/ports/auth.provider";
import type { SignUserData } from "@src/app/core/application/ports/user.ports";
import { User } from "@src/app/core/domain/entities/user.entity";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";
import { Password } from "@src/app/core/domain/value-objects/password.value-object";

describe("SignInUseCase", () => {
  it("forwards the credentials to the auth provider", async () => {
    const expectedUser = new User("u1", "Alice", new Email("alice@example.com"));
    const calls: SignUserData[] = [];
    const authProvider = {
      signIn: async (input: SignUserData): Promise<SignInResult> => {
        calls.push(input);
        return { user: expectedUser, sessionToken: "session-abc" };
      },
    } as unknown as AuthProvider;

    const useCase = new SignInUseCase(authProvider);
    const result = await useCase.execute({
      email: new Email("alice@example.com"),
      password: new Password("password123"),
    });

    expect(result.user).toBe(expectedUser);
    expect(result.sessionToken).toBe("session-abc");
    expect(calls).toHaveLength(1);
    expect(calls[0]?.email.getValue()).toBe("alice@example.com");
    expect(calls[0]?.password.getValue()).toBe("password123");
  });

  it("propagates errors from the auth provider", async () => {
    const authProvider = {
      signIn: async () => {
        throw new Error("Invalid credentials");
      },
    } as unknown as AuthProvider;

    const useCase = new SignInUseCase(authProvider);

    await expect(
      useCase.execute({
        email: new Email("alice@example.com"),
        password: new Password("password123"),
      }),
    ).rejects.toThrow("Invalid credentials");
  });
});
