import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Productcard({ product, navLink }: { product: ProductView, navLink: string }) {

    return (
        <Link href={navLink} aria-label={product.name}
            className='block relative m-1 rounded-[10px] border border-dashed bg-purple-100/20 shadow-inner w-[150px] min-[410px]:w-[180px]'>
            {product.mainPhoto && <Image src={product.mainPhoto} height={400} width={300} alt='product image'
                className='w-[150px] min-[410px]:w-[180px] rounded-t-[10px] min-[410px]:h-[240px] h-[200px] object-cover aspect-[3/4]' />}
            {!product.mainPhoto && <div className='w-[150px] min-[410px]:w-[180px] rounded-t-[10px] min-[410px]:h-[240px] h-[200px] bg-gray-200 flex items-center justify-center'>
                <p className='text-[14px] text-gray-500'>No Image</p>
            </div>}
            <div className='p-1'>
                <p className='text-xs text-center p-0 m-0 font-semibold'>{product.name.length < 19 ? product.name : product.name.slice(0, 18) + '...'}</p>
                <p className='m-0 p-0 text-center'>
                    <span className='text-[12px] text-red-600 line-through'>&#8377; {product.maxPrice}</span>
                    <span className='text-[14px] ml-3 text-green-600'>
                        &#8377; {product.discountedPrice ? product.discountedPrice : product.maxPrice} Only</span></p>
            </div>
            {product.badge && <div className="ribbon"><span>{product.badge}</span></div>}
        </Link>
    )
}
