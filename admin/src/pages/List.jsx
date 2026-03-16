import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {

  const [list,setList] = useState([])

  const fetchList = async () => {

    try {

      const response = await axios.get(backend_url + "/api/product/list")

      if(response.data.success){
        setList(response.data.products)
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Error fetching products")
    }

  }

  const removeProduct = async (id) => {

    try {

      const response = await axios.post(
        backend_url + "/api/product/remove",
        { id },
        { headers:{ token } }
      )

      if(response.data.success){
        toast.success("Product Removed")
        fetchList()
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("Error removing product")
    }

  }

  useEffect(()=>{
    fetchList()
  },[])

  return (

    <div className="flex flex-col gap-2 p-4">

      <p className="text-lg font-semibold mb-2 text-gray-800">All Products</p>

      {/* Table Header */}

      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border border-gray-300 bg-gray-100 text-sm font-medium text-gray-700 rounded-t-lg">

        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b className="text-center">Action</b>

      </div>

      {/* Product List */}

      {list.map((item,index)=>(

        <div
        key={index}
        className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 py-3 px-4 border border-gray-300 border-t-0 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors last:rounded-b-lg"
        >

          <img
          className="w-12 h-12 object-cover rounded border border-gray-300"
          src={item.image[0]}
          alt=""
          />

          <p className="font-medium text-gray-800">{item.name}</p>

          <p className="text-gray-600">{item.category}</p>

          <p className="text-blue-600 font-semibold">₹{item.price}</p>

          <button
          onClick={()=>removeProduct(item._id)}
          className="text-red-600 hover:text-red-700 cursor-pointer text-center font-medium md:text-right px-2 py-1 rounded bg-red-50 hover:bg-red-100 border border-red-200 transition-colors w-full md:w-auto ml-auto"
          >
            Remove
          </button>

        </div>

      ))}

    </div>

  )

}

export default List