import type { User } from "@domain/entities/user.entity";
import type { UpdateUserData } from "../ports/user.ports";
import type { AuthProvider } from "../ports/auth.provider";

export class UpdateUserUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(sessionToken: string, data: UpdateUserData): Promise<User> {
    return this.authProvider.updateUser(sessionToken, data);
  }
}
