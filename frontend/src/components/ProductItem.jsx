import React,{useContext} from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id,image,name,price}) => {

    const{currency}=useContext(ShopContext);

  return (
    <Link className='text-gray-600 hover:text-gray-800 cursor-pointer' to={`/product/${id}`}>
    <div className='flex flex-col items-center justify-center overflow-hidden'>
        <img src={image[0]} alt={name} className='hover:scale-110 transition ease-in-out duration-300'/>
        
    </div>
    <p className='pt-3 pb-1 text-sm'>{name}</p>
    <p className='text-sm font-medium text-gray-600'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem