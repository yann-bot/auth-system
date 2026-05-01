import type { AuthProvider } from "../ports/auth.provider";

export class DeleteUserUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(sessionToken: string): Promise<void> {
    await this.authProvider.deleteUser(sessionToken);
  }
}
