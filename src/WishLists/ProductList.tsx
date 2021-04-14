import { IProduct } from 'api/wishList';
import { useCart } from 'context/CartContext';
import React from 'react';
import { Product } from './Product';

export interface IProductList {
  productList: IProduct[];
  givenState: 'pending' | 'approved' | 'discarded';
}

export const ProductList = ({ productList, givenState }: IProductList) => {
  const { handleProduct, totalQuantity } = useCart();
  return (
    <div className="product-list">
      {productList &&
        productList.map((product: IProduct, index: number) => {
          const quantity = totalQuantity(product) - 1;
          const discountPercent = quantity > 1 && quantity * 10;
          return (
            <div key={index} className="product-card">
              {product.currentState === givenState && (
                <div>
                  <Product {...product} />
                  <p className="discount-message">
                    <b>
                      {quantity > 1 &&
                        `Other children want this too. Save up to ${discountPercent}% by choosing this product`}
                    </b>
                  </p>
                  <button
                    aria-label={
                      product.currentState === 'pending' ? `approve-btn-${product.id}` : `return-btn-${product.id}`
                    }
                    onClick={() => {
                      product.currentState === 'pending'
                        ? handleProduct(product, 'approved')
                        : handleProduct(product, 'pending');
                    }}
                  >
                    {product.currentState === 'pending' ? 'Approve' : 'Return to Wishlist'}
                  </button>
                  <button
                    aria-label={
                      product.currentState === 'discarded' ? `approve-btn-${product.id}` : `discard-btn-${product.id}`
                    }
                    onClick={() => {
                      product.currentState === 'discarded'
                        ? handleProduct(product, 'approved')
                        : handleProduct(product, 'discarded');
                    }}
                  >
                    {product.currentState === 'discarded' ? 'Approve' : 'Discard'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
