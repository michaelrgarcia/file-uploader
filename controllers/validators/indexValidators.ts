import { body } from "express-validator";

export const validateRegister = [
  body("username").trim(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("confirm-password").custom((value: string, { req }) => {
    if (value === req.body.password) {
      return true;
    } else {
      throw new Error("Passwords do not match.");
    }
  }),
];
