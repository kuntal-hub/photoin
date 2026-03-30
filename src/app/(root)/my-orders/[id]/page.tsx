import { redirect } from 'next/navigation'
import React from 'react'
import { getMyOrderDetails } from '@/lib/actions/order.action'
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import ReviewBtn from '@/components/shared/reviewBtn';
import { auth } from '@clerk/nextjs/server';
import DeliveryProgressSection from '@/components/shared/DeliveryProgressSection';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, CircleX, Cpu, Info } from 'lucide-react';
import { deliveryCharge, instantDiscount } from '@/constants/index'
import Link from 'next/link';
import Footer from '@/components/shared/Footer';

export default async function OrderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const order: MyOrderDetails | null = await getMyOrderDetails(id);
  if (!order) {
    return redirect('/my-orders');
  }
  // console.log(order)
  return (
    <>
      <div className='w-full pb-10 pt-5 bg-gray-100 '>
        <div className='block w-[96%] max-w-[900px] mx-auto bg-white rounded-sm shadow-lg'>
          <p className='text-xs md:text-sm py-3 px-2 sm:px-4 text-gray-500'>
            Order ID - {order._id}
          </p><hr />
          <div className='grid grid-cols-1 gap-3 py-6'>
            {
              order.products.map((product, index) => (
                <div className='flex px-2 sm:px-4 w-full' key={index}>
                  <div className='w-[90px] h-[120px] bg-gray-200 rounded-sm overflow-hidden'>
                    {(product.mainPhoto || product.photos[0]) ?
                      <Link href={`/product/${product._id}`}><Image src={product.mainPhoto || product.photos[0]}
                        alt="product image"
                        width={90} height={120}
                        className='w-full h-full object-cover cursor-pointer' /></Link>
                      : <Skeleton
                        className='w-[90px] h-[120px]' />
                    }
                  </div>
                  <div className='flex flex-col ml-4 w-[calc(100%-90px)] sm:w-[calc(100%-120px)]'>
                    <p className='text-sm sm:text-lsm font-bold'>{product.name}</p>
                    <p className='text-xs mt-[2px] text-gray-500'>{product.description}</p>
                    <p className='text-xs mt-[2px] text-gray-500'>Quantity: <span className='text-black font-bold'>{product.quantity}</span></p>
                    <p className='text-xs mt-[2px] text-gray-500'>Price: <span className='text-black font-bold'>₹{product.discountedPrice || product.maxPrice}</span></p>
                    <div className='mt-2'>
                      <Badge
                        className={`text-xs items-center ${order.status === "completed" ? "bg-green-500 hover:bg-green-600" : order.status === "cancelled" ? "bg-red-500 hover:bg-red-600" : order.status === "processing" ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-400"} text-white`}
                      >
                        <span>
                          {order.status === 'cancelled' && <CircleX size={16} className='mr-1' />}
                          {order.status === 'pending' && <Info size={16} className='mr-1' />}
                          {order.status === 'completed' && <CheckCheck size={16} className='mr-1' />}
                          {order.status === 'processing' && <Cpu size={16} className='mr-1' />}
                        </span>
                        <span>
                          {
                            order.status === "completed" ? "Delivered" : order.status
                          }
                        </span>
                      </Badge>
                    </div>
                    {order.status === 'completed' && <ReviewBtn review={product.review} userId={userId} productId={product._id} />}
                  </div>
                </div>
              ))
            }
          </div><hr />

          {order.status !== 'cancelled' ? <DeliveryProgressSection
            orderId={order._id}
            deliveryStatus={order.deliveryStatus}
            status={order.status}
            paymentMethod={order.paymentMethod}
            createdAt={new Date(order.createdAt).toLocaleDateString()}
            updatedAt={new Date(order.updatedAt).toLocaleDateString()}
          /> : <div className='grid place-content-center h-32 bg-red-50'>
            <p className='text-center text-red-500 font-bold sm:text-lg'>
              You have cancelled this order🥺
            </p>
          </div>}<hr />


          <div className='pt-6 pb-4 w-full'>
            <h2 className='text-xs font-bold text-gray-500 px-4 sm:px-10 border-b border-b-gray-200 pb-4'>
              Shipping details
            </h2>
            <h3 className='font-bold px-4 sm:px-10 pt-4 pb-2'>
              {order.deliveryAddress.name}
            </h3>
            <div className='px-4 sm:px-10 grid grid-cols-1 gap-1'>
              <p className='text-xs'>Pincode - {order.deliveryAddress.pinCode}</p>
              <p className='text-xs'>{order.deliveryAddress.address}</p>
              <p className='text-xs'>{order.deliveryAddress.locality}, {order.deliveryAddress.landmark}</p>
              <p className='text-xs'>{order.deliveryAddress.district}</p>
              <p className='text-xs'>{order.deliveryAddress.state}</p>
              <p className='text-xs'>Phone no - {order.deliveryAddress.phone}</p>
            </div>
          </div><hr />

          <div className='pt-10 w-full'>
            <h2 className='text-xs font-bold text-gray-500 px-4 sm:px-10 border-b border-b-gray-200 pb-4'>
              Billing details
            </h2>
            <div className='px-4 sm:px-10 grid grid-cols-1 gap-1 w-full max-w-96 pt-1 pb-5'>
              {
                order.products.map((product, index) => (
                  <div className=' grid grid-cols-1 gap-2 py-2' key={index}>
                    <p className='text-sm font-bold'>{product.name}</p>
                    <p className='text-xs flex flex-nowrap justify-between'>
                      <span>
                        List Price
                      </span>
                      <span className=' line-through'>₹{product.maxPrice}</span>
                    </p>
                    <p className='text-xs flex flex-nowrap justify-between'>
                      <span>
                        Discount
                      </span>
                      <span>₹{product.maxPrice - (product.discountedPrice || product.maxPrice)}</span>
                    </p>
                    <div className='text-xs flex flex-nowrap justify-between'>
                      <span>
                        Delivery Charges
                      </span>
                      <p>
                        <span className='line-through mr-2'>₹{deliveryCharge}</span>
                        <span className='text-green-600'>Free</span>
                      </p>
                    </div>
                    {order.paymentMethod !== "cod" && <p className='text-xs flex flex-nowrap justify-between'>
                      <span>
                        Instant Discount
                      </span>
                      <span>₹{instantDiscount}</span>
                    </p>}
                    <p className='text-xs flex flex-nowrap justify-between'>
                      <span>
                        Final Price
                      </span>
                      <span>₹{product.discountedPrice || product.maxPrice}</span>
                    </p>
                  </div>
                ))
              }
              <p className='flex flex-nowrap justify-between border-t border-t-gray-300 py-2'>
                <span className='text-xs font-bold'>Total Amount</span>
                <span className='text-xs font-bold text-green-500'>₹{order.total}</span>
              </p>
            </div>
          </div>


        </div>
      </div>
      <Footer />
    </>
  )
}
