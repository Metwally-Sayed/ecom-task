import { cartReducer } from "@/lib/cart/store";

describe("cartReducer", () => {
  it("increments quantity when adding the same product", () => {
    const state = cartReducer([], {
      type: "add",
      item: {
        productId: "p1",
        name: "Product",
        imageUrl: null,
        unitPrice: 10,
        quantity: 1,
      },
    });

    const next = cartReducer(state, {
      type: "add",
      item: {
        productId: "p1",
        name: "Product",
        imageUrl: null,
        unitPrice: 10,
        quantity: 2,
      },
    });

    expect(next).toEqual([
      {
        productId: "p1",
        name: "Product",
        imageUrl: null,
        unitPrice: 10,
        quantity: 3,
      },
    ]);
  });
});
