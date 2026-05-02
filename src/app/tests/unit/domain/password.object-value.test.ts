import { Password } from "../../../core/domain/value-objects/password.value-object";
import {expect, test} from "vitest"

test("should create a password value object", () => {
  expect(new Password("mysecretpassword").getValue()).toBe("mysecretpassword");
});

test("should throw an error if the password is too short", () => {
  expect(() => new Password("short")).toThrow("Password too short");
});