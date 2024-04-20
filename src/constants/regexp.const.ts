import { EMAIL_BLACKLISTED_CHARS } from ".";

export const numbersOnlyRegex: RegExp = RegExp(/[^\d]/);
export const emailBlacklistedCharsRegex: RegExp = RegExp(
  `[${EMAIL_BLACKLISTED_CHARS}]`
);
