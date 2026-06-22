import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link, useLocation } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {

  const { currency, toggleWishlist, isWishlisted } = useContext(ShopContext);
  const location = useLocation();
  const wishlisted = isWishlisted(id);

  return (
    <div className='group relative overflow-hidden rounded-[22px] border border-[#d6b46a]/25 bg-[#fffaf2]/80 p-2 text-[#2f281f] shadow-[0_12px_35px_rgba(47,40,31,0.07)] backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(47,40,31,0.14)]'>
      <button
        type="button"
        onClick={() => toggleWishlist(id, { redirectTo: location.pathname + location.search })}
        className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-[#fffaf2]/90 text-lg shadow-sm backdrop-blur transition ${
          wishlisted ? 'border-red-200 text-red-500' : 'border-[#d6b46a]/30 text-[#6f7758] hover:text-red-500'
        }`}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wishlisted ? "\u2665" : "\u2661"}
      </button>

      <Link to={`/product/${id}`} onClick={() => window.scrollTo(0, 0)} className='block cursor-pointer'>
        <div className='aspect-[4/5] overflow-hidden rounded-[16px] bg-[#eee4d4]'>
          <img className='h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105' src={image[0]} alt="" />
        </div>

        <div className='px-2 pb-2 pt-4'>
          <p className='line-clamp-2 min-h-10 text-sm font-medium'>{name}</p>
          <p className='mt-2 text-sm font-semibold text-[#6f7758]'>{currency}{price}</p>
        </div>
      </Link>
    </div>
  )
}

export default ProductItem
