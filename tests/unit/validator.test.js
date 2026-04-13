import { validateRequired } from "../../utils/validator.js";

describe("Validator", () => {
  test("should throw error if field missing", () => {
    expect(() =>
      validateRequired(["name"], {})
    ).toThrow("name is required");
  });

  test("should pass if field exists", () => {
    expect(() =>
      validateRequired(["name"], { name: "Test" })
    ).not.toThrow();
  });
});