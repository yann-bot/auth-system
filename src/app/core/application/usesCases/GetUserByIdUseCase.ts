
import { User } from "@domain/entities/user.entity";
import type { UserRepo } from "../ports/user.ports";
import { UserNotFoundError } from "@errors/user.error";



export class GetUserByIdUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(userId: string): Promise<User | null> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const user = await this.userRepo.getUserById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    
    return user;
  }
}