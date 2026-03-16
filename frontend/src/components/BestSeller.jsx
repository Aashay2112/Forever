import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";

const BestSeller = () => {

  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {

    if(products && products.length > 0){

      const bestProducts = products.filter(
        (item) => item.bestseller === true || item.bestseller === "true"
      );

      setBestSeller(bestProducts.slice(0,5));

    }

  }, [products]);


  return (

    <div className="my-12 px-4">

      {/* Heading */}

      <div className="text-center py-8">

        <h2 className="text-3xl font-bold">
          <span className="text-gray-400">BEST </span>
          <span className="text-gray-700">SELLER</span>
        </h2>

        <p className="w-3/4 mx-auto mt-3 text-sm md:text-base text-gray-600">
          Discover our most loved products chosen by customers just like you.
        </p>

      </div>


      {/* Products */}

      {bestSeller.length > 0 ? (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">

          {bestSeller.map((item) => (

            <div
              key={item._id}
              className="transform hover:scale-105 transition-all duration-300 rounded-lg shadow-lg overflow-hidden bg-white"
            >

              {/* Image */}

              <img
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
                className="w-full h-50 object-cover"
              />

              {/* Info */}

              <div className="p-3 text-center">

                <h3 className="text-sm font-medium truncate">
                  {item.name}
                </h3>

                <p className="text-gray-700 font-semibold mt-1">
                  ₹{item.price}
                </p>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <p className="text-center text-gray-500 mt-10">
          No bestseller products available
        </p>

      )}

    </div>

  );

};

export default BestSeller;