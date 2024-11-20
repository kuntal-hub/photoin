import React from 'react'

export default function MoreProductDetails({minDeliveryDays, maxDeliveryDays}: {minDeliveryDays: number, maxDeliveryDays: number}) {
    return (
        <>
            <p className='flex flex-nowrap justify-start mt-6 mb-3 text-sm'>
                <strong>
                    Delivery estimate:
                </strong>
                <span className='ml-3'>
                    Within {minDeliveryDays} to {maxDeliveryDays} days
                </span>
            </p>

            <p className='flex flex-nowrap justify-start my-3 text-sm'>
                <strong>
                    Size:
                </strong>
                <span className='ml-3'>
                    A4 Size {'(8x12 inches)'}
                </span>
            </p>

            <p className='flex flex-nowrap justify-start my-3 text-sm'>
                <strong>
                    Frame:
                </strong>
                <span className='ml-3'>
                    Included
                </span>
            </p>

            <p className='flex flex-nowrap justify-start my-3 text-sm'>
                <strong>
                    Material:
                </strong>
                <span className='ml-3'>
                    Supersoft photo print paper with matte finish lamination on top.
                </span>
            </p>
        </>
    )
}
