export type UserRole = "customer" | "admin";
export type UserStatus = "active" | "deactivated" | "blocked";

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export type AuthPayload = {
  user: Profile;
  accessToken: string;
  refreshToken: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  category: Category | null;
  createdAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Cancelled";

export type OrderItem = {
  id: string;
  productId: string | null;
  productName: string | null;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
};

export type ListResponse<T> = {
  data: T[];
  meta: PaginationMeta | Record<string, never>;
};

export type SingleResponse<T> = {
  data: T;
};

export type MessageResponse = {
  message: string;
};

export type BackendErrorResponse = {
  statusCode: number;
  error: string;
  message: string;
};
