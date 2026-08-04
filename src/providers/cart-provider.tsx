"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartItem, Coupon, Product, ServerCart } from "@/lib/types";
import { coupons } from "@/lib/site";
import { delivery } from "@/lib/site";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  coupon: Coupon | null;
  appliedCode: string | null;
  cartOpen: boolean;
  wishlist: string[];
  recentlyViewed: string[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  setCartOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = "hs-cart";
const WISHLIST_KEY = "hs-wishlist";
const RECENT_KEY = "hs-recent";

interface CartStore {
  items: CartItem[];
  appliedCode: string | null;
  wishlist: string[];
  recentlyViewed: string[];
}

const EMPTY_STORE: CartStore = {
  items: [],
  appliedCode: null,
  wishlist: [],
  recentlyViewed: [],
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function loadStore(): CartStore {
  if (typeof window === "undefined") return EMPTY_STORE;
  return {
    items: loadFromStorage<CartItem[]>(CART_KEY, []),
    appliedCode: loadFromStorage<string | null>(`${CART_KEY}-coupon`, null),
    wishlist: loadFromStorage<string[]>(WISHLIST_KEY, []),
    recentlyViewed: loadFromStorage<string[]>(RECENT_KEY, []),
  };
}

let store: CartStore = loadStore();
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function persist() {
  window.localStorage.setItem(CART_KEY, JSON.stringify(store.items));
  window.localStorage.setItem(
    `${CART_KEY}-coupon`,
    JSON.stringify(store.appliedCode),
  );
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(store.wishlist));
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(store.recentlyViewed));
}

function mutate(updater: (prev: CartStore) => CartStore) {
  store = updater(store);
  if (typeof window !== "undefined") persist();
  notify();
}

function getSnapshot(): CartStore {
  return store;
}

function getServerSnapshot(): CartStore {
  return EMPTY_STORE;
}

function mergeCarts(server: CartItem[], local: CartItem[]): CartItem[] {
  const byId = new Map<string, CartItem>();
  for (const item of server) {
    byId.set(item.productId, { ...item });
  }
  for (const item of local) {
    // The server is authoritative; only fold in guest line items that are
    // not already saved on the server. This keeps the merge idempotent so
    // a page reload never sums quantities on top of themselves.
    if (!byId.has(item.productId)) {
      byId.set(item.productId, { ...item });
    }
  }
  return Array.from(byId.values());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [cartOpen, setCartOpen] = useState(false);
  const serverReadyRef = useRef(false);

  const { items, appliedCode, wishlist, recentlyViewed } = state;

  // Load the user's saved cart from the server whenever auth state changes.
  // The guest localStorage cart is merged into the server cart (no duplicates).
  useEffect(() => {
    if (!user) {
      serverReadyRef.current = true;
      return;
    }

    let cancelled = false;
    serverReadyRef.current = false;

    (async () => {
      try {
        const res = await api.getAuth<ServerCart>("/api/cart", token);
        if (cancelled) return;
        const serverItems = res.items ?? [];
        const serverCode = res.appliedCode ?? null;
        const localItems = loadFromStorage<CartItem[]>(CART_KEY, []);
        const localCode = loadFromStorage<string | null>(
          `${CART_KEY}-coupon`,
          null,
        );

        const mergedItems = mergeCarts(serverItems, localItems);
        const mergedCode = serverCode ?? localCode;
        const hasLocal = localItems.length > 0 || localCode;

        if (serverItems.length === 0 && !hasLocal) {
          // Nothing anywhere — leave the cart empty.
        } else {
          const saved = await api
            .putAuth<ServerCart>(
              "/api/cart",
              { items: mergedItems, appliedCode: mergedCode },
              token,
            )
            .then(() => true)
            .catch(() => false);
          mutate((prev) => ({
            ...prev,
            items: mergedItems,
            appliedCode: mergedCode,
          }));
          if (saved) {
            // Once the guest cart has been merged onto the server, drop the
            // localStorage copy so future loads are server-authoritative and
            // quantities never accumulate on top of themselves.
            localStorage.removeItem(CART_KEY);
            localStorage.removeItem(`${CART_KEY}-coupon`);
          }
        }
      } catch {
        // Server unreachable — keep the local cart.
      } finally {
        if (!cancelled) serverReadyRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, token]);

  // Debounced sync of cart changes back to the server for logged-in users.
  // Skipped until the initial server cart has been loaded so we never
  // clobber a saved cart with a stale local one.
  useEffect(() => {
    if (!user || !serverReadyRef.current) return;
    const timer = setTimeout(() => {
      api
        .putAuth<ServerCart>(
          "/api/cart",
          { items, appliedCode },
          token,
        )
        .catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [user, token, items, appliedCode]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    mutate((prev) => {
      const existing = prev.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            productId: product.id,
            slug: product.slug,
            nameBn: product.nameBn,
            nameEn: product.nameEn,
            weightLabel: product.weightLabel ?? "",
            image: product.image ?? "",
            unitPrice: product.price,
            quantity,
          },
        ],
      };
    });
    toast.success(`${product.nameBn} কার্টে যোগ হয়েছে।`);
  }, []);

  const removeItem = useCallback((productId: string) => {
    mutate((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));
    toast.info("পণ্যটি কার্ট থেকে সরানো হয়েছে।");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    mutate((prev) => ({
      ...prev,
      items:
        quantity <= 0
          ? prev.items.filter((i) => i.productId !== productId)
          : prev.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
    }));
    if (quantity <= 0) {
      toast.info("পণ্যটি কার্ট থেকে সরানো হয়েছে।");
    }
  }, []);

  const clearCart = useCallback(() => {
    mutate((prev) => ({ ...prev, items: [], appliedCode: null }));
  }, []);

  const coupon = useMemo(
    () => coupons.find((c) => c.code === appliedCode) ?? null,
    [appliedCode],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.minAmount && subtotal < coupon.minAmount) return 0;
    return coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);
  }, [coupon, subtotal]);

  const deliveryCharge = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal - discount >= delivery.freeOver) return 0;
    return delivery.insideDhaka;
  }, [subtotal, discount]);

  const total = useMemo(
    () => Math.max(0, subtotal - discount + deliveryCharge),
    [subtotal, discount, deliveryCharge],
  );

  const applyCoupon = useCallback(
    (code: string): { ok: boolean; message: string } => {
      const c = coupons.find(
        (candidate) => candidate.code.toLowerCase() === code.trim().toLowerCase(),
      );
      if (!c) return { ok: false, message: "কুপন কোডটি সঠিক নয়।" };
      if (c.minAmount && subtotal < c.minAmount) {
        return {
          ok: false,
          message: `কুপনটি প্রযোজ্য হবে ${c.minAmount}৳+ অর্ডারে।`,
        };
      }
      mutate((prev) => ({ ...prev, appliedCode: c.code }));
      toast.success("কুপন প্রয়োগ হয়েছে!");
      return { ok: true, message: "কুপন প্রয়োগ হয়েছে! 🎉" };
    },
    [subtotal],
  );

  const removeCoupon = useCallback(() => {
    mutate((prev) => ({ ...prev, appliedCode: null }));
    toast.info("কুপন বাতিল করা হয়েছে।");
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    const isAdded = !store.wishlist.includes(productId);
    mutate((prev) => ({
      ...prev,
      wishlist: prev.wishlist.includes(productId)
        ? prev.wishlist.filter((id) => id !== productId)
        : [...prev.wishlist, productId],
    }));
    if (isAdded) {
      toast.success("উইশলিস্টে যোগ করা হয়েছে।");
    } else {
      toast.info("উইশলিস্ট থেকে সরানো হয়েছে।");
    }
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const addRecentlyViewed = useCallback((productId: string) => {
    mutate((prev) => ({
      ...prev,
      recentlyViewed: [
        productId,
        ...prev.recentlyViewed.filter((id) => id !== productId),
      ].slice(0, 8),
    }));
  }, []);

  const setCartOpenCb = useCallback((open: boolean) => setCartOpen(open), []);

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    discount,
    deliveryCharge,
    total,
    coupon,
    appliedCode,
    cartOpen,
    wishlist,
    recentlyViewed,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setCartOpen: setCartOpenCb,
    toggleWishlist,
    isWishlisted,
    addRecentlyViewed,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
