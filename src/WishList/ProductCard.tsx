import { Product } from 'api/wishList';
import Modal from 'Modal';
import React, { useState } from 'react';
import { WishlistWithProductDetail } from 'WishList';
import { Loading, useCart } from 'context/CartContext';
import { Loader } from 'utils/Loader';

export interface ProductCardProps {
  product: Product | Loading;
  wishlist: WishlistWithProductDetail;
}

export const ProductCard = ({ product, wishlist }: ProductCardProps) => {
  const [isModal, setIsModal] = useState(false);
  const { handleProduct } = useCart();
  const toggleModal = () => setIsModal(!isModal);
  return (
    <>
      {!isModal && (
        <>
          {product === 'loading' && <Loader />}
          {product !== 'loading' && (
            <div className="product-card">
              <div className="product-card-img">
                <div style={{ backgroundImage: `url(${product.image})` }} onClick={toggleModal}></div>
              </div>

              <div className="product-card-content">
                <span>{product.title}</span>
                <p className="price">€{product.price}</p>
                <div className="product-card-btn">
                  <span
                    aria-label={
                      product.approvalStatus === 'pending' ? `approve-btn-${product.id}` : `return-btn-${product.id}`
                    }
                    onClick={() => {
                      product.approvalStatus === 'pending'
                        ? handleProduct(product, 'approved', wishlist)
                        : handleProduct(product, 'pending', wishlist);
                    }}
                  >
                    {product.approvalStatus === 'pending' ? '✅' : '⏎'}
                  </span>
                  <span
                    aria-label={
                      product.approvalStatus === 'discarded' ? `approve-btn-${product.id}` : `discard-btn-${product.id}`
                    }
                    onClick={() => {
                      product.approvalStatus === 'discarded'
                        ? handleProduct(product, 'approved', wishlist)
                        : handleProduct(product, 'discarded', wishlist);
                    }}
                  >
                    {product.approvalStatus === 'discarded' ? '✅' : '❌'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {isModal && (
        <Modal>
          {product !== 'loading' && (
            <div className="product-detail-modal">
              <img src={product.image} alt={product.title} />
              <h5>{product.title}</h5>
              <p className="price">€{product.price}</p>
              <p>{product.description}</p>
              <button onClick={toggleModal}>Back to Wishlist</button>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};