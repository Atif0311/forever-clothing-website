import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const [bestSeller, setBestSeller] = useState([])
    const { products } = useContext(ShopContext)

    useEffect(() => {

        const bestProduct = products.filter((item) => (item.bestseller))
        setBestSeller(bestProduct.slice(0, 5))

    }, [products])

    return (
        <div className='my-16'>
            <div className='py-10 text-center text-3xl'>
                <Title text1={"BEST"} text2={"SELLERS"} />
                <p className='section-copy m-auto w-3/4 max-w-2xl text-xs sm:text-sm md:text-base'>The pieces our customers return to most, chosen for their timeless shape and effortless styling.</p>
            </div>

            <div className='grid grid-cols-2 gap-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {
                    bestSeller.map((item, index) => (
                        <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller
