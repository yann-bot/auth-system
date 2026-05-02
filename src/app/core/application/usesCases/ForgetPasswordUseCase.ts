import type { Email } from "../../domain/value-objects/email.value-object";
import type { AuthProvider } from "../ports/auth.provider";

export class ForgetPasswordUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(email: Email, redirectTo?: string): Promise<void> {
    await this.authProvider.forgetPassword(email, redirectTo);
  }
}
