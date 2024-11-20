'use client'
import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  setOrders,
  addOrders,
  setDays,
  setStatus,
  setPaymentMethod,
  setPaymentStatus,
  setDeliveryStatus,
  setSearchedEmail,
  setPage
} from '@/lib/features/adminOrdersSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getAllOrders, searchProductsByEmail } from '@/lib/actions/order.action';
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'


export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const orders = useAppSelector(state => state.adminOrders.orders)
  const days = useAppSelector(state => state.adminOrders.days)
  const status = useAppSelector(state => state.adminOrders.status)
  const paymentMethod = useAppSelector(state => state.adminOrders.paymentMethod)
  const paymentStatus = useAppSelector(state => state.adminOrders.paymentStatus)
  const deliveryStatus = useAppSelector(state => state.adminOrders.deliveryStatus)
  const searchedEmail = useAppSelector(state => state.adminOrders.searchedEmail)
  const page = useAppSelector(state => state.adminOrders.page)
  const hasmore = useAppSelector(state => state.adminOrders.hasmore)
  const isFatched = useAppSelector(state => state.adminOrders.isFatched)
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { toast } = useToast()

  const handelSearch = (data: any) => {
    dispatch(setSearchedEmail(data.search))
  }

  const getColor = (key:'status' | 'paymentMethod' | 'paymentStatus' | 'deliveryStatus', value:string):string => {
    if (key === 'status') {
      if (value === "pending") {
        return 'text-yellow-500'
      } else if( value === "processing") {
        return 'text-blue-600'
      } else if(value === "completed" ) {
        return 'text-green-600'
      } else {
        return 'text-red-600'
      }
    } else if(key === 'paymentStatus') {
      if (value === "pending") {
        return 'text-yellow-500'
      } else if(value === "completed" ) {
        return 'text-green-600'
      } else {
        return 'text-red-600'
      }
    } else if(key === 'paymentMethod') {
      if (value === "cod") {
        return 'text-[#4CAF50]'
      } else if( value === "online") {
        return 'text-[#00BFFF]'
      } else {
        return ''
      }
    } else if(key === 'deliveryStatus') {
      if (value === "ordered") {
        return 'text-[#007BFF]'
      } else if( value === "shipped") {
        return 'text-[#FF7F50]'
      } else if(value === "outOfDelivery" ) {
        return 'text-[#FFD700]'
      } else {
        return 'text-[#28A745]'
      }
    } else {
      return ''
    }
  }

  const fatchOrders = async (page:number) =>{
    const limit = 25;
    const res:AdminOrder[] | null = await getAllOrders({
      days: days,
      deliveryStatus: deliveryStatus,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      status: status,
      page: page,
      limit: limit
    })
    if (res) {
      if (page === 1) {
        dispatch(setOrders({
          orders: res,
          days: days,
          status: status,
          deliveryStatus: deliveryStatus,
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus,
          page: page,
          hasmore: res.length < limit ? false : true
        }));
        setLoading(false);
      } else {
        dispatch(addOrders({
          orders: res,
          days: days,
          status: status,
          deliveryStatus: deliveryStatus,
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus,
          page: page,
          hasmore: res.length < limit ? false : true
        }));
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast({
        title: "Error",
        description: "Error on fetching orders",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (!isFatched) {
      setLoading(true);
      fatchOrders(1);
    }
  }, [days, status, paymentMethod, paymentStatus, deliveryStatus])

  useEffect(() => {
    (async () => {
      if (searchedEmail && !isFatched) {
        setLoading(true);
        const res:AdminOrder[] | null = await searchProductsByEmail(searchedEmail)
        if (res) {
          dispatch(setOrders({
            orders: res,
            days: days,
            status: status,
            deliveryStatus: deliveryStatus,
            paymentMethod: paymentMethod,
            paymentStatus: paymentStatus,
            searchedEmail: searchedEmail,
            page: 1,
            hasmore: false
          }));
          setLoading(false);
        } else {
          setLoading(false);
          toast({
            title: "Error",
            description: "User not exists",
            variant: "destructive"
          })
        }
      }
    })()
  }, [searchedEmail])

  return (
    <>
      {
        !loading ? <div className='w-full overflow-x-hidden'>

          <div className='flex flex-wrap justify-between bg-gray-200 px-2 pb-2'>
            <form className='mx-3 mt-2' onSubmit={handleSubmit(handelSearch)} >
              <label
                className='text-gray-900 text-[12px] font-semibold mr-2'
                htmlFor="jhfgvjdhbj">
                EMAIL
              </label>
              <input type="email"
                className='text-gray-900 text-[12px] font-semibold bg-white w-[160px] px-2 py-[6px] rounded-l-md border border-gray-400 focus:outline-none border-r-0 '
                id="jhfgvjdhbj"
                placeholder='Enter user email...'
                required={true}
                defaultValue={searchedEmail}
                {...register("search")} />
              <input type="submit" value="search"
                className='text-white text-[12px] font-semibold bg-green-500 px-2 py-[6px] rounded-r-md border border-gray-400 focus:outline-none border-l-0 hover:bg-green-600 cursor-pointer'
              />
            </form>

            <div className='mx-3 mt-2'>
              <label
                className='text-gray-900 text-[12px] font-semibold mr-2'
                htmlFor="jhfgvjdhbjtyhh1">
                ORDER STATUS
              </label>
              <select
                className='text-gray-600 text-[12px] font-semibold bg-white w-[110px] px-2 py-[6px] rounded-md border border-gray-400 focus:outline-none focus:border-zinc-100'
                id="jhfgvjdhbjtyhh1"
                value={status}
                onChange={(e) => {
                  if (e.target.value === 'all' || e.target.value === 'pending' || e.target.value === 'processing' || e.target.value === 'completed' || e.target.value === 'cancelled') {
                    dispatch(setStatus(e.target.value))
                  } else {
                    dispatch(setStatus('all'))
                  }
                }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>


            <div className='mx-3 mt-2'>
              <label
                className='text-gray-900 text-[12px] font-semibold mr-2'
                htmlFor="jhfgvjdhbjtyhh2">
                PAYMENT METHOD
              </label>
              <select
                className='text-gray-600 text-[12px] font-semibold bg-white w-[110px] px-2 py-[6px] rounded-md border border-gray-400 focus:outline-none focus:border-zinc-100'
                id="jhfgvjdhbjtyhh2"
                value={paymentMethod}
                onChange={(e) => {
                  if (e.target.value === 'all' || e.target.value === 'cod' || e.target.value === 'online') {
                    dispatch(setPaymentMethod(e.target.value))
                  } else {
                    dispatch(setPaymentMethod('all'))
                  }
                }}
              >
                <option value="all">Both</option>
                <option value="cod">COD</option>
                <option value="online">Online</option>
              </select>
            </div>

            <div className='mx-3 mt-2'>
              <label
                className='text-gray-900 text-[12px] font-semibold mr-2'
                htmlFor="jhfgvjdhbjtyhh3">
                PAYMENT STATUS
              </label>
              <select
                className='text-gray-600 text-[12px] font-semibold bg-white w-[110px] px-2 py-[6px] rounded-md border border-gray-400 focus:outline-none focus:border-zinc-100'
                id="jhfgvjdhbjtyhh3"
                value={paymentStatus}
                onChange={(e) => {
                  if (e.target.value === 'all' || e.target.value === 'pending' || e.target.value === 'completed' || e.target.value === 'failed') {
                    dispatch(setPaymentStatus(e.target.value))
                  } else {
                    dispatch(setPaymentStatus('all'))
                  }
                }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className='mx-3 mt-2'>
              <label
                className='text-gray-900 text-[12px] font-semibold mr-2'
                htmlFor="jhfgvjdhbjtyii">
                DELIVERY STATUS
              </label>
              <select
                className='text-gray-600 text-[12px] font-semibold bg-white w-[110px] px-2 py-[6px] rounded-md border border-gray-400 focus:outline-none focus:border-zinc-100'
                id="jhfgvjdhbjtyii"
                value={deliveryStatus}
                onChange={(e) => {
                  if (e.target.value === 'all' || e.target.value === 'ordered' || e.target.value === 'shipped' || e.target.value === 'outOfDelivery' || e.target.value === 'delivered') {
                    dispatch(setDeliveryStatus(e.target.value))
                  } else {
                    dispatch(setDeliveryStatus('all'))
                  }
                }}
              >
                <option value="all">All</option>
                <option value="ordered">Ordered</option>
                <option value="shipped">Shipped</option>
                <option value="outOfDelivery">Out of Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className='mt-2 mx-3'>
              <label
                className='text-gray-900 text-[12px] font-semibold mr-2'
                htmlFor="jhfgvjdhbjty4">
                VIEW LAST
              </label>
              <select
                className='text-gray-600 text-[12px] font-semibold bg-white w-[110px] px-2 py-[6px] rounded-md border border-gray-400 focus:outline-none focus:border-zinc-100'
                id="jhfgvjdhbjty4"
                value={days}
                onChange={(e) => {
                  dispatch(setDays(parseInt(e.target.value)))
                }}
              >
                <option value="1">1 Days</option>
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
                <option value="15">15 Days</option>
                <option value="30">30 Days</option>
                <option value="365">365 Days</option>
              </select>
            </div>

          </div>

          <div className='w-full my-2'>
            <table className='w-full text-gray-900 text-[12px] font-semibold'>
              <thead>
                <tr className='bg-blue-500 text-white'>
                  <th className='p-2 text-center'>SL NO.</th>
                  <th className='p-2 text-center'>CUSTOMER</th>
                  <th className='p-2 text-center hidden xl:block'>PRODUCTS</th>
                  <th className='p-2 text-center'>QUANTITY</th>
                  <th className='p-2 text-center'>TOTAL</th>
                  <th className='p-2 text-center'>STATUS</th>
                  <th className='p-2 text-center'>PAYMENT METHOD</th>
                  <th className='p-2 text-center'>PAYMENT STATUS</th>
                  <th className='p-2 text-center'>DELIVERY STATUS</th>
                  <th className='p-2 text-center'>DATE</th>
                  <th className='py-2 px-4 text-center'>VIEW</th>
                </tr>
              </thead>
              <tbody>
                {
                  orders.map((order, index) => (
                    <tr key={index} 
                    className={`border-b border-gray-200 ${order.status === 'cancelled' && 'text-red-600 bg-red-50'}`}>
                      <td className='p-2 text-center'>{index + 1}</td>
                      <td className='p-2 text-center'>
                        <span>{order.buyer.firstName} {order.buyer.lastName}</span>
                        <span className={`block ${order.status === 'cancelled' ? "text-red-300" : "text-gray-500"}`}>{order.buyer.email}</span>
                      </td>
                      <td className='p-2 text-center hidden xl:block'>{order.totalProducts}</td>
                      <td className='p-2 text-center'>{order.totalProductsQuantity}</td>
                      <td className='p-2 text-center'>₹{order.total}</td>
                      <td className={`p-2 text-center font-bold ${getColor('status',order.status)}`}>{order.status}</td>
                      <td className={`p-2 text-center font-bold ${getColor('paymentMethod',order.paymentMethod)}`}>{order.paymentMethod}</td>
                      <td className={`p-2 text-center font-bold ${getColor('paymentStatus',order.paymentStatus)}`}>{order.paymentStatus}</td>
                      <td className={`p-2 text-center font-bold ${getColor('deliveryStatus',order.deliveryStatus)}`}>{order.deliveryStatus}</td>
                      <td className='p-2 text-center'>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className='py-2 px-4 text-center'>
                        <Link href={`/admin/order/${order._id}`} className='text-blue-600 hover:underline'>
                        View
                        </Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

            {hasmore && <Button
            onClick={() => fatchOrders(page + 1)}
            className='block mx-auto bg-blue-600 hover:bg-blue-500 my-8'
            >
              Load More
            </Button>}


        </div> :
          <div className="flex justify-center items-center h-[calc(100vh-40px)]">
            <div className="loader2"></div>
          </div>
      }
    </>
  )
}
