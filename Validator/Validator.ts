import { Rules, ValidationRule } from "./Rules";
import Regexes from "./Regexes";

const messages = {
  required: "این فیلد نمیتواند خالی باشد.",
  minLength: (min: number) => `تعداد کاراکترها نمیتواند کمتر از ${min} باشد.`,
  maxLength: (max: number) => `بیشتر از ${max} کاراکتر نمیتوانید وارد کنید.`,
  usernameInvalid: "نام کاربری باید شامل حروف انگلیسی یا فارسی و اعداد باشد.",
  emailInvalid: "ایمیل وارد شده معتبر نمیباشد.",
  passwordInvalid: "رمز عبور باید شامل حروف انگلیسی، عدد و کاراکترهای خاص (!@#$%^&*) باشد.",
  passwordNotConfirmed: "رمز عبور با تکرار آن مطابقت ندارد.",
  numberInvalid: "لطفاً فقط عدد وارد کنید.",
  maxValueExceeded: (max: number) => `عدد وارد شده نباید بیشتر از ${max} باشد.`
};

const validator = (
  value: string,
  validations: ValidationRule[],
  allInputs: any = {},
) => {
  const errors: string[] = [];
  const trimmedValue = value.trim();
  const isRequired = validations.some((v) => v.value === Rules.requiredValue);
  if (isRequired && trimmedValue.length === 0) {
    return [messages.required];
  }

  if (trimmedValue.length === 0 && !isRequired) return null;

  validations.forEach((validation) => {
    switch (validation.value) {
      case Rules.minValue:
        if (trimmedValue.length < (validation as any).min) {
          errors.push(messages.minLength((validation as any).min));
        }
        break;

      case Rules.maxLength:
        if (trimmedValue.length > (validation as any).max) {
          errors.push(messages.maxLength((validation as any).max));
        }
        break;

      case Rules.maxNumber:
        if (Number(trimmedValue) > (validation as any).max) {
          errors.push(messages.maxValueExceeded((validation as any).max));
        }
        break;

      case Rules.usernameValue:
        if (!Regexes.testUsername(trimmedValue)) {
          errors.push(messages.usernameInvalid);
        }
        break;

      case Rules.passwordValue:
        if (!Regexes.testPassword(trimmedValue)) {
          errors.push(messages.passwordInvalid);
        }
        break;

      case Rules.emailValue:
        if (!Regexes.testEmail(trimmedValue)) {
          errors.push(messages.emailInvalid);
        }
        break;

      case Rules.passwordConfirmationValue:
        if (trimmedValue !== allInputs?.password?.value) {
          errors.push(messages.passwordNotConfirmed);
        }
        break;

      case Rules.numberValue:
        if (!Regexes.testNumber(trimmedValue)) {
          errors.push(messages.numberInvalid);
        }
        break;
    }
  });

  return errors.length > 0 ? errors : null;
};

export default validator;