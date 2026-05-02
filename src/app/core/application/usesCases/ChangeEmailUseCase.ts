import type { Email } from "../../domain/value-objects/email.value-object";
import type { AuthProvider } from "../ports/auth.provider";

export class ChangeEmailUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(sessionToken: string, newEmail: Email): Promise<void> {
    await this.authProvider.changeEmail(sessionToken, newEmail);
  }
}
