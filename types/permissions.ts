export const PERMISSIONS = {
  // User Management
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",
  USERS_RESTORE: "users.restore",
  USERS_PROMOTE: "users.promote",
  USERS_DEMOTE: "users.demote",
  USERS_FORCE_DELETE: "users.forceDelete",

  // Product Management
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_EDIT: "products.edit",
  PRODUCTS_DELETE: "products.delete",

  // Category Management
  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_CREATE: "categories.create",
  CATEGORIES_EDIT: "categories.edit",
  CATEGORIES_DELETE: "categories.delete",

  // User Interactions (Comments & Questions)
  INTERACTIONS_VIEW: "interactions.view",
  COMMENTS_APPROVE: "comments.approve",
  COMMENTS_DELETE: "comments.delete",
  COMMENTS_REPLY: "comments.reply",
  COMMENTS_MEDIA_APPROVE: "comments.media.approve",
  QUESTIONS_APPROVE: "questions.approve",
  QUESTIONS_DELETE: "questions.delete",
  QUESTIONS_REPLY: "questions.reply",
  ANSWERS_APPROVE: "answers.approve",

  // Support & Live Chat
  CHATS_VIEW: "chats.view",
  CHATS_REPLY: "chats.reply",
  CHATS_DELETE: "chats.delete",

  // Finance & Reporting
  ORDERS_VIEW: "orders.view",
  ORDERS_EDIT: "orders.edit",
  FINANCIAL_REPORTS: "financial.reports",

  // System Settings
  SETTINGS_EDIT: "settings.edit",
  NOTIFICATIONS_MANAGE: "notifications.manage",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  // User Labels
  [PERMISSIONS.USERS_VIEW]: "مشاهده لیست کاربران",
  [PERMISSIONS.USERS_CREATE]: "افزودن کاربر جدید",
  [PERMISSIONS.USERS_EDIT]: "ویرایش اطلاعات کاربران",
  [PERMISSIONS.USERS_DELETE]: "حذف یا آرشیو کاربران",
  [PERMISSIONS.USERS_RESTORE]: "بازیابی کاربران حذف شده",
  [PERMISSIONS.USERS_PROMOTE]: "ارتقا نقش کاربران",
  [PERMISSIONS.USERS_DEMOTE]: "تنزل نقش کاربران",
  [PERMISSIONS.USERS_FORCE_DELETE]: "حذف دائمی کاربران",
  
  // Product Labels
  [PERMISSIONS.PRODUCTS_VIEW]: "مشاهده لیست محصولات",
  [PERMISSIONS.PRODUCTS_CREATE]: "افزودن محصول جدید",
  [PERMISSIONS.PRODUCTS_EDIT]: "ویرایش محصولات",
  [PERMISSIONS.PRODUCTS_DELETE]: "حذف محصولات",

  // Category Labels
  [PERMISSIONS.CATEGORIES_VIEW]: "مشاهده دسته‌بندی‌ها",
  [PERMISSIONS.CATEGORIES_CREATE]: "ایجاد دسته‌بندی",
  [PERMISSIONS.CATEGORIES_EDIT]: "ویرایش دسته‌بندی",
  [PERMISSIONS.CATEGORIES_DELETE]: "حذف دسته‌بندی",

  // Interactions Labels
  [PERMISSIONS.INTERACTIONS_VIEW]: "مشاهده صفحه تعاملات کاربران",
  [PERMISSIONS.COMMENTS_APPROVE]: "تایید متن نظرات",
  [PERMISSIONS.COMMENTS_DELETE]: "حذف دیدگاه‌ها",
  [PERMISSIONS.COMMENTS_REPLY]: "پاسخ به دیدگاه‌های کاربران",
  [PERMISSIONS.COMMENTS_MEDIA_APPROVE]: "تایید فایل‌های نظرات",
  [PERMISSIONS.QUESTIONS_APPROVE]: "تایید پرسش‌ها",
  [PERMISSIONS.QUESTIONS_DELETE]: "حذف پرسش‌ها و پاسخ‌ها",
  [PERMISSIONS.QUESTIONS_REPLY]: "پاسخ به سوالات کاربران",
  [PERMISSIONS.ANSWERS_APPROVE]: "تایید پاسخ‌ها",

  // Support Labels
  [PERMISSIONS.CHATS_VIEW]: "مشاهده گفتگوهای پشتیبانی",
  [PERMISSIONS.CHATS_REPLY]: "پاسخ به گفتگوهای پشتیبانی",
  [PERMISSIONS.CHATS_DELETE]: "حذف گفتگوهای پشتیبانی",

  // Transactions Labels
  [PERMISSIONS.ORDERS_VIEW]: "مشاهده سفارشات",
  [PERMISSIONS.ORDERS_EDIT]: "تغییر وضعیت سفارشات",
  [PERMISSIONS.FINANCIAL_REPORTS]: "گزارشات مالی",

  // Settings Labels
  [PERMISSIONS.SETTINGS_EDIT]: "تغییر تنظیمات سایت",

  // Notifications Labels
  [PERMISSIONS.NOTIFICATIONS_MANAGE]: "ارسال و مدیریت پیام‌ها",
};

// Grouped permissions for better UX in forms
export const PERMISSION_GROUPS = {
  users: {
    label: "مدیریت کاربران",
    permissions: [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.USERS_RESTORE,
      PERMISSIONS.USERS_PROMOTE,
      PERMISSIONS.USERS_DEMOTE,
      PERMISSIONS.USERS_FORCE_DELETE,
    ],
  },
  products: {
    label: "مدیریت محصولات",
    permissions: [
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.PRODUCTS_DELETE,
    ],
  },
  categories: {
    label: "مدیریت دسته‌بندی‌ها",
    permissions: [
      PERMISSIONS.CATEGORIES_VIEW,
      PERMISSIONS.CATEGORIES_CREATE,
      PERMISSIONS.CATEGORIES_EDIT,
      PERMISSIONS.CATEGORIES_DELETE,
    ],
  },
  interactions: {
    label: "تعاملات کاربران (دیدگاه‌ها و پرسش‌ها)",
    permissions: [
      PERMISSIONS.INTERACTIONS_VIEW,
      PERMISSIONS.COMMENTS_APPROVE,
      PERMISSIONS.COMMENTS_DELETE,
      PERMISSIONS.COMMENTS_REPLY,
      PERMISSIONS.COMMENTS_MEDIA_APPROVE,
      PERMISSIONS.QUESTIONS_APPROVE,
      PERMISSIONS.QUESTIONS_DELETE,
      PERMISSIONS.QUESTIONS_REPLY,
      PERMISSIONS.ANSWERS_APPROVE,
    ],
  },
  support: {
    label: "پشتیبانی و گفتگوهای لایو",
    permissions: [
      PERMISSIONS.CHATS_VIEW,
      PERMISSIONS.CHATS_REPLY,
      PERMISSIONS.CHATS_DELETE,
    ],
  },
  finance: {
    label: "مالی و گزارش‌ها",
    permissions: [
      PERMISSIONS.ORDERS_VIEW,
      PERMISSIONS.ORDERS_EDIT,
      PERMISSIONS.FINANCIAL_REPORTS,
    ],
  },
  settings: {
    label: "تنظیمات سایت",
    permissions: [PERMISSIONS.SETTINGS_EDIT],
  },
  notifications: {
    label: "مدیریت پیام‌ها",
    permissions: [PERMISSIONS.NOTIFICATIONS_MANAGE],
  },
} as const;

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(PERMISSIONS);