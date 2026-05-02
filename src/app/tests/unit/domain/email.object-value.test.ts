import { Email } from "@src/app/core/domain/value-objects/email.value-object";
import {expect, test} from "vitest"

test("should create an email value object", () => {
  expect(new Email("yannouafete@gmail.com").getValue()).toBe("yannouafete@gmail.com");
});

test("should throw an error if the email is invalid", () => {
  expect(() => new Email("invalid")).toThrow("Invalid email");
});