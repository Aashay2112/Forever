import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = () => {

    const product = products.find(item => item._id === productId);

    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId, products]);

  if (!productData) return <div>Loading...</div>;

  return (
    <div className='border-t-2 pt-10'>

      <div className='flex gap-12 flex-col sm:flex-row'>

        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>

          <div className='flex sm:flex-col gap-3 sm:w-[18%]'>

            {productData.image.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                src={item}
                className='cursor-pointer'
              />
            ))}

          </div>

          <div className='w-full sm:w-[82%]'>
            <img src={image} className='w-full' />
          </div>

        </div>

        <div className='flex-1'>

          <h1 className='text-2xl'>{productData.name}</h1>

          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} className='w-3' />
            <img src={assets.star_icon} className='w-3' />
            <img src={assets.star_icon} className='w-3' />
            <img src={assets.star_icon} className='w-3' />
            <img src={assets.star_dull_icon} className='w-3' />
            <p>(122)</p>
          </div>

          <p className='mt-5 text-3xl'>
            {currency}{productData.price}
          </p>

          <p className='mt-5 text-gray-500'>
            {productData.description}
          </p>

          <div className='flex flex-col gap-2 my-8'>

            <p>Select Size</p>

            <div className='flex gap-2'>

              {productData?.sizes?.map((item, index) => (

                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border px-4 py-2 ${
                    size === item ? "border-black" : "border-gray-300"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className='bg-black text-white px-8 py-3'
          >
            ADD TO CART
          </button>

        </div>

      </div>

      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />

    </div>
  )
}

export default Product