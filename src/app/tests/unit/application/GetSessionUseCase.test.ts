import { describe, expect, it } from "vitest";

import { GetSessionUseCase } from "@src/app/core/application/usesCases/GetSessionUseCase";
import type {
  AuthProvider,
  SessionInfo,
} from "@src/app/core/application/ports/auth.provider";
import { User } from "@src/app/core/domain/entities/user.entity";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";

describe("GetSessionUseCase", () => {
  it("returns the session info for a valid session token", async () => {
    const user = new User("u1", "Alice", new Email("alice@example.com"));
    const expectedSession: SessionInfo = { user };
    const calls: string[] = [];
    const authProvider = {
      getSession: async (sessionToken: string) => {
        calls.push(sessionToken);
        return expectedSession;
      },
    } as unknown as AuthProvider;

    const useCase = new GetSessionUseCase(authProvider);
    const result = await useCase.execute("session-abc");

    expect(result).toBe(expectedSession);
    expect(calls).toEqual(["session-abc"]);
  });

  it("returns null when there is no active session", async () => {
    const authProvider = {
      getSession: async () => null,
    } as unknown as AuthProvider;

    const useCase = new GetSessionUseCase(authProvider);
    const result = await useCase.execute("session-unknown");

    expect(result).toBeNull();
  });
});
