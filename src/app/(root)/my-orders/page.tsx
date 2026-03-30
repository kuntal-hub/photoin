import React from 'react'
import { getMyOrders } from '@/lib/actions/order.action'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, CircleX, Cpu, Info } from 'lucide-react';
import Footer from '@/components/shared/Footer';

export default async function MyOrderPage() {
  const orders: MyOrders[] | null = await getMyOrders();
  if (!orders) {
    return redirect('/');
  }
  // console.log(orders)
  const rating = 3;
  return (
    <>
      <div className='m-0 p-0 min-h-[60vh] bg-gray-100'>
        <div className='w-full pb-10 pt-5 bg-gray-100 grid grid-cols-1 gap-3'>
          {
            orders.map((order: MyOrders, index: number) => (
              <Link href={`/my-orders/${order._id}`} key={index}
                className='block w-[94%] max-w-[900px] mx-auto bg-white rounded-sm shadow-lg hover:bg-gray-100'>
                <div className='flex p-2 sm:p-4 w-full'>
                  <div className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm overflow-hidden'>
                    {(order.product.mainPhoto || order.product.photos[0]) ?
                      <Image src={order.product.mainPhoto || order.product.photos[0]}
                        alt="product image"
                        width={120} height={160}
                        className='w-full h-full object-cover cursor-pointer' />
                      : <Skeleton className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px]' />
                    }
                  </div>
                  <div className='flex flex-col ml-4 w-[calc(100%-90px)] sm:w-[calc(100%-120px)]'>
                    <p className='text-sm sm:text-lg font-bold'>{order.product.name}</p>
                    <p className='text-xs sm:text-sm mt-2 text-gray-500'>{order.product.description}</p>
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

                    <div className=''>
                      {[1, 2, 3, 4, 5].map((star, index) => {
                        const currentRating = index + 1;

                        return (
                          <label key={index}>
                            <input
                              className='hidden'
                              key={star}
                              type="radio"
                              name="rating"
                              value={currentRating}
                            />
                            <span
                              className="mx-0 text-[25px] cursor-pointer"
                              style={{
                                color:
                                  currentRating <= (order.review?.rating || 0) ? "#ffc107" : "#e4e5e9",
                              }}
                            >
                              &#9733;
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <p className='text-sm text-gray-500'>
                      {order.review?.comment}
                    </p>

                  </div>
                </div>
              </Link>
            ))
          }
          {
            orders.length === 0 && (
              <div className='h-[40vh] grid place-content-center w-[94%] max-w-[900px] mx-auto bg-white rounded-sm shadow-lg'>
                <div className='flex flex-col items-center'>
                  <p className='text-center text-sm sm:text-lg md:text-xl text-gray-700'>
                    You have not placed any orders yet.😓
                  </p>
                  <Link href={'/'} className='bg-orange-400 hover:bg-orange-500 px-6 rounded-md text-white mt-4 py-3'>
                    Browse Products
                  </Link>
                </div>
              </div>
            )
          }
        </div>
      </div>
      <Footer />
    </>
  )
}
