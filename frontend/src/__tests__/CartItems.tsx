import React from 'react';
import _ from 'lodash';
import { render, screen } from '@testing-library/react';

import { CartItems } from 'Views/Overview/CartItems';
import { CartContext } from 'context/CartContext';
import { PriceContext } from 'context/PriceContext';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { ProductDetail } from 'api/wishList';
import { ProductContext } from 'context/ProductContext';

test('It should render CartItem with approved product', () => {
  const testApproveList: ProductWithStatus[] = [
    {
      productId: 1,
      approvalStatus: 'approved',
    },
    {
      productId: 2,
      approvalStatus: 'approved',
    },
  ];

  const testDetail1: ProductDetail = {
    id: 1,
    title: 'test title 1',
    price: 111,
    description: 'test description 1',
    image: 'test img link 1',
    category: 'test category 1',
  };
  const testDetail2: ProductDetail = {
    id: 2,
    title: 'test title 2',
    price: 222,
    description: 'test description 2',
    image: 'test img link 2',
    category: 'test category 2',
  };

  const mockGetProductFromContext = (id: number) => {
    return _.find(mockProductValue.productDetailList, (product) => product.id === id);
  };

  const testWishlistProp: WishlistWithProductStatus = { wishlistId: 1, productList: testApproveList };

  const mockCartValue = {
    wishlists: [{ ...testWishlistProp }],
    handleProduct: jest.fn(),
    handlePayment: jest.fn(),
    handleSorting: jest.fn(),
  };
  const mockPriceValue = {
    totalPrice: 420,
    totalDiscount: 240,
    getProductPrice: jest.fn(),
  };
  const mockProductValue = {
    productDetailList: [testDetail1, testDetail2],
    updateProductDetailList: jest.fn(),
    getProductFromContext: mockGetProductFromContext,
  };

  const wrapper = ({ children }: any) => (
    <CartContext.Provider value={mockCartValue}>
      <ProductContext.Provider value={mockProductValue}>
        <PriceContext.Provider value={mockPriceValue}>{children}</PriceContext.Provider>
      </ProductContext.Provider>
    </CartContext.Provider>
  );
  render(<CartItems givenStatus="approved" />, { wrapper });

  expect(screen.getByText(/Your cart/i)).toHaveTextContent(`Your cart's items:`);
  expect(screen.getByText(/child 1/i)).toBeInTheDocument();

  expect(screen.getByText(/test title 1/i)).toBeInTheDocument();
  expect(screen.getByText(/€111/i)).toBeInTheDocument();

  expect(screen.getByText(/test title 2/i)).toBeInTheDocument();
  expect(screen.getByText(/€222/i)).toBeInTheDocument();
});
