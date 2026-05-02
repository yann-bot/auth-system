import type { User } from "../../domain/entities/user.entity";
import type { Email } from "../../domain/value-objects/email.value-object";
import type { Password } from "../../domain/value-objects/password.value-object";
import type { SignUserData, UpdateUserData } from "./user.ports";

export interface SignUpInput {
  name: string;
  email: Email;
  password: Password;
}

export interface SignInResult {
  user: User;
  sessionToken: string;
}

export interface SessionInfo {
  user: User;
}

export interface AuthProvider {
  signUp(input: SignUpInput): Promise<SignInResult>;
  signIn(input: SignUserData): Promise<SignInResult>;
  signOut(sessionToken: string): Promise<void>;
  getSession(sessionToken: string): Promise<SessionInfo | null>;
  updateUser(sessionToken: string, data: UpdateUserData): Promise<User>;
  deleteUser(sessionToken: string): Promise<void>;
  changeEmail(sessionToken: string, newEmail: Email): Promise<void>;
  changePassword(
    sessionToken: string,
    currentPassword: Password,
    newPassword: Password,
  ): Promise<void>;
  forgetPassword(email: Email, redirectTo?: string): Promise<void>;
  resetPassword(token: string, newPassword: Password): Promise<void>;
}
