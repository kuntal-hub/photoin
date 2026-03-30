import { Sparkles } from 'lucide-react'
import React from 'react'
import { Badge } from '../ui/badge'

export default function Offers() {
    return (
        <>
            <div className='flex flex-nowrap text-sm mt-6'>
                <Sparkles size={18} className=' text-green-600' />
                <span className='text-gray-600 mx-2'>
                    Free Shipping on first purchase.
                </span>
                <Badge className='bg-blue-600 hidden sm:inline h-[22px]'>New</Badge>
            </div>
            <div className='flex flex-nowrap text-sm my-2'>
                <Sparkles size={18} className=' text-green-600' />
                <span className='text-gray-600 mx-2'>
                    &#8377; 50 <strong>instant discount </strong> on online payment.
                </span>
                <Badge className='bg-blue-600 hidden sm:inline h-[22px]'>New</Badge>
            </div>
            <div className='flex flex-nowrap text-sm my-2'>
                <Sparkles size={18} className=' text-green-600' />
                <span className='text-gray-600 mx-2'>
                    Free photo editing and customization support.
                </span>
                <Badge className='bg-green-600 hidden sm:inline h-[22px]'>Free</Badge>
            </div>

            <div className='flex flex-nowrap text-sm my-2'>
                <Sparkles size={18} className=' text-green-600' />
                <span className='text-gray-600 mx-2'>
                    Easily customizable, accourding to your need.
                </span>
                <Badge className='bg-green-600 hidden sm:inline h-[22px]'>Free</Badge>
            </div>
        </>
    )
}
