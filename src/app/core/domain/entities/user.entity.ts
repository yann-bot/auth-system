import type { Email } from "../value-objects/email.value-object";

export class User {
  private id: string;
  private name: string;
  private email: string;
  private image?: string;
  private emailVerified: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: Email,
    emailVerified: boolean = false,
    image?: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.name = name;
    this.email = email.getValue();
    this.image = image;
    this.emailVerified = emailVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getImage(): string | undefined {
    return this.image;
  }

  getEmailVerified(): boolean {
    return this.emailVerified;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  changeName(newName: string) {
    if (!newName) throw new Error("Name required");
    this.name = newName;
  }
}
