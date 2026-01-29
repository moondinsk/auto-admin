// 실제 URL (navigate, link, redirect용)
export const PATH = {
  HOME: "/",
  PRODUCT: "/product",
  PRODUCT_DETAIL: "/product/:id",
  LOGIN: "/login",
  FORBIDDEN: "/403",
  USERS: "/users",
};

// router children에서 쓰는 상대경로
export const SEGMENT = {
  PRODUCT: "product",
  PRODUCT_DETAIL: "product/:id",
  LOGIN: "login",
  FORBIDDEN: "403",
  USERS: "users",
};
