import { render, screen } from "@testing-library/react";

import { ProductCard } from "@/components/products/product-card";

describe("ProductCard", () => {
  it("renders product name and formatted price", () => {
    render(
      <ProductCard
        product={{
          id: "00000000-0000-0000-0000-000000000001",
          name: "Test Product",
          description: "Description",
          price: 25,
          imageUrl: null,
          isActive: true,
          category: { id: "cat", name: "Shoes", slug: "shoes" },
          createdAt: "2026-06-05T00:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });
});
