import type { AuthProvider, SignInResult } from "../ports/auth.provider";
import type { SignUserData } from "../ports/user.ports";

export class SignInUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(input: SignUserData): Promise<SignInResult> {
    return this.authProvider.signIn(input);
  }
}
