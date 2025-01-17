import React, { useEffect, useState } from 'react';

import './ProductCard.css';
import { ProductDetail } from 'api/wishList';
import { useCart } from 'context/CartContext';
import { Loader } from 'utils/Loader';
import { Loading } from 'common/commonType';
import { ProductWithStatus, WishlistWithProductStatus } from 'common/commonInterface';
import { useProduct } from 'context/ProductContext';

export interface ProductCardProps {
  product: ProductWithStatus;
  wishlist: WishlistWithProductStatus;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, wishlist }: ProductCardProps) => {
  const [discount, setDiscount] = useState(0);
  const [productDetail, setProductDetail] = useState<ProductDetail | Loading>('loading');

  const { handleProduct, wishlists } = useCart();
  const { getProductFromContext, productDetailList } = useProduct();

  useEffect(() => {
    const fetchProductAndCalculateDiscount = async () => {
      const productFromStore = getProductFromContext(product.productId);
      setProductDetail(productFromStore ? productFromStore : 'loading');

      // Calculate Possible discount
      let count = 0;
      wishlists &&
        wishlists.forEach((wishlist) => {
          wishlist.productList.forEach(
            ({ productId, approvalStatus }) =>
              productId === product.productId && approvalStatus === 'approved' && count++
          );
        });
      setDiscount(count > 1 ? count * 10 : 0);
    };
    fetchProductAndCalculateDiscount();
  }, [wishlists, productDetailList, getProductFromContext, product]);

  return (
    <>
      {productDetail === 'loading' && <Loader />}
      {productDetail !== 'loading' && (
        <div className="product-card">
          {discount > 0 && <div className={`discount-label discount--${discount}`}></div>}
          <div className="product-card-img">
            <div style={{ backgroundImage: `url(${productDetail.image})` }}></div>
          </div>

          <div className="product-card-content">
            <span className="product-card-title">{productDetail.title}</span>
            <span className="product-card-price" style={discount > 0 ? { textDecoration: 'line-through' } : undefined}>
              €{productDetail.price}
            </span>
            {discount > 0 && (
              <span className="product-cart-price">€{((productDetail.price * (100 - discount)) / 100).toFixed(2)}</span>
            )}
            <div className="product-card-btn">
              <a
                className={product.approvalStatus === 'pending' ? 'primary' : 'secondary'}
                aria-label={
                  product.approvalStatus === 'pending'
                    ? `approve-btn-${product.productId}`
                    : `return-btn-${product.productId}`
                }
                onClick={() => {
                  product.approvalStatus === 'pending'
                    ? handleProduct(product, 'approved', wishlist)
                    : handleProduct(product, 'pending', wishlist);
                }}
              >
                {product.approvalStatus === 'pending' ? 'Add to cart' : 'Save to wishlist'}
              </a>
              <a
                className={product.approvalStatus === 'discarded' ? 'primary' : 'secondary'}
                aria-label={
                  product.approvalStatus === 'discarded'
                    ? `approve-btn-${product.productId}`
                    : `discard-btn-${product.productId}`
                }
                onClick={() => {
                  product.approvalStatus === 'discarded'
                    ? handleProduct(product, 'approved', wishlist)
                    : handleProduct(product, 'discarded', wishlist);
                }}
              >
                {product.approvalStatus === 'discarded' ? 'Add to cart' : 'Remove'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
