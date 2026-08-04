export type IllustrationKey =
  | "traditional-pot"
  | "mini-pot"
  | "sweet-doi"
  | "sour-doi"
  | "gift-box"
  | "family-pot"
  | "premium-jar"
  | "yogurt-bowl";

export type ProductTag = "popular" | "new" | "bestseller";

export interface Product {
  id: string;
  _id?: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  taglineBn?: string;
  taglineEn?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  weight: number; // grams
  weightLabel?: string;
  price: number; // BDT
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  stock?: number;
  tags?: string[];
  image?: string;
  gallery?: string[];
  ingredientsBn?: string[];
  ingredientsEn?: string[];
  nutrition?: NutritionInfo;
  delivery?: DeliveryInfo;
  active?: boolean;
  createdAt?: string;
}

export interface NutritionInfo {
  serving: string;
  energyKcal: number;
  fat: number;
  protein: number;
  carbs: number;
  sugar: number;
  calciumMg: number;
}

export interface DeliveryInfo {
  insideDhaka: number;
  outsideDhaka: number;
  leadTimeBn: string;
  leadTimeEn: string;
  freeOver: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  weightLabel: string;
  image?: string;
  unitPrice: number;
  quantity: number;
}

export interface ServerCart {
  items: CartItem[];
  appliedCode: string | null;
}

export interface Review {
  id: string;
  nameBn: string;
  nameEn: string;
  rating: number;
  date: string;
  textBn: string;
  textEn?: string;
  verified: boolean;
}

export interface Testimonial {
  id: string;
  nameBn: string;
  nameEn: string;
  role: string;
  rating: number;
  textBn: string;
  location: string;
}

export type PaymentMethod = "cod" | "bkash" | "nagad" | "card";

export type DeliveryMethod = "standard" | "express" | "pickup";

export interface CheckoutCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  deliveryMethod: DeliveryMethod;
}

export interface OrderPayload {
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  coupon?: string;
  note?: string;
  paymentMethod: PaymentMethod;
  idempotencyKey?: string;
}

export interface OrderResult {
  orderId: string;
  tranId?: string;
  GatewayPageURL?: string;
  total: number;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  minAmount?: number;
}

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  image?: string;
  status?: "active" | "blocked" | "suspended";
  isVerified?: boolean;
  provider?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AdminUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  slug?: string;
  nameBn: string;
  nameEn: string;
  taglineBn?: string;
  taglineEn?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  weight: number;
  weightLabel?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  stock?: number;
  tags?: string[];
  image?: string;
  gallery?: string[];
  ingredientsBn?: string[];
  ingredientsEn?: string[];
  nutrition?: Partial<NutritionInfo>;
  delivery?: Partial<DeliveryInfo>;
  active?: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  lowStock: number;
  revenue: number;
}

export interface AdminProduct {
  id?: string;
  _id?: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  taglineBn?: string;
  taglineEn?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  weight: number;
  weightLabel?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviewsCount?: number;
  stock: number;
  tags?: string[];
  image?: string;
  gallery?: string[];
  ingredientsBn?: string[];
  ingredientsEn?: string[];
  nutrition?: NutritionInfo;
  delivery?: DeliveryInfo;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  weightLabel: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id?: string;
  _id?: string;
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    district: string;
    deliveryMethod: DeliveryMethod;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  coupon: string;
  note: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  tranId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface StoryVideo {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
