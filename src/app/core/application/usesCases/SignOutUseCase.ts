import type { AuthProvider } from "../ports/auth.provider";

export class SignOutUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(sessionToken: string): Promise<void> {
    await this.authProvider.signOut(sessionToken);
  }
}
