import { describe, expect, it } from "vitest";

import { GetAllUsersUseCase } from "@src/app/core/application/usesCases/GetAllUsersUseCase";
import { User } from "@src/app/core/domain/entities/user.entity";
import { Email } from "@src/app/core/domain/value-objects/email.value-object";
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

describe("GetAllUsersUseCase", () => {
  it("should return an empty array when there are no users", async () => {
    const userRepository = new UserInMemoryRepository();
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);

    const users = await getAllUsersUseCase.execute();

    expect(users).toEqual([]);
  });

  it("should return the users stored in the repository", async () => {
    const userRepository = new UserInMemoryRepository();
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    const user = createTestUser();

    userRepository.save(user);

    const users = await getAllUsersUseCase.execute();

    expect(users).toHaveLength(1);
    expect(users[0]?.getId()).toBe(user.getId());
    expect(users[0]?.getEmail()).toBe("alice@example.com");
  });
});
