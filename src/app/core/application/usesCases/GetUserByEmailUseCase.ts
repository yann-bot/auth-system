import { User } from "@domain/entities/user.entity";
import type { UserRepo } from "../ports/user.ports";
import type { Email } from "../../domain/value-objects/email.value-object";
import  {UserNotFoundError} from "@errors/user.error";

export class GetUserByEmailUseCase {
  constructor(private userRepo: UserRepo) {}

  async execute(email: Email): Promise<User | null> {
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }
    
    return user;
  }
}