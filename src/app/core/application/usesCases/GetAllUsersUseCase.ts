
import { User } from "@domain/entities/user.entity";
import type { UserRepo } from "../ports/user.ports";

export class GetAllUsersUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(): Promise<User[]> {
    return this.userRepo.getAllUsers();
  }
}
