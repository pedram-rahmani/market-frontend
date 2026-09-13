export const Rules = {
  requiredValue: "REQUIRED_VALUE",
  minValue: "MIN_VALUE",
  maxLength: "MAX_LENGTH",
  maxNumber: "MAX_NUMBER",
  emailValue: "EMAIL_VALUE",
  nameValue: "NAME_VALUE",
  usernameValue: "USERNAME_VALUE",
  passwordValue: "PASSWORD_VALUE",
  passwordConfirmationValue: "PASSWORDCONFIRMATION_VALUE",
  numberValue: "NUMBER_VALUE",
} as const;

export type ValidationRule = 
  | { value: typeof Rules.requiredValue }
  | { value: typeof Rules.minValue; min: number }
  | { value: typeof Rules.maxLength; max: number }
  | { value: typeof Rules.maxNumber; max: number }
  | { value: typeof Rules.emailValue }
  | { value: typeof Rules.nameValue }
  | { value: typeof Rules.usernameValue }
  | { value: typeof Rules.passwordValue }
  | { value: typeof Rules.passwordConfirmationValue }
  | { value: typeof Rules.numberValue };

export const requiredValidator = (): ValidationRule => ({ value: Rules.requiredValue });
export const minValidator = (min: number): ValidationRule => ({ value: Rules.minValue, min });
export const maxLengthValidator = (max: number): ValidationRule => ({ value: Rules.maxLength, max });
export const maxNumberValidator = (max: number): ValidationRule => ({ value: Rules.maxNumber, max });
export const emailValidator = (): ValidationRule => ({ value: Rules.emailValue });
export const usernameValidator = (): ValidationRule => ({ value: Rules.usernameValue });
export const passwordValidator = (): ValidationRule => ({ value: Rules.passwordValue });
export const passwordConfirmationValidator = (): ValidationRule => ({ 
  value: Rules.passwordConfirmationValue 
});
export const numberValidator = (): ValidationRule => ({ value: Rules.numberValue });