import type { Password } from "../../domain/value-objects/password.value-object";
import type { AuthProvider } from "../ports/auth.provider";

export class ResetPasswordUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(token: string, newPassword: Password): Promise<void> {
    if (!token) {
      throw new Error("token is required");
    }
    await this.authProvider.resetPassword(token, newPassword);
  }
}
