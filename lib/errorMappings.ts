export const ERROR_MAPPINGS: Record<string, string> = {
  // --- General Status Codes ---
  "200": "عملیات با موفقیت انجام شد.",
  "201": "ورود با موفقیت انجام شد.",
  "400": "درخواست نامعتبر است.",
  "401": "احراز هویت انجام نشد.",
  "403": "شما اجازه دسترسی به این بخش را ندارید.",
  "404": "موردی یافت نشد.",
  "422": "خطا در اعتبار سنجی ورودی‌ها.",
  "500": "خطای داخلی سرور. تیم فنی در حال بررسی است.",

  // --- Authentication Errors (Specific backend error_codes) ---
  "USER_NOT_FOUND": "کاربری با این مشخصات یافت نشد.",
  "WRONG_PASSWORD": "رمز عبور وارد شده اشتباه است.",
  "TOKEN_EXPIRED": "نشست (Session) شما منقضی شده است. لطفاً دوباره وارد شوید.",
  "UNAUTHORIZED": "برای دسترسی به این بخش باید وارد شوید.",
  "FORBIDDEN": "شما اجازه دسترسی به این بخش را ندارید.",

  // --- Registration Errors (Common Laravel validation messages) ---
  "The username has already been taken.": "این نام کاربری قبلاً انتخاب شده است.",
  "The email has already been taken.": "این ایمیل قبلاً در سیستم ثبت شده است.",
  "The password confirmation does not match.": "تکرار رمز عبور مطابقت ندارد.",
  "The selected username is invalid.": "نام کاربری وارد شده معتبر نمی‌باشد.",

  // --- Password/Input Validations ---
  "The password must be at least 8 characters.": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
  "The password must not be greater than 16 characters.": "رمز عبور نباید بیشتر از ۱۶ کاراکتر باشد.",
  "The email must be a valid email address.": "فرمت ایمیل وارد شده صحیح نیست.",
  "The name must be at least 3 characters.": "نام باید حداقل ۳ کاراکتر باشد.",

  // --- General Validation Errors ---
  "VALIDATION_ERROR": "اطلاعات وارد شده صحیح نیست. لطفاً ورودی‌ها را بررسی کنید.",
  "INVALID_INPUT": "فرمت داده‌های ارسالی معتبر نمی‌باشد.",

  // --- Server & Rate Limiting ---
  "SERVER_ERROR": "خطایی در سمت سرور رخ داده است. لطفاً چند لحظه دیگر دوباره تلاش کنید.",
  "TOO_MANY_REQUESTS": "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.",

  // --- Smart Matching Keywords (For dynamic Laravel validation messages) ---
  "already been taken": "این اطلاعات قبلاً در سیستم ثبت شده است.",
  "does not match": "تکرار رمز عبور مطابقت ندارد.",
  "at least 8 characters": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
  "at least 3 characters": "این فیلد باید حداقل ۳ کاراکتر باشد."
};