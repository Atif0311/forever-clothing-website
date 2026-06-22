import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

const Collection = () => {

  const { products, search, showSearch } = useContext(ShopContext);

  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortType, setSortType] = useState('relevant')
  const [sizes, setSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [bestsellerOnly, setBestsellerOnly] = useState(false);

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(a => a !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(a => a !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }

  }

  const toggleSize = (e) => {

    if (sizes.includes(e.target.value)) {
      setSizes(prev => prev.filter(a => a !== e.target.value))
    }
    else {
      setSizes(prev => [...prev, e.target.value])
    }

  }

  const updatePriceRange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setCategory([])
    setSubCategory([])
    setSizes([])
    setPriceRange({ min: '', max: '' })
    setBestsellerOnly(false)
    setSortType('relevant')
  }

  const sortProducts = (items) => {

    const productsCopy = items.slice();

    switch (sortType) {
      case 'low-high':
        return productsCopy.sort((a, b) => (a.price - b.price));

      case 'high-low':
        return productsCopy.sort((a, b) => (b.price - a.price));

      default:
        return productsCopy;
    }

  }

  const applyFilter = () => {

    let productsCopy = products.slice()

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    if (sizes.length > 0) {
      productsCopy = productsCopy.filter(item => item.sizes?.some(size => sizes.includes(size)));
    }

    if (priceRange.min !== '') {
      productsCopy = productsCopy.filter(item => item.price >= Number(priceRange.min));
    }

    if (priceRange.max !== '') {
      productsCopy = productsCopy.filter(item => item.price <= Number(priceRange.max));
    }

    if (bestsellerOnly) {
      productsCopy = productsCopy.filter(item => item.bestseller);
    }

    setFilterProducts(sortProducts(productsCopy))

  }

  useEffect(() => {
    applyFilter()
  }, [category, subCategory, search, showSearch, products, sizes, priceRange, bestsellerOnly, sortType])

  return (
    <div className='page-divider flex flex-col gap-6 border-t pt-10 sm:flex-row sm:gap-10'>

      {/* Filter Options */}
      <div className='min-w-64'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 flex cursor-pointer items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#6f7758]'>FILTERS<img className={`h-3 sm:hidden ${showFilter ? ' rotate-90' : ''}`} src={assets.dropdown_icon} alt="" /></p>

        {/* Category Filter */}
        <div className={`surface-panel mt-6 px-5 py-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'><input className='w-3' value={"Men"} checked={category.includes("Men")} onChange={toggleCategory} type="checkbox" /> Men </p>
            <p className='flex gap-2'><input className='w-3' value={"Women"} checked={category.includes("Women")} onChange={toggleCategory} type="checkbox" /> Women </p>
            <p className='flex gap-2'><input className='w-3' value={"Kids"} checked={category.includes("Kids")} onChange={toggleCategory} type="checkbox" /> Kids </p>
          </div>
        </div>

        {/* Sub Category Filter */}
        <div className={`surface-panel my-5 px-5 py-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'><input className='w-3' value={"Topwear"} checked={subCategory.includes("Topwear")} onChange={toggleSubCategory} type="checkbox" /> Topwear </p>
            <p className='flex gap-2'><input className='w-3' value={"Bottomwear"} checked={subCategory.includes("Bottomwear")} onChange={toggleSubCategory} type="checkbox" /> Bottomwear </p>
            <p className='flex gap-2'><input className='w-3' value={"Winterwear"} checked={subCategory.includes("Winterwear")} onChange={toggleSubCategory} type="checkbox" /> Winterwear </p>
          </div>

        </div>

        {/* Advanced Filter */}
        <div className={`surface-panel px-5 py-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>ADVANCED</p>

          <div className='mb-4'>
            <p className='mb-2 text-sm font-light text-gray-700'>Price Range</p>
            <div className='flex gap-2'>
              <input
                type="number"
                min="0"
                name="min"
                value={priceRange.min}
                onChange={updatePriceRange}
                placeholder="Min"
                className='w-1/2 border px-2 py-1 text-sm outline-none'
              />
              <input
                type="number"
                min="0"
                name="max"
                value={priceRange.max}
                onChange={updatePriceRange}
                placeholder="Max"
                className='w-1/2 border px-2 py-1 text-sm outline-none'
              />
            </div>
          </div>

          <div className='mb-4'>
            <p className='mb-2 text-sm font-light text-gray-700'>Sizes</p>
            <div className='grid grid-cols-3 gap-2 text-sm font-light text-gray-700'>
              {["S", "M", "L", "XL", "XXL"].map(size => (
                <p className='flex gap-2' key={size}>
                  <input className='w-3' value={size} checked={sizes.includes(size)} onChange={toggleSize} type="checkbox" />
                  {size}
                </p>
              ))}
            </div>
          </div>

          <p className='mb-4 flex gap-2 text-sm font-light text-gray-700'>
            <input className='w-3' checked={bestsellerOnly} onChange={(e) => setBestsellerOnly(e.target.checked)} type="checkbox" />
            Bestseller only
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className='secondary-action px-4 py-2 text-xs font-medium'
          >
            CLEAR FILTERS
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Product Sort */}
          <select value={sortType} onChange={(e) => setSortType(e.target.value)} className='rounded-full border px-4 py-2 text-sm' name="" id="">
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item) => (
              <ProductItem key={item._id} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Collection
