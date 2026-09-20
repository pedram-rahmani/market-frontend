/**
 * Single source of truth for every user-facing message in the app:
 * - VALIDATION_MESSAGES: client-side (regex based) form validation strings used by Validator.ts
 * - SUCCESS_MESSAGES: fallback success strings shown after a request resolves
 * - ERROR_MAPPINGS: server/API error codes, HTTP statuses and Laravel messages translated to Persian
 *
 * Every request/response in the app should resolve its message through this file
 * (getPersianErrorMessage / getSuccessMessage) instead of hardcoding Persian strings elsewhere.
 */
export const VALIDATION_MESSAGES = {
  required: "این فیلد نمی‌تواند خالی باشد.",
  minLength: (min: number) => `تعداد کاراکترها نمی‌تواند کمتر از ${min} باشد.`,
  maxLength: (max: number) => `بیشتر از ${max} کاراکتر نمی‌توانید وارد کنید.`,
  usernameInvalid: "نام کاربری باید شامل حروف انگلیسی یا فارسی و اعداد باشد.",
  nameInvalid: "نام و نام خانوادگی فقط باید شامل حروف و فاصله باشد.",
  emailInvalid: "ایمیل وارد شده معتبر نمی‌باشد.",
  phoneInvalid: "شماره تماس وارد شده معتبر نمی‌باشد.",
  passwordInvalid: "رمز عبور باید شامل حروف انگلیسی، عدد و کاراکترهای خاص (!@#$%^&*) باشد.",
  passwordNotConfirmed: "رمز عبور با تکرار آن مطابقت ندارد.",
  numberInvalid: "لطفاً فقط عدد وارد کنید.",
  maxValueExceeded: (max: number) => `عدد وارد شده نباید بیشتر از ${max} باشد.`,
  formInvalid: "لطفاً همه فیلدهای الزامی را به‌درستی تکمیل کنید.",
};

export const SUCCESS_MESSAGES = {
  created: "با موفقیت ایجاد شد.",
  updated: "با موفقیت ویرایش شد.",
  deleted: "مورد با موفقیت حذف شد.",
  saved: "تغییرات با موفقیت ذخیره شد.",
  approvalChanged: "وضعیت تایید با موفقیت تغییر کرد.",
  loginSuccess: "ورود با موفقیت انجام شد.",
  registerSuccess: "ثبت‌نام با موفقیت انجام شد.",

  userCreated: "کاربر جدید با موفقیت افزوده شد.",
  userDeleted: "کاربر با موفقیت حذف شد.",
  userPromoted: "کاربر با موفقیت به ادمین ارشد ارتقا یافت.",
  userDemoted: "کاربر تنزل درجه یافت.",

  categoryDeleted: "دسته‌بندی با موفقیت حذف شد.",
  couponSaved: "کد تخفیف با موفقیت ذخیره شد.",
  couponDeleted: "کد تخفیف با موفقیت حذف شد.",

  productDeleted: "محصول با موفقیت حذف شد!",
  productUpdated: "محصول با موفقیت ویرایش شد!",
  productCreated: "محصول با موفقیت ثبت شد!",

  siteSettingsSaved: "تنظیمات با موفقیت ذخیره شدند.",
  notificationSent: "پیام با موفقیت ارسال شد.",
  ticketCreated: "پیام شما با موفقیت ثبت شد.",

  addressUpdated: "اطلاعات آدرس با موفقیت بروز شد.",
  orderPlaced: "سفارش شما با موفقیت ثبت شد. در حال انتقال به درگاه...",
  passwordChanged: "رمز عبور با موفقیت تغییر کرد.",
  resetLinkSent: "لینک بازیابی رمز عبور ارسال شد.",

  questionSubmitted: "سوال شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.",
  answerSubmitted: "پاسخ شما با موفقیت ثبت شد.",
  reviewSubmitted: "نظر شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد.",
  reviewReplySubmitted: "پاسخ شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد.",
  reportSubmitted: "گزارش شما با موفقیت ثبت شد.",
  interactionEdited: "مورد با موفقیت ویرایش شد و برای تایید مجدد ارسال شد.",
};

export const ERROR_MAPPINGS: Record<string, string> = {
  // --- General Status Codes ---
  "200": "عملیات با موفقیت انجام شد.",
  "201": "ورود با موفقیت انجام شد.",
  "400": "درخواست نامعتبر است.",
  "401": "احراز هویت انجام نشد.",
  "403": "شما اجازه دسترسی به این بخش را ندارید.",
  "404": "موردی یافت نشد.",
  "422": "خطا در بررسی اطلاعات ورودی.",
  "500": "خطای داخلی سرور. تیم فنی در حال بررسی است.",

  // --- Authentication & Authorization Errors ---
  "USER_NOT_FOUND": "کاربری با این مشخصات پیدا نشد.",
  "WRONG_PASSWORD": "رمز عبور وارد شده اشتباه است.",
  "TOKEN_EXPIRED": "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
  "UNAUTHORIZED": "برای دسترسی به این بخش باید وارد شوید.",
  "FORBIDDEN": "شما اجازه دسترسی به این بخش را ندارید.",
  "ACCOUNT_LOCKED": "حساب کاربری شما موقتاً قفل شده است.",
  "ACCOUNT_DISABLED": "حساب کاربری شما غیرفعال شده است.",

  // --- Common General Validations ---
  "VALIDATION_ERROR": "اطلاعات وارد شده صحیح نیست. لطفاً ورودی‌ها را بررسی کنید.",
  "INVALID_INPUT": "ساختار داده‌های ارسالی درست نیست.",
  "SERVER_ERROR": "خطایی در سمت سرور رخ داده است. لطفاً چند لحظه دیگر دوباره تلاش کنید.",
  "TOO_MANY_REQUESTS": "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.",

  // --- Exact Laravel Messages Fallback ---
  "The username has already been taken.": "این نام کاربری قبلاً انتخاب شده است.",
  "The email has already been taken.": "این ایمیل قبلاً در سیستم ثبت شده است.",
  "The password confirmation does not match.": "تکرار رمز عبور مطابقت ندارد.",
  "The selected username is invalid.": "نام کاربری وارد شده معتبر نمی‌باشد.",
  "The password must be at least 8 characters.": "رمز عبور باید حداقل ۸ کاراکتر باشد.",
  "The email must be a valid email address.": "فرمت ایمیل وارد شده درست نیست.",

  // --- User & Profile Management Errors ---
  "USER_UPDATE_FAILED": "خطا در بروزرسانی اطلاعات کاربر.",
  "USER_DELETE_FAILED": "امکان حذف این کاربر وجود ندارد.",

  // --- Product & Store Errors ---
  "PRODUCT_NOT_FOUND": "محصول مورد نظر پیدا نشد.",
  "PRODUCT_OUT_OF_STOCK": "محصول در انبار موجود نیست.",
  "INVALID_PRICE": "قیمت وارد شده معتبر نیست.",

  // --- File & Upload Errors ---
  "FILE_TOO_LARGE": "حجم فایل انتخابی بیشتر از حد مجاز است.",
  "INVALID_FILE_FORMAT": "فرمت فایل ارسالی پشتیبانی نمی‌شود."
};

/**
 * Resolve a success message either from an explicit server message,
 * a known SUCCESS_MESSAGES key, or a provided fallback string.
 */
export const getSuccessMessage = (
  response: any,
  key?: keyof typeof SUCCESS_MESSAGES,
  fallback: string = SUCCESS_MESSAGES.saved,
): string => {
  const serverMessage = response?.data?.message || response?.message;
  if (serverMessage) return serverMessage;
  if (key) return SUCCESS_MESSAGES[key];
  return fallback;
};

// Persian translation mapping for input fields (Avoiding the word "فیلد")
const FIELD_NAMES: Record<string, string> = {
  name: "نام",
  email: "ایمیل",
  password: "رمز عبور",
  username: "نام کاربری",
  phone: "تلفن",
  role: "نقش کاربر",
  title: "عنوان",
  description: "توضیحات",
  price: "قیمت",
  stock: "موجودی",
  address: "آدرس"
};

/**
 * Intelligent helper function to translate and customize Laravel and Axios errors into fluent Persian
 */
export const getPersianErrorMessage = (error: any, defaultMsg: string = "خطایی رخ داده است."): string => {
  if (!error || !error.response) {
    return error?.message || defaultMsg;
  }

  const status = error.response.status?.toString();
  const data = error.response.data;

  // Handle Laravel validation errors structure
  if (data?.errors && typeof data.errors === "object") {
    const fieldKey = Object.keys(data.errors)[0]; 
    if (fieldKey && Array.isArray(data.errors[fieldKey]) && data.errors[fieldKey].length > 0) {
      const rawMessage = data.errors[fieldKey][0]; 
      const persianField = FIELD_NAMES[fieldKey] || fieldKey;
      const lowerMsg = rawMessage.toLowerCase();
      
      if (lowerMsg.includes("required")) {
        return `«${persianField}» نمی‌تواند خالی باشد!`;
      }
      if (lowerMsg.includes("already been taken")) {
        return `این ${persianField} قبلاً در سیستم ثبت شده است.`;
      }
      if (lowerMsg.includes("min")) {
        return `مقدار «${persianField}» کوتاه‌تر از حد مجاز است.`;
      }
      if (lowerMsg.includes("max")) {
        return `مقدار «${persianField}» بیشتر از حد مجاز است.`;
      }
      if (lowerMsg.includes("email")) {
        return `فرمت ایمیل وارد شده درست نیست.`;
      }
      if (lowerMsg.includes("confirmation") || lowerMsg.includes("does not match")) {
        return `تکرار رمز عبور مطابقت ندارد.`;
      }
      if (lowerMsg.includes("numeric")) {
        return `مقدار «${persianField}» باید فقط شامل اعداد باشد.`;
      }

      return `خطا در ${persianField}: ${rawMessage}`;
    }
  }

  // Handle direct server message or error code
  const rawMessage = data?.message || data?.error || data?.error_code;
  if (rawMessage && ERROR_MAPPINGS[rawMessage]) {
    return ERROR_MAPPINGS[rawMessage];
  }

  // Handle based on HTTP Status Code
  if (status && ERROR_MAPPINGS[status]) {
    return ERROR_MAPPINGS[status];
  }

  return defaultMsg;
};