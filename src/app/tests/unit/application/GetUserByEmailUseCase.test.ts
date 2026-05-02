import { describe, expect, it } from "vitest";

import { GetUserByEmailUseCase } from "@src/app/core/application/usesCases/GetUserByEmailUseCase";
import { User } from "@src/app/core/domain/entities/user.entity";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";
import { UserNotFoundError } from "@src/app/core/errors/user.error";
import { UserInMemoryRepository } from "@src/app/outbound/persistence/user.InMemory";

const createTestUser = (overrides?: {
  id?: string;
  name?: string;
  email?: string;
}) =>
  new User(
    overrides?.id ?? crypto.randomUUID(),
    overrides?.name ?? "Alice",
    new Email(overrides?.email ?? "alice@example.com"),
  );

describe("GetUserByEmailUseCase", () => {
  it("should return the user matching the email", async () => {
    const userRepository = new UserInMemoryRepository();
    const useCase = new GetUserByEmailUseCase(userRepository);
    const user = createTestUser();
    userRepository.save(user);

    const found = await useCase.execute(new Email("alice@example.com"));

    expect(found?.getId()).toBe(user.getId());
    expect(found?.getEmail()).toBe("alice@example.com");
  });

  it("should throw UserNotFoundError when no user matches the email", async () => {
    const userRepository = new UserInMemoryRepository();
    const useCase = new GetUserByEmailUseCase(userRepository);

    await expect(
      useCase.execute(new Email("ghost@example.com")),
    ).rejects.toThrow(UserNotFoundError);
  });
});
