'use client'
import React from 'react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '../ui/button'
import { updateOrderDeliveryStatus, updateOrderPaymentStatus, updateOrderStatus,deleteOrder } from '@/lib/actions/order.action'
import { useToast } from '../ui/use-toast'
import {
    updateOrderStatus as updateStoreOrderStatus,
    updateOrderPaymentStatus as updateStoreOrderPaymentStatus,
    updateOrderDeliveryStatus as updateStoreOrderDeliveryStatus,
    deleteOrder as deleteOrderFromStore
} from '@/lib/features/adminOrdersSlice'
import { useAppDispatch } from '@/lib/hooks'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'

export default function AdminOtherProductDetails({ order }: { order: ViewedAdminOrder }) {
    const [status, setStatus] = useState(order.status)
    const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
    const [deliveryStatus, setDeliveryStatus] = useState(order.deliveryStatus)
    const [deleting, setDeleting] = useState(false)
    const { toast } = useToast()
    const dispatch = useAppDispatch()
    const router = useRouter()

    const showToast = (data: any, name: "order status" | 'payment status' | 'delivery status') => {
        if (!data) {
            toast({
                title: `Failed to update ${name}`,
                variant: 'destructive'
            })
        } else {
            toast({
                title: `${name} updated successfully`,
                className: 'bg-green-500 text-white border-none',
            })
        }
    }

    return (
        <>
            <div className='grid grid-cols-1 gap-3 w-full p-4 sm:px-8 md:px-12'>
                <h2 className='mt-8 mb-4 font-bold text-xl underline text-green-600'>
                    Other Details:
                </h2>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="status">Order Status :</Label>
                    <div className='flex flex-nowrap justify-between'>
                        <select name="status" id="status"
                            value={status}
                            className='bg-gray-50 border border-gray-400 w-full mr-2 rounded-md px-2 py-1'
                            onChange={(e) => {
                                if (e.target.value === 'pending' || e.target.value === 'processing' || e.target.value === 'completed' || e.target.value === 'cancelled') {
                                    setStatus(e.target.value);
                                }
                            }}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <Button onClick={async () => {
                            const res = await updateOrderStatus(order._id, status)
                            showToast(res, 'order status')
                            if (res) {
                                dispatch(updateStoreOrderStatus({ orderId: order._id, status: status }));
                            }
                        }}
                            className='w-16 bg-green-500 hover:bg-green-600'>
                            save
                        </Button>
                    </div>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="paymentStatus">Payment Status :</Label>
                    <div className='flex flex-nowrap justify-between'>
                        <select name="paymentStatus" id="paymentStatus"
                            value={paymentStatus}
                            className='bg-gray-50 border border-gray-400 w-full mr-2 rounded-md px-2 py-1'
                            onChange={(e) => {
                                if (e.target.value === 'pending' || e.target.value === 'completed' || e.target.value === 'failed') {
                                    setPaymentStatus(e.target.value)
                                }
                            }}
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                        <Button onClick={async () => {
                            const res = await updateOrderPaymentStatus(order._id, paymentStatus)
                            showToast(res, 'payment status');
                            if (res) {
                                dispatch(updateStoreOrderPaymentStatus({ orderId: order._id, paymentStatus: paymentStatus }));
                            }
                        }}
                            className='w-16 bg-green-500 hover:bg-green-600'>
                            save
                        </Button>
                    </div>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="deliveryStatus">Delivery Status :</Label>
                    <div className='flex flex-nowrap justify-between'>
                        <select name="deliveryStatus" id="deliveryStatus"
                            value={deliveryStatus}
                            className='bg-gray-50 border border-gray-400 w-full mr-2 rounded-md px-2 py-1'
                            onChange={(e) => {
                                if (e.target.value === 'ordered' || e.target.value === 'shipped' || e.target.value === 'outOfDelivery' || e.target.value === 'delivered') {
                                    setDeliveryStatus(e.target.value)
                                }
                            }}
                        >
                            <option value="ordered">Ordered</option>
                            <option value="shipped">Shipped</option>
                            <option value="outOfDelivery">Out of delivery</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        <Button onClick={async () => {
                            const res = await updateOrderDeliveryStatus(order._id, deliveryStatus)
                            showToast(res, 'delivery status')
                            if (res) {
                                dispatch(updateStoreOrderDeliveryStatus({ orderId: order._id, deliveryStatus: deliveryStatus }))
                            }
                        }}
                            className='w-16 bg-green-500 hover:bg-green-600'>
                            save
                        </Button>
                    </div>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="paymentMethod">Payment Method :</Label>
                    <div className='flex flex-nowrap justify-between'>
                        <Input type="text" name="paymentMethod" id="paymentMethod"
                            className='bg-gray-50 border border-gray-400 w-full mr-2 rounded-md px-2 py-1'
                            value={order.paymentMethod} readOnly />
                        <Button className='w-16 opacity-0'>
                            save
                        </Button>
                    </div>
                </div>

                <div className='my-10 grid grid-cols-1 gap-3'>
                    <p>
                        <span className='font-bold'>Order Date :</span> {new Date(order.createdAt).toDateString()}
                    </p>
                    <p>
                        <span className='font-bold'>Last Update :</span> {new Date(order.updatedAt).toDateString()}
                    </p>
                </div>
            </div>
            <div className='bg-red-50 w-full p-4 sm:px-8 md:px-12 grid grid-cols-1 gap-6 pb-12'>
                <h2 className='font-bold text-xl underline text-red-600'>
                    Denger Zone
                </h2>
                <div className='flex flex-nowrap items-center justify-between max-w-[1024px]'>
                    <p className='text-red-500'>
                        If your order is delivered and you want to delete this order then click on the button. 
                    </p>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" 
                            className='border border-red-500 text-red-600 ml-5 bg-red-100 hover:bg-red-200'>
                                Delete Order
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete This
                                    order. This will also delete all details and images provided by the customer.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction disabled={deleting}
                                onClick={async () => {
                                    setDeleting(true);
                                    const res:true | null = await deleteOrder(order._id);
                                    if(res){
                                        toast({
                                            title: `Order deleted successfully`,
                                            className: 'bg-green-500 text-white border-none',
                                        })
                                        dispatch(deleteOrderFromStore(order._id))
                                        router.replace('/admin')
                                    } else {
                                        toast({
                                            title: `Failed to delete order`,
                                            variant: 'destructive'
                                        })
                                    }
                                    setDeleting(false);
                                }}
                                className='bg-red-500 hover:bg-red-600 text-white'
                                >
                                    {deleting ? 'Deleting...' : 'Delete Order'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </>
    )
}
