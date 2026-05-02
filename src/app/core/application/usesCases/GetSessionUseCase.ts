import type { AuthProvider, SessionInfo } from "../ports/auth.provider";

export class GetSessionUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute(sessionToken: string): Promise<SessionInfo | null> {
    return this.authProvider.getSession(sessionToken);
  }
}
