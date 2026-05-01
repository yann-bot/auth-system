import type { User } from "@domain/entities/user.entity";
import type { Email } from "@src/app/core/domain/value-objects/email.value-object";
import type { UserRepo } from "@application/ports/user.ports";

export class UserInMemoryRepository implements UserRepo {
  private users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.find((u) => u.getId() === userId) ?? null;
  }

  async getUserByEmail(email: Email): Promise<User | null> {
    return this.users.find((u) => u.getEmail() === email.getValue()) ?? null;
  }

  save(user: User): void {
    this.users.push(user);
  }
}
