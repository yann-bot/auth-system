import type { Password } from "../../domain/value-objects/password.value-object";
import type { AuthProvider } from "../ports/auth.provider";

export class ChangePasswordUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(
    sessionToken: string,
    currentPassword: Password,
    newPassword: Password,
  ): Promise<void> {
    await this.authProvider.changePassword(
      sessionToken,
      currentPassword,
      newPassword,
    );
  }
}
