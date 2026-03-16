import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { Link } from 'react-router-dom';

const RelatedProduct = ({ category, subCategory }) => {

  const { products, currency } = useContext(ShopContext);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory
      );

      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className='my-24'>

      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>

        {relatedProducts.length > 0 ? (
          relatedProducts.map((item) => (
            <Link
              to={`/product/${item._id}`}
              key={item._id}
              className='flex flex-col gap-3 cursor-pointer group'
            >
              <div className='overflow-hidden rounded'>
                <img
                  src={item?.image?.[0]}
                  alt={item.name}
                  className='w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105'
                />
              </div>

              <p className='text-sm font-medium'>
                {item.name}
              </p>

              <p className='text-sm text-gray-500'>
                {currency}{item.price}
              </p>
            </Link>
          ))
        ) : (
          <p className='text-gray-500 col-span-full text-center'>
            No related products found.
          </p>
        )}

      </div>
    </div>
  )
}

export default RelatedProduct;