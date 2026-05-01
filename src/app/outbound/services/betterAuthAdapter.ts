import type {
  AuthProvider,
  SessionInfo,
  SignInResult,
  SignUpInput,
} from "../../core/application/ports/auth.provider";
import type {
  SignUserData,
  UpdateUserData,
} from "../../core/application/ports/user.ports";
import { User } from "../../core/domain/entities/user.entity";
import { Email } from "../../core/domain/value-objects/email.value-object";
import { auth } from "./better-auth";

type BetterAuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function toDomainUser(raw: BetterAuthUser): User {
  return new User(
    raw.id,
    raw.name,
    new Email(raw.email),
    raw.emailVerified,
    raw.image ?? undefined,
    raw.createdAt,
    raw.updatedAt,
  );
}

function bearerHeaders(sessionToken: string): Headers {
  return new Headers({ authorization: `Bearer ${sessionToken}` });
}

export class BetterAuthAdapter implements AuthProvider {
  async signUp(input: SignUpInput): Promise<SignInResult> {
    const result = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email.getValue(),
        password: input.password.getValue(),
      },
    });
    if (!result.token) {
      throw new Error("Sign-up did not return a session token");
    }
    return {
      user: toDomainUser(result.user),
      sessionToken: result.token,
    };
  }

  async signIn(input: SignUserData): Promise<SignInResult> {
    const result = await auth.api.signInEmail({
      body: {
        email: input.email.getValue(),
        password: input.password.getValue(),
      },
    });
    return {
      user: toDomainUser(result.user),
      sessionToken: result.token,
    };
  }

  async signOut(sessionToken: string): Promise<void> {
    await auth.api.signOut({ headers: bearerHeaders(sessionToken) });
  }

  async getSession(sessionToken: string): Promise<SessionInfo | null> {
    const result = await auth.api.getSession({
      headers: bearerHeaders(sessionToken),
    });
    if (!result) return null;
    return { user: toDomainUser(result.user) };
  }

  async updateUser(
    sessionToken: string,
    data: UpdateUserData,
  ): Promise<User> {
    // better-auth's updateUser endpoint only supports name/image. Email and
    // password changes go through changeEmail / changePassword endpoints.
    const body: { name?: string; image?: string } = {};
    if (data.name !== undefined) body.name = data.name;
    if (data.image !== undefined) body.image = data.image;

    await auth.api.updateUser({
      body,
      headers: bearerHeaders(sessionToken),
    });

    const session = await auth.api.getSession({
      headers: bearerHeaders(sessionToken),
    });
    if (!session) {
      throw new Error("Session lost after updateUser");
    }
    return toDomainUser(session.user);
  }

  async deleteUser(sessionToken: string): Promise<void> {
    await auth.api.deleteUser({
      body: {},
      headers: bearerHeaders(sessionToken),
    });
  }
}
