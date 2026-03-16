import React, { useContext, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext)

  const [showFilter,setShowFilter] = useState(false)

  const [selectedCategories,setSelectedCategories] = useState([])
  const [selectedTypes,setSelectedTypes] = useState([])
  const [sortBy,setSortBy] = useState("")

  const normalize = (val)=> val?.toString().trim().toUpperCase()


  // CATEGORY FILTER
  const handleCategoryChange = (e)=>{

    const value = e.target.value

    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev,value]
    )

  }


  // TYPE FILTER
  const handleTypeChange = (e)=>{

    const value = e.target.value

    setSelectedTypes(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev,value]
    )

  }


  // FILTER + SEARCH + SORT

  const filteredProducts = useMemo(()=>{

    return products

      .filter((item)=>{

        let searchMatch = true
        
        if (showSearch && search) {
          const searchText = search.toLowerCase().trim()
          
          if (searchText !== "") {
            const name = item.name.toLowerCase()
            const category = item.category.toLowerCase()
            const subCategory = item.subCategory.toLowerCase()

            const words = searchText.split(" ")

            searchMatch = words.every(word =>
              name.includes(word) ||
              category === word ||
              subCategory.includes(word)
            )
          }
        }

        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(item.category)

        const typeMatch =
          selectedTypes.length === 0 ||
          selectedTypes.includes(item.subCategory)

        return searchMatch && categoryMatch && typeMatch

      })

      .sort((a,b)=>{

        if(sortBy === "price-asc") return a.price - b.price
        if(sortBy === "price-desc") return b.price - a.price

        return 0

      })

  },[products,search,showSearch,selectedCategories,selectedTypes,sortBy])


  return (

    <div className='flex flex-col sm:flex-row sm:gap-10 pt-10 border-t'>

      {/* FILTER SECTION */}

      <div className='min-w-60'>

        <div
          className='my-2 text-xl flex items-center justify-between cursor-pointer'
          onClick={()=>setShowFilter(!showFilter)}
        >

          <span>FILTERS</span>

          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />

        </div>


        <div className={`${showFilter ? "block" : "hidden"} sm:block`}>

          {/* CATEGORY */}

          <div className='border border-gray-300 my-3 p-3 rounded'>

            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>

            <div className='flex flex-col gap-2 text-sm text-gray-700'>

              {["Men","Women","Kids"].map(cat =>(

                <label key={cat} className='flex gap-2'>

                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={handleCategoryChange}
                  />

                  {cat.toUpperCase()}

                </label>

              ))}

            </div>

          </div>


          {/* TYPE */}

          <div className='border border-gray-300 my-3 p-3 rounded'>

            <p className='mb-3 text-sm font-medium'>TYPE</p>

            <div className='flex flex-col gap-2 text-sm text-gray-700'>

              {["Topwear","Bottomwear","Winterwear"].map(type =>(

                <label key={type} className='flex gap-2'>

                  <input
                    type="checkbox"
                    value={type}
                    checked={selectedTypes.includes(type)}
                    onChange={handleTypeChange}
                  />

                  {type.toUpperCase()}

                </label>

              ))}

            </div>

          </div>

        </div>

      </div>



      {/* PRODUCTS SECTION */}

      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>

          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          <select
            className='border border-gray-300 text-sm px-2 rounded'
            value={sortBy}
            onChange={(e)=>setSortBy(e.target.value)}
          >

            <option value="">Sort By</option>
            <option value="price-desc">High → Low</option>
            <option value="price-asc">Low → High</option>

          </select>

        </div>


        {/* PRODUCT GRID */}

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>

          {filteredProducts.length > 0 ? (

            filteredProducts.map(item =>(

              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />

            ))

          ) : (

            <p className='col-span-full text-center text-gray-500'>
              No products found
            </p>

          )}

        </div>

      </div>

    </div>

  )

}

export default Collection