const isBrowser = typeof window !== "undefined";
const envBase = import.meta.env.VITE_API_URL;
const runtimeBase = isBrowser ? window.__BOOKHIVE_API_URL__ : undefined;
const isLocalhost =
  isBrowser && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

const normalizeBase = (value) => (value ? value.replace(/\/+$/, "") : value);
const fallbackBase = isLocalhost ? "http://localhost:5000" : "";
const resolvedBase = normalizeBase(runtimeBase || envBase || fallbackBase || "");
const isBadProdBase =
  !isLocalhost &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(resolvedBase || "");

export const API_BASE = isBadProdBase ? "" : resolvedBase;

if ((isBadProdBase || !API_BASE) && isBrowser) {
  // eslint-disable-next-line no-console
  console.error(
    "API base URL is not configured for this deployment. Set VITE_API_URL in Vercel or define window.__BOOKHIVE_API_URL__."
  );
}

export const endpoints = {
  auth: {
    sendRegisterOtp: "/api/users/register/send-otp",
    verifyRegisterOtp: "/api/users/register/verify-otp",
    register: "/api/users/register",
    login: "/api/users/login",
    sendForgotPasswordOtp: "/api/users/forgot-password/send-otp",
    resetPassword: "/api/users/forgot-password/reset",
    changePassword: "/api/users/change-password",
    profile: "/api/users/profile",
  },
  books: {
    list: "/api/books",
    categories: "/api/books/categories",
    stats: "/api/books/stats-books",
    detail: (id) => `/api/books/${id}`,
    create: "/api/books",
    update: (id) => `/api/books/${id}`,
    remove: (id) => `/api/books/${id}`,
  },
  reviews: {
    list: "/api/reviews",
    byBook: (id) => `/api/reviews/book/${id}`,
    add: "/api/reviews",
    update: (id) => `/api/reviews/${id}`,
    remove: (id) => `/api/reviews/${id}`,
  },
  cart: {
    get: "/api/cart",
    add: "/api/cart",
    remove: (itemId) => `/api/cart/${itemId}`,
    update: (itemId) => `/api/cart/${itemId}`,
  },
  wishlist: {
    get: "/api/wishlist",
    add: "/api/wishlist",
    remove: (bookId) => `/api/wishlist/${bookId}`,
  },
  address: {
    get: "/api/address",
    add: "/api/address",
    update: (id) => `/api/address/${id}`,
    remove: (id) => `/api/address/${id}`,
  },
  orders: {
    create: "/api/orders",
    list: "/api/orders",
    detail: (id) => `/api/orders/${id}`,
    cancel: (id) => `/api/orders/${id}/cancel`,
  },
  admin: {
    dashboard: "/api/admin/dashboard",
    users: "/api/admin/users",
    deleteUser: (id) => `/api/admin/users/${id}`,
    updateRole: (id) => `/api/admin/users/${id}/role`,
    toggleBlock: (id) => `/api/admin/users/${id}/block`,
    orders: "/api/admin/orders",
    order: (id) => `/api/admin/orders/${id}`,
    updateOrderStatus: (id) => `/api/admin/orders/${id}/status`,
    updatePaymentStatus: (id) => `/api/admin/orders/${id}/payment`,
    reviews: "/api/admin/reviews",
    removeReview: (id) => `/api/admin/reviews/${id}`,
    messages: "/api/admin/messages",
    deleteMessage: (id) => `/api/admin/messages/${id}`,
  },
  contact: {
    send: "/api/contact",
  },
  blogs: {
    list: "/api/blogs",
    categories: "/api/blogs/categories",
    detail: (id) => `/api/blogs/${id}`,
    create: "/api/blogs",
    update: (id) => `/api/blogs/${id}`,
    remove: (id) => `/api/blogs/${id}`,
  },
  blogComments: {
    list: (blogId) => `/api/blog-comments/blog/${blogId}`,
    create: (blogId) => `/api/blog-comments/blog/${blogId}`,
    update: (commentId) => `/api/blog-comments/${commentId}`,
    remove: (commentId) => `/api/blog-comments/${commentId}`,
    like: (commentId) => `/api/blog-comments/${commentId}/like`,
    dislike: (commentId) => `/api/blog-comments/${commentId}/dislike`,
    adminList: "/api/blog-comments/admin/all",
    adminRemove: (commentId) => `/api/blog-comments/admin/${commentId}`,
  },
};
