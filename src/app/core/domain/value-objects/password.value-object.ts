
export class Password {
  private value: string;

  constructor(value: string) {
    if (value.length < 8) {
      throw new Error("Password too short");
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}



