
import type { User } from "@domain/entities/user.entity";
import type { Email } from "@src/app/core/domain/value-objects/email.value-object";
import type { Password } from "@src/app/core/domain/value-objects/password.value-object";

export interface UserRepo {

  getAllUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: Email): Promise<User | null>;
}

export interface UpdateUserData {
  name?: string;
  image?: string;
}

export interface SignUserData {
  email: Email,
  password: Password,
}