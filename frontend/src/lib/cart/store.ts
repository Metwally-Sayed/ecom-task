export const CART_STORAGE_KEY = "mini-shop-cart";

export type CartItem = {
  productId: string;
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
};

export type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: CartItem }
  | { type: "remove"; productId: string }
  | { type: "setQuantity"; productId: string; quantity: number }
  | { type: "clear" };

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existingItem = state.find(
        (item) => item.productId === action.item.productId,
      );

      if (!existingItem) {
        return [...state, action.item];
      }

      return state.map((item) =>
        item.productId === action.item.productId
          ? { ...item, quantity: item.quantity + action.item.quantity }
          : item,
      );
    }
    case "remove":
      return state.filter((item) => item.productId !== action.productId);
    case "setQuantity":
      return state
        .map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: Math.max(1, action.quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as CartItem[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}
