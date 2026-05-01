import { eq } from "drizzle-orm";
import type { UserRepo } from "../../core/application/ports/user.ports";
import { User } from "../../core/domain/entities/user.entity";
import { Email } from "../../core/domain/value-objects/email.value-object";
import db from "../../../infrastructure/db";
import { user as userTable } from "../../../infrastructure/db/schema";

function toDomainUser(row: {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return new User(
    row.id,
    row.name,
    new Email(row.email),
    row.emailVerified,
    row.image ?? undefined,
    row.createdAt,
    row.updatedAt,
  );
}

export class UserSqliteRepo implements UserRepo {
  async getAllUsers(): Promise<User[]> {
    const rows = await db.select().from(userTable);
    return rows.map(toDomainUser);
  }

  async getUserById(userId: string): Promise<User | null> {
    const rows = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    const row = rows[0];
    return row ? toDomainUser(row) : null;
  }

  async getUserByEmail(email: Email): Promise<User | null> {
    const rows = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email.getValue()))
      .limit(1);

    const row = rows[0];
    return row ? toDomainUser(row) : null;
  }
}
