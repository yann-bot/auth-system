import { describe, expect, it } from "vitest";

import { UpdateUserUseCase } from "@src/app/core/application/usesCases/UpdateUserCase";
import type { AuthProvider } from "@src/app/core/application/ports/auth.provider";
import type { UpdateUserData } from "@src/app/core/application/ports/user.ports";
import { User } from "@src/app/core/domain/entities/user.entity";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";

describe("UpdateUserUseCase", () => {
  it("forwards sessionToken and data to the auth provider", async () => {
    const updatedUser = new User("u1", "Alice 2", new Email("alice@example.com"));
    const calls: { sessionToken: string; data: UpdateUserData }[] = [];
    const authProvider = {
      updateUser: async (sessionToken: string, data: UpdateUserData) => {
        calls.push({ sessionToken, data });
        return updatedUser;
      },
    } as unknown as AuthProvider;

    const useCase = new UpdateUserUseCase(authProvider);
    const result = await useCase.execute("session-abc", { name: "Alice 2" });

    expect(result).toBe(updatedUser);
    expect(calls).toEqual([
      { sessionToken: "session-abc", data: { name: "Alice 2" } },
    ]);
  });
});
