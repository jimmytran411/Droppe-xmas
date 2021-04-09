import { IProduct } from 'api/wishList';
import React from 'react';
import { IProductList, ProductList } from './ProductList';

export interface ICurrentWishList {
  id: number;
  userid: number;
  currentProductList: IProduct[];
}

export const CurrentWishList = ({ currentProductList }: ICurrentWishList) => {
  return (
    <div>
      {currentProductList &&
        currentProductList.map((product: IProduct, index: number) => {
          switch (product.currentState) {
            case 'pending':
              const pendingProduct: IProductList = { productList: [product], productCurrentState: 'pending' };
              return <ProductList key={index} {...pendingProduct} />;
            case 'approved':
              const approvedProduct: IProductList = { productList: [product], productCurrentState: 'approved' };
              return <ProductList key={index} {...approvedProduct} />;
            case 'discarded':
              const discardedProduct: IProductList = { productList: [product], productCurrentState: 'discarded' };
              return <ProductList key={index} {...discardedProduct} />;
            default:
              return 'Product Not Found';
          }
        })}
    </div>
  );
};
