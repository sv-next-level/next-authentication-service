import {
  EMAIL_BLACKLISTED_CHARS,
  emailBlacklistedCharsRegex,
} from "@/constants";
import { ValidationArguments } from "class-validator";

export const getEmailErrorMessage = (
  validationArguments: ValidationArguments
): string => {
  const email: string = validationArguments.value;
  const blacklisted_chars_array: string[] = EMAIL_BLACKLISTED_CHARS.split("");

  const is_blacklisted_chars_exists = emailBlacklistedCharsRegex.test(email);
  if (is_blacklisted_chars_exists) {
    return `Email with ${blacklisted_chars_array} char are not allowed`;
  } else {
    return "Invalid email address";
  }
};
