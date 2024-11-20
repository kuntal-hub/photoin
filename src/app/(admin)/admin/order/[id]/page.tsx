import React from 'react'
import { getAdminOrder } from '@/lib/actions/order.action'
import { redirect } from 'next/navigation'
import AdminOrderProductCard from '@/components/shared/AdminOrderProductCard';
import AdminOtherProductDetails from '@/components/shared/AdminOtherProductDetails';

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order: ViewedAdminOrder | null = await getAdminOrder(params.id)
  if (!order) {
    return redirect('/admin');
  }

  return (
    <div className='w-full'>
      <div className='w-full p-4 sm:px-8 md:px-12'>
        <p>
          <span className='font-bold mr-2'>
            Order Id :
          </span> {order._id}
        </p>
        <h2 className='mt-5 mb-2 font-bold text-xl underline text-green-600'>
          Buyer
        </h2>
        <div>
          <p>
            <span className='font-bold mr-2'>
              Name :
            </span> {order.buyer.firstName} {order.buyer.lastName}
          </p>
          <p>
            <span className='font-bold mr-2'>
              Email :
            </span> {order.buyer.email}
          </p>
        </div>

        <h2 className='mt-5 mb-2 font-bold text-xl underline text-green-600'>
          Products
        </h2>
        <div>
          {
            order.products.map((product, index) => (
              <div key={index} className='border-b-2 border-gray-200 py-2'>
                <AdminOrderProductCard product={product} />
              </div>
            ))
          }
        </div>

        <h2 className='mt-8 mb-4 font-bold text-xl underline text-green-600'>
          price Details:
        </h2>
        <div className='max-w-96'>
          {
            order.products.map((product, index) => (<p key={index} className='flex flex-nowrap justify-between w-full my-2'>
              <span className='font-bold mr-2'>
                {product.product.name.slice(0, 20)}{product.product.name.length > 17 ? '...' : ''} :
              </span> {product.product.discountedPrice || product.product.maxPrice} x {product.quantity} = {(product.product.discountedPrice || product.product.maxPrice) * product.quantity}
            </p>))
          }
          <hr />
          <p className='flex flex-nowrap justify-between w-full my-2'>
            <span className='font-bold mr-2'>
              Total Price :
            </span> <span className='text-blue-600'>₹{order.total}</span>
          </p>
        </div>

        <h2 className='mt-8 mb-4 font-bold text-xl underline text-green-600'>
          Delivery  Address:
        </h2>
        <div className='grid grid-cols-1 gap-2'>
          <p>
            <span className='font-bold mr-2'>
              Name :
            </span> {order.deliveryAddress.name}
          </p>
          <p>
            <span className='font-bold mr-2'>
              Phone :
            </span> {order.deliveryAddress.phone}
          </p>
          <p>
            <span className='font-bold mr-2'>
              Pincode :
            </span> {order.deliveryAddress.pinCode}
          </p>
          <p>
            <span className='font-bold mr-2'>
              Locality :
            </span> {order.deliveryAddress.locality}
          </p>
          <p>
            <span className='font-bold mr-2'>
              Address :
            </span> {order.deliveryAddress.address}
          </p>
          <p>
            <span className='font-bold mr-2'>
              District :
            </span> {order.deliveryAddress.district}
          </p>
          <p>
            <span className='font-bold mr-2'>
              State :
            </span> {order.deliveryAddress.state}
          </p>
          <p>
            <span className='font-bold mr-2'>
              Landmark :
            </span> {order.deliveryAddress.landmark}
          </p>
        </div>
      </div>
      
      <AdminOtherProductDetails
        order={order} />

    </div>
  )
}
