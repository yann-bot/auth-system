import { describe, expect, it } from "vitest";

import { CreateUserUseCase } from "@src/app/core/application/usesCases/CreateUserUseCase";
import type {
  AuthProvider,
  SignInResult,
  SignUpInput,
} from "@src/app/core/application/ports/auth.provider";
import { User } from "@src/app/core/domain/entities/user.entity";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";
import { Password } from "@src/app/core/domain/value-objects/password.value-object";

describe("CreateUserUseCase", () => {
  it("forwards the sign-up input to the auth provider", async () => {
    const expectedUser = new User("u1", "Alice", new Email("alice@example.com"));
    const calls: SignUpInput[] = [];
    const authProvider = {
      signUp: async (input: SignUpInput): Promise<SignInResult> => {
        calls.push(input);
        return { user: expectedUser, sessionToken: "session-abc" };
      },
    } as unknown as AuthProvider;

    const useCase = new CreateUserUseCase(authProvider);
    const result = await useCase.execute(
      "Alice",
      new Email("alice@example.com"),
      new Password("password123"),
    );

    expect(result.user).toBe(expectedUser);
    expect(result.sessionToken).toBe("session-abc");
    expect(calls).toHaveLength(1);
    expect(calls[0]?.name).toBe("Alice");
    expect(calls[0]?.email.getValue()).toBe("alice@example.com");
    expect(calls[0]?.password.getValue()).toBe("password123");
  });

  it("propagates errors from the auth provider", async () => {
    const authProvider = {
      signUp: async () => {
        throw new Error("Email already in use");
      },
    } as unknown as AuthProvider;

    const useCase = new CreateUserUseCase(authProvider);

    await expect(
      useCase.execute(
        "Alice",
        new Email("alice@example.com"),
        new Password("password123"),
      ),
    ).rejects.toThrow("Email already in use");
  });
});
