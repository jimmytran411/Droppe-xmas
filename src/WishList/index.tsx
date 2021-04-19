import React, { useEffect, useState } from 'react';

import { Product } from 'api/wishList';
import { useCart } from 'context/CartContext';
import { ProductList } from './ProductList';
import { productListEmptyCheck } from 'utils/wishlistAndProduct';
import { calculateWishlistPrice } from 'utils/priceCalculation';
import { Navbar } from 'WishList/Navbar';
import { Loading } from 'common/commonType';
import './Product.css';

export interface WishlistWithProductDetail {
  id: number;
  userid: number;
  products: (Product | Loading)[];
}

export const WishList = (wishlist: WishlistWithProductDetail) => {
  const { wishlists } = useCart();
  const [currentWishlistPrice, setCurrentWishlistPrice] = useState<number>(0);
  const [currentDiscount, setCurrentDiscount] = useState<number>(0);

  useEffect(() => {
    const { totalDiscount, priceAfterDiscount } = calculateWishlistPrice(wishlist, wishlists);
    setCurrentWishlistPrice(priceAfterDiscount);
    setCurrentDiscount(totalDiscount);
  }, [wishlist]);
  return (
    <div className="wishlist-container">
      <div className="side">
        <Navbar />
      </div>
      <div className="main">
        <span className="current-price">
          <p>
            {currentWishlistPrice >= 0 && `Current Cart: €${currentWishlistPrice.toFixed(2)}`}{' '}
            {currentDiscount > 0 && `You save: €${currentDiscount.toFixed(2)}`}
          </p>
        </span>
        <div className="pending-list">
          <span className="section-title">Wishlist</span>
          {!productListEmptyCheck(wishlist.products, 'pending') ? (
            <ProductList wishlist={wishlist} givenStatus="pending" />
          ) : (
            'No more gift to show'
          )}
        </div>
        <div className="approved-list">
          <span className="section-title">Approve List</span>
          {!productListEmptyCheck(wishlist.products, 'approved') ? (
            <ProductList wishlist={wishlist} givenStatus="approved" />
          ) : (
            `You haven't approved anything yet`
          )}
        </div>
        <div className="discarded-list">
          <span className="section-title">Discarded List</span>
          {!productListEmptyCheck(wishlist.products, 'discarded') ? (
            <ProductList wishlist={wishlist} givenStatus="discarded" />
          ) : (
            `You haven't discarded anything yet`
          )}
        </div>
      </div>
    </div>
  );
};
