
export class Error extends globalThis.Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}   