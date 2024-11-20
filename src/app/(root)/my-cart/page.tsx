'use client';
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getMyCart } from '@/lib/actions/cart.action';
import { useEffect } from 'react';
import { setCart } from '@/lib/features/cartSlice';
import { Button } from '@/components/ui/button';
import CartItemsCard from '@/components/shared/CartItemsCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/shared/Footer';

export default function MyCartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.cart);
  const isFatched = useAppSelector(state => state.cart.isFatched);
  const totalPrice = useAppSelector(state => state.cart.totalPrice);
  const totalDiscountedPrice = useAppSelector(state => state.cart.totalDiscountedPrice);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!isFatched) {
        const res: CartItem[] | null = await await getMyCart();
        if (res) {
          dispatch(setCart({ cart: res }));
        }
      }
    })()
  }, [])

  return (
    <>
      <div className='w-full pb-10 pt-5 bg-gray-100'>
        {isFatched ? <>
          {cartItems.length > 0 ?
            <div className='w-[94%] max-w-[900px] mx-auto bg-white rounded-sm shadow-lg'>

              {
                cartItems.map((cartItem: CartItem) => (
                  <CartItemsCard key={cartItem._id} cartItem={cartItem} />
                ))
              }

              <div className='w-full sticky bottom-0 shadow-top-md p-4 flex flex-wrap bg-white z-20 justify-between items-center'>
                <div className='px-4'>
                  <p className='mb-2'>Price :<span className=' text-red-600 ml-3 line-through'>&#8377; {totalPrice}</span></p>
                  <p className='mb-2'>Final Price :<span className=' ml-3 text-green-600'>
                    &#8377; {totalDiscountedPrice} Only</span></p>

                  <p className='text-xs text-green-500 border-t pt-2'>
                    You will save &#8377;{totalPrice! - totalDiscountedPrice!} on this order
                  </p>
                </div>
                <Button onClick={() => router.push('/checkout-cart')}
                  className='bg-orange-500 hover:bg-orange-600 font-bold h-12 w-48 mt-6 min-[483px]:mt-0'>
                  PLACE ORDER
                </Button>
              </div>
            </div> :
            <div className='w-[94%] max-w-[900px] mx-auto bg-white rounded-sm shadow-lg p-4 h-[50vh] flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center'>
                <p className='mb-4'>
                  Your cart is empty 🥺
                </p>
                <Link href='/' className=' bg-orange-500 hover:bg-orange-600 px-6 py-2 text-white rounded-md'>
                  Browse Products
                </Link>
              </div>
            </div>}
        </> : <div className='w-[94%] max-w-[900px] mx-auto bg-white rounded-sm shadow-lg h-[55vh] flex justify-center items-center'>
          <div className="loader2"></div>
        </div>}
      </div>
      <Footer />
    </>
  )
}
