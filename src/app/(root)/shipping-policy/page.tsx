import Image from 'next/image'
import React from 'react'
import { phone, email } from '@/constants/index'
import Footer from '@/components/shared/Footer'

export default function ShippingPolicyPage() {
    return (
        <div>
            <div className='flex flex-col justify-center max-w-[600px] mx-auto items-center text-left px-4 sm:px-8 pb-10 md:px-12'>
                <div>
                    <Image src="/Purple Orange Camera Photography Logo1.png" alt="our logo" height={350} width={350}
                        className=' w-[200px]  sm:w-[250px] md:w-[300px] lg:w-[350px]' />
                </div>
                <h1 className='m-0 p-0 text-lg font-[800] sm:text-2xl md:text-4xl mb-20'>
                    Our Shipping Policy.
                </h1>



                <p>
                    Effective Date: 1st October 2024
                </p>

                <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>How long is the order processing time?</h3>
                <p className='pl-6 sm:pl-12 mb-3'>{"It usually takes around 2-4 working days for processing the samples and then approximately 3-7 working days to deliver depends on your location (up to 12 days in total)"}</p>
                <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>How do I track my orders?</h3>
                <p className='pl-6 sm:pl-12 mb-3'>Once we shipped your order, Tracking link would be sent on your phone. You can have the live status and the delivery estimate there.</p>
                <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>Are you providing free shipping?</h3>
                <p className='pl-6 sm:pl-12 mb-3'>Yes, we do free shipping.&nbsp;</p>
                <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>Is Cash on delivery available?</h3>
                <p className='pl-6 sm:pl-12 mb-3'>Yes, you can get&nbsp;receive your gift by cash on delivery option. ₹100 will be charged extra for cash on delivery orders.</p>
                <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>Can I cancel my order?</h3>
                <p className='pl-6 sm:pl-12 mb-3'>Orders can be canceled within 12 hours of placing the order, by reaching us at <a className='text-blue-600 hover:underline' href={`"tel:+91${phone}`}>+91 {phone}</a> or via email at <a className='text-blue-600 hover:underline' href={`mailto:${email}`}>{email}</a>.&nbsp;</p>
            </div>
            <Footer />
        </div>
    )
}
