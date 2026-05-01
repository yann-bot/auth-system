import type { Email } from "../../domain/value-objects/email.value-object";
import type { Password } from "../../domain/value-objects/password.value-object";
import type { AuthProvider, SignInResult } from "../ports/auth.provider";

export class createUserUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(name: string, email: Email, password: Password): Promise<SignInResult> {
    return this.authProvider.signUp({ name, email, password });
  }
}
