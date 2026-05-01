import { describe, expect, it } from "vitest";

import { GetUserByIdUseCase } from "@src/app/core/application/usesCases/GetUserByIdUseCase";
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

describe("GetUserByIdUseCase", () => {
  it("should return the user matching the id", async () => {
    const userRepository = new UserInMemoryRepository();
    const useCase = new GetUserByIdUseCase(userRepository);
    const user = createTestUser();
    userRepository.save(user);

    const found = await useCase.execute(user.getId());

    expect(found?.getId()).toBe(user.getId());
    expect(found?.getName()).toBe("Alice");
  });

  it("should throw UserNotFoundError when no user matches the id", async () => {
    const userRepository = new UserInMemoryRepository();
    const useCase = new GetUserByIdUseCase(userRepository);

    await expect(useCase.execute(crypto.randomUUID())).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it("should throw when the id is empty", async () => {
    const userRepository = new UserInMemoryRepository();
    const useCase = new GetUserByIdUseCase(userRepository);

    await expect(useCase.execute("")).rejects.toThrow("User ID is required");
  });
});
