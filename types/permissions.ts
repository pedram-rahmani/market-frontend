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

  // Content & Communication
  COMMENTS_MANAGE: "comments.manage",
  QUESTIONS_MANAGE: "questions.manage",
  TICKETS_VIEW: "tickets.view",
  TICKETS_REPLY: "tickets.reply",

  // Finance & Reporting
  ORDERS_VIEW: "orders.view",
  ORDERS_EDIT: "orders.edit",
  FINANCIAL_REPORTS: "financial.reports",

  // System Settings
  SETTINGS_EDIT: "settings.edit",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  [PERMISSIONS.USERS_VIEW]: "مشاهده لیست کاربران",
  [PERMISSIONS.USERS_CREATE]: "افزودن کاربر جدید",
  [PERMISSIONS.USERS_EDIT]: "ویرایش اطلاعات کاربران",
  [PERMISSIONS.USERS_DELETE]: "حذف یا آرشیو کاربران",
  [PERMISSIONS.USERS_RESTORE]: "بازیابی کاربران حذف شده",
  [PERMISSIONS.USERS_PROMOTE]: "ارتقا نقش کاربران",
  [PERMISSIONS.USERS_DEMOTE]: "تنزل نقش کاربران",
  [PERMISSIONS.USERS_FORCE_DELETE]: "حذف دائمی کاربران",
  [PERMISSIONS.PRODUCTS_VIEW]: "مشاهده لیست محصولات",
  [PERMISSIONS.PRODUCTS_CREATE]: "افزودن محصول جدید",
  [PERMISSIONS.PRODUCTS_EDIT]: "ویرایش محصولات",
  [PERMISSIONS.PRODUCTS_DELETE]: "حذف محصولات",

  [PERMISSIONS.CATEGORIES_VIEW]: "مشاهده دسته‌بندی‌ها",
  [PERMISSIONS.CATEGORIES_CREATE]: "ایجاد دسته‌بندی",
  [PERMISSIONS.CATEGORIES_EDIT]: "ویرایش دسته‌بندی",
  [PERMISSIONS.CATEGORIES_DELETE]: "حذف دسته‌بندی",

  [PERMISSIONS.COMMENTS_MANAGE]: "مدیریت نظرات",
  [PERMISSIONS.QUESTIONS_MANAGE]: "پاسخ به سوالات",
  [PERMISSIONS.TICKETS_VIEW]: "مشاهده تیکت‌ها",
  [PERMISSIONS.TICKETS_REPLY]: "پاسخ به تیکت‌ها",
  [PERMISSIONS.ORDERS_VIEW]: "مشاهده سفارشات",
  [PERMISSIONS.ORDERS_EDIT]: "تغییر وضعیت سفارشات",
  [PERMISSIONS.FINANCIAL_REPORTS]: "گزارشات مالی",
  [PERMISSIONS.SETTINGS_EDIT]: "تغییر تنظیمات سایت",
};

// Grouped permissions for better UX in forms
export const PERMISSION_GROUPS = {
  users: {
    label: "User Management",
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
    label: "Product Management",
    permissions: [
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.PRODUCTS_DELETE,
    ],
  },
  categories: {
    label: "Category Management",
    permissions: [
      PERMISSIONS.CATEGORIES_VIEW,
      PERMISSIONS.CATEGORIES_CREATE,
      PERMISSIONS.CATEGORIES_EDIT,
      PERMISSIONS.CATEGORIES_DELETE,
    ],
  },
  content: {
    label: "Content & Support",
    permissions: [
      PERMISSIONS.COMMENTS_MANAGE,
      PERMISSIONS.QUESTIONS_MANAGE,
      PERMISSIONS.TICKETS_VIEW,
      PERMISSIONS.TICKETS_REPLY,
    ],
  },
  finance: {
    label: "Finance & Reports",
    permissions: [
      PERMISSIONS.ORDERS_VIEW,
      PERMISSIONS.ORDERS_EDIT,
      PERMISSIONS.FINANCIAL_REPORTS,
    ],
  },
  settings: {
    label: "Settings",
    permissions: [PERMISSIONS.SETTINGS_EDIT],
  },
} as const;

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(PERMISSIONS);
