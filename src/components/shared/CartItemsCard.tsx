'use client';
import Image from 'next/image';
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAppDispatch } from '@/lib/hooks';
import { updateItemQuantity as updateQuantity } from '@/lib/features/cartSlice';
import { removeFromCart } from '@/lib/actions/cart.action';
import { removeCart } from '@/lib/features/cartSlice';
import { useState } from 'react';
import { updateItemQuantity } from '@/lib/actions/cart.action';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { removeProduct } from '@/lib/features/customizeProductsSlice';


export default function CartItemsCard({ cartItem }: { cartItem: CartItem }) {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();

    const deleteItem = async () => {
        setDisabled(true);
        const res = await removeFromCart(cartItem._id);
        if (res) {
            dispatch(removeCart(cartItem._id));
            dispatch(removeProduct(cartItem.product._id));
        }
        setDisabled(false);
    }

    return (
        <div className='my-3 w-full'>
            <div className='flex p-2 sm:p-4 w-full'>
                <div className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm overflow-hidden'>
                    {(cartItem.processedImage || cartItem.product.mainPhoto) ?
                        <Dialog>
                            <DialogTrigger asChild>
                                <Image src={cartItem.processedImage ? cartItem.processedImage : cartItem.product.mainPhoto}
                                    alt="product image"
                                    width={120} height={160}
                                    className='w-full h-full object-cover cursor-pointer' />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px]">
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>

                                    </DialogDescription>
                                </DialogHeader>
                                <Image src={cartItem.processedImage ? cartItem.processedImage : cartItem.product.mainPhoto}
                                    alt='product image' width={450} height={600}
                                    className='w-full' />
                            </DialogContent>
                        </Dialog>
                        : <Skeleton className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px]' />
                    }
                </div>
                <div className='flex flex-col ml-4 w-[calc(100%-90px)] sm:w-[calc(100%-120px)]'>
                    <div className='text-sm sm:text-lg font-bold'>{cartItem.product.name} <Badge className='text-xs h-[22px] bg-green-500 hover:bg-green-600 pb-1'>
                        {cartItem.product.badge}
                    </Badge></div>
                    <p className='text-xs sm:text-sm mt-2 text-gray-500'>{cartItem.product.description}</p>
                    <p className='my-2 p-0'>
                        <span className='text-xs text-red-600 line-through'>&#8377; {cartItem.product.maxPrice}</span>
                        <span className=' text-sm ml-5 text-green-600'>
                            &#8377; {cartItem.product.discountedPrice} Only</span>
                    </p>
                    <p>
                        <span className='text-xs lg:text-sm text-gray-600'>Delivery in {cartItem.product.minDeliveryDays}-{cartItem.product.maxDeliveryDays} days</span>
                    </p>
                    {cartItem.formData && (cartItem.formData.data || cartItem.formData.images) && !cartItem.processedImage && <Dialog>
                        <DialogTrigger asChild>
                            <Button variant='ghost' className='w-40 mt-3 text-blue-600 hover:text-blue-500 hover:underline'>
                                Your Provided Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Your Provided Details
                                </DialogTitle>
                                <DialogDescription>
                                    Those details are provided by you and required to customize your printable image.
                                </DialogDescription>
                            </DialogHeader>
                            <ul>
                                {
                                    cartItem.formData && cartItem.formData.data && (Object.keys(cartItem.formData.data).map((item, i) => (
                                        <li className="flex justify-start text-xs min-[375px]:text-sm my-1 items-center" key={i}>
                                            <strong>
                                                {item.replaceAll('_', ' ')} :
                                            </strong>
                                            <span className='ml-2'>
                                                {`${cartItem.formData?.data[item]}`}
                                            </span>
                                        </li>
                                    )))
                                }
                            </ul>
                            <ul>
                                {
                                    cartItem.formData && cartItem.formData.images && (Object.keys(cartItem.formData.images).map((item, i) => (
                                        <li className="flex justify-start text-xs min-[375px]:text-sm my-1 items-center" key={i}>
                                            <strong>
                                                {item.replaceAll('_', ' ')} :
                                            </strong>
                                            <Link href={`/customize/${cartItem.product._id}#${item}`}
                                                className='ml-2 hover:underline hover:text-blue-700'>
                                                {Array.isArray(cartItem.formData?.images[item]) ? `${cartItem.formData?.images[item].length} images` : `1 image`}
                                            </Link>
                                        </li>
                                    )))
                                }
                            </ul>
                            {!cartItem.processedImage && <DialogFooter>
                                <Link href={`/customize/${cartItem.product._id}`}>
                                    <Button className='bg-blue-500 hover:bg-blue-600'>
                                        Edit Details
                                    </Button>
                                </Link>
                            </DialogFooter>}
                        </DialogContent>
                    </Dialog>}
                </div>


            </div>
            <div className='flex flex-nowrap justify-start items-center px-2 sm:px-4 '>
                <div>
                    <Button onClick={async () => {
                        if (cartItem.quantity > 1) {
                            setDisabled(true);
                            dispatch(updateQuantity({ _id: cartItem._id, quantity: cartItem.quantity - 1 }))
                            await updateItemQuantity({ cartId: cartItem._id, quantity: cartItem.quantity - 1 });
                        }
                        setDisabled(false);
                    }} disabled={(cartItem.quantity === 1) || disabled}
                        variant='secondary' className='text-lg border border-gray-300 rounded-full'>
                        -
                    </Button>
                    <span className='px-6 mx-2 border border-gray-400 py-[2px]'>
                        {cartItem.quantity}
                    </span>
                    <Button onClick={async () => {
                        if (cartItem.quantity < 10) {
                            setDisabled(true);
                            dispatch(updateQuantity({ _id: cartItem._id, quantity: cartItem.quantity + 1 }))
                            await updateItemQuantity({ cartId: cartItem._id, quantity: cartItem.quantity + 1 });
                        }
                        setDisabled(false);
                    }} disabled={(cartItem.quantity === 10) || disabled}
                        variant='secondary' className='text-lg border border-gray-300 rounded-full'>
                        +
                    </Button>
                </div>
                <Button onClick={deleteItem}
                    disabled={disabled}
                    variant='ghost' className='m-3 hover:underline font-semibold text-red-600 hover:text-red-500'>
                    Remove
                </Button>
            </div>
            {disabled &&
                <div className='w-screen h-screen fixed top-0 left-0 bg-black/70 z-50 flex items-center justify-center'>
                    <div>
                        <div className='loader2'></div>
                        <p className='py-4 text-lg text-white'>
                            Updating......
                        </p>
                    </div>
                </div>}
        </div>
    )
}
