import React, { useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { backend_url } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {

  const [image1,setImage1] = useState(false);
  const [image2,setImage2] = useState(false);
  const [image3,setImage3] = useState(false);
  const [image4,setImage4] = useState(false);

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [price,setPrice] = useState("");
  const [category,setCategory] = useState("Men");
  const [subCategory,setSubCategory] = useState("Topwear");
  const [sizes,setSizes] = useState([]);
  const [bestseller,setBestseller] = useState(false);

  const toggleSize = (size)=>{
    setSizes(prev =>
      prev.includes(size)
        ? prev.filter(item => item !== size)
        : [...prev,size]
    )
  }

  const onSubmitHandler = async (e)=>{
    e.preventDefault();

    try{

      const formData = new FormData();

      formData.append("name",name);
      formData.append("description",description);
      formData.append("price",price);
      formData.append("category",category);
      formData.append("subCategory",subCategory);
      formData.append("bestseller",bestseller);

      // FIXED
      formData.append("sizes",JSON.stringify(sizes));

      if(image1) formData.append("image1",image1);
      if(image2) formData.append("image2",image2);
      if(image3) formData.append("image3",image3);
      if(image4) formData.append("image4",image4);

      const response = await axios.post(
        backend_url + "/api/product/add",
        formData,
        {
          headers:{
            token
          }
        }
      );

      if(response.data.success){

        toast.success("Product Added Successfully");

        setName("");
        setDescription("");
        setPrice("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setSizes([]);
        setBestseller(false);

      }else{
        toast.error(response.data.message);
      }

    }catch(error){
      console.log(error);
      toast.error("Error adding product");
    }
  }

  return(

    <form onSubmit={onSubmitHandler}
    className="flex flex-col w-full items-start gap-5 p-6 bg-white text-gray-800 rounded-lg shadow-sm border border-gray-300">

      {/* Upload Images */}

      <div>
        <p className="text-lg font-medium mb-2">Upload Images</p>

        <div className="flex gap-3">

          {[image1,image2,image3,image4].map((img,index)=>(

            <label key={index} htmlFor={`image${index+1}`}>

              <img
                className="w-24 cursor-pointer"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />

              <input
                hidden
                type="file"
                id={`image${index+1}`}
                onChange={(e)=>{

                  const file = e.target.files[0];

                  if(index===0) setImage1(file);
                  if(index===1) setImage2(file);
                  if(index===2) setImage3(file);
                  if(index===3) setImage4(file);

                }}
              />

            </label>

          ))}

        </div>
      </div>

      {/* Product Name */}

      <div className="w-full">
        <p className="form-label">Product Name</p>

        <input
        className="form-input bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 w-full max-w-125 px-3 py-2"
        type="text"
        placeholder="Type here"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        required
        />
      </div>

      {/* Description */}

      <div className="w-full">
        <p className="form-label">Description</p>

        <textarea
        className="form-input bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 w-full max-w-125 px-3 py-2"
        rows={4}
        placeholder="Write content here"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        />
      </div>

      {/* Category / Subcategory / Price */}

      <div className="flex gap-4">

        <div>
          <p className="form-label">Category</p>

          <select
          className="form-input bg-gray-50 border-gray-300 text-gray-800 px-3 py-2"
          onChange={(e)=>setCategory(e.target.value)}>

            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>

          </select>
        </div>

        <div>
          <p className="form-label mb-2">Sub Category</p>

          <select
          className="form-input bg-gray-50 border-gray-700 text-gray-800 px-3 py-2"
          onChange={(e)=>setSubCategory(e.target.value)}>

            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>

          </select>
        </div>

        <div>
          <p className="form-label mb-2">Product Price</p>

          <input
          className="form-input bg-gray-50 border-gray-300 text-gray-800 w-full sm:w-30 px-3 py-2"
          type="number"
          placeholder="25"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          />
        </div>

      </div>

      {/* Sizes */}

      <div>

        <p className="form-label">Sizes</p>

        <div className="flex gap-3">

          {["S","M","L","XL","XXL"].map((size)=>(

            <button
            type="button"
            key={size}
            onClick={()=>toggleSize(size)}
            className={`size-btn ${sizes.includes(size) ? "size-active" : ""}`}
            >

              {size}

            </button>

          ))}

        </div>

      </div>

      {/* Bestseller */}

      <div className="flex gap-2 mt-2">

        <input
        type="checkbox"
        id="bestseller"
        checked={bestseller}
        onChange={()=>setBestseller(prev=>!prev)}
        />

        <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>

      </div>

      <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white mt-4 px-8 py-3 rounded-md shadow-sm">
        ADD PRODUCT
      </button>

    </form>

  )

}

export default Add;