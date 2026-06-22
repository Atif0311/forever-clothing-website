import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const [latestProducts, setLatestProducts] = useState([])
    const { products } = useContext(ShopContext)

    useEffect(() => {

        if (products.length > 0) {
            setLatestProducts(products.slice(0, 10))
        }

    }, [products])

    return (
        <div className='my-16'>
            <div className='py-10 text-center text-3xl'>
                <Title text1={"LATEST"} text2={"COLLECTIONS"} />
                <p className='section-copy m-auto w-3/4 max-w-2xl text-xs sm:text-sm md:text-base'>Freshly selected pieces built around refined colors, comfortable fits, and everyday versatility.</p>
            </div>

            {/* Rendering Products */}
            <div className='grid grid-cols-2 gap-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {
                    latestProducts.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>

        </div>
    )
}

export default LatestCollection
