'use client'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { CheckCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import AddressSection from '@/components/shared/AddressSection'
import { useToast } from '@/components/ui/use-toast'
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
import { Badge } from '@/components/ui/badge'
import { getMyCart } from '@/lib/actions/cart.action';
import { resetCart, setCart } from '@/lib/features/cartSlice';
import CartItemsCard from '@/components/shared/CartItemsCard';
import { placeOrder as placeMyOrder } from '@/lib/actions/order.action'
import ProgressBar from '@/components/shared/ProgressBar'
import axios from 'axios'
import { deliveryCharge, instantDiscount } from '@/constants/index'
import Footer from '@/components/shared/Footer'

export default function CheckoutCartPage() {
    const dispatch = useAppDispatch();
    const isOnlinePaymenAvailable = false;
    const cartItems = useAppSelector(state => state.cart.cart);
    const isFatched = useAppSelector(state => state.cart.isFatched);
    const totalPrice = useAppSelector(state => state.cart.totalPrice);
    const totalDiscountedPrice = useAppSelector(state => state.cart.totalDiscountedPrice);
    const totalQuantity = useAppSelector(state => state.cart.totalQuantity);
    const [addressId, setAddressId] = useState<string>('');
    const [currentStep, setCurrentStep] = useState<'address' | 'summary' | 'payment'>('address');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>(isOnlinePaymenAvailable ? 'online' : 'cod');
    const [placingOrder, setPlacingOrder] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        (async () => {
            if (!isFatched) {
                const res: CartItem[] | null = await await getMyCart();
                if (res && res.length > 0) {
                    dispatch(setCart({ cart: res }));
                } else {
                    router.replace('/my-cart');
                }
            }
        })()
    }, [])

    const placeOrder = async (paymentMethod: 'cod' | 'online', total: number) => {
        if (!addressId) {
            return toast({
                title: 'Something went wrong!',
                description: 'Address not found',
                variant: "destructive"
            })
        }
        if (cartItems.length === 0) {
            return toast({
                title: 'Something went wrong! 😵',
                variant: 'destructive'
            })
        }
        setPlacingOrder(true);
        const products = cartItems.map((cartItem: CartItem) => ({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            formData: cartItem.formData,
            processedImage: cartItem.processedImage,
        }))
        const res: any = await placeMyOrder({
            paymentMethod: paymentMethod,
            total: total,
            products: products,
            deliveryAddress: addressId,
            type: 'cart'
        })
        if (!res) {
            setPlacingOrder(false);
            return toast({
                title: '😵 Action failure!',
                description: "Something went wrong! while placing your order",
                variant: "destructive"
            })
        }
        if (paymentMethod === 'cod') {
            toast({
                title: "Success 🎉",
                description: 'Your order placed successfully!',
                className: 'border-none bg-green-500 text-white'
            })
            dispatch(resetCart());
            router.push(`/my-orders/${res._id}`);
            await axios.post("/api/email/place-order", {
                name: res.buyer.firstName + ' ' + res.buyer.lastName,
                email: res.buyer.email,
                paymentMode: 'Cash on Delivery',
                redirectURL: `https://photoin.in/admin/order/${res._id}`,
                isPaid: false,
                time: new Date(`${res.createdAt}`).toLocaleString()
            });
        } else if (paymentMethod === 'online') {
            //  available payment gateway
        }
    }

    return (
        <>
            <div className='w-full pt-5 pb-10 bg-gray-100'>
                <div className='w-[94%] max-w-[900px] mx-auto'>

                    <ProgressBar steps={['Address', 'Order Summary', 'Payment']}
                        progressValue={currentStep === 'address' ? 0 : currentStep === 'summary' ? 50 : 100}
                        currentStep={currentStep === 'address' ? 0 : currentStep === 'summary' ? 1 : 2}
                        className='h-10 md:h-14 px-2 sm:px-4'
                    />

                    <AddressSection
                        addressId={addressId}
                        setAddressId={setAddressId}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                    />


                    <div className='my-3 bg-white shadow-md rounded-md w-full'>
                        <div className={`w-full h-12 flex rounded-t-md px-2 sm:px-4 flex-nowrap justify-between items-center ${currentStep === 'summary' ? 'bg-blue-600 text-white' : "bg-white"}`}>
                            <div className='flex flex-nowrap justify-start items-center'>
                                <span
                                    className={`h-5 w-5 flex justify-center items-center text-sm rounded-sm text-blue-600 ${currentStep === 'summary' ? "bg-white" : "bg-gray-100"}`}>2</span>
                                <span className={`ml-4 font-bold block text-xs sm:text-sm ${currentStep === 'summary' ? "text-white" : "text-gray-500"}`}>
                                    ORDER SUMMARY
                                </span>
                                {
                                    currentStep === 'payment' && <CheckCheck className='ml-2 h-5 w-5 text-blue-600' />
                                }
                            </div>
                            {
                                currentStep === 'payment' && <Button onClick={() => setCurrentStep('summary')}
                                    variant='outline'
                                    className='text-blue-600 font-bold text-sm mt-4'
                                >
                                    CHANGE
                                </Button>
                            }
                        </div>

                        {
                            currentStep === 'summary' && <>
                                {
                                    isFatched ? <>
                                        {
                                            cartItems.map((cartItem: CartItem) => (
                                                <CartItemsCard key={cartItem._id} cartItem={cartItem} />
                                            ))
                                        }

                                        <div className='w-full shadow-top-md p-4 rounded-b-md flex flex-wrap bg-white justify-between items-center'>
                                            <div className='px-4'>
                                                <p className='mb-2'>Price :<span className=' text-red-600 ml-3 line-through'>&#8377; {totalPrice}</span></p>
                                                <p className='mb-2'>Final Price :<span className=' ml-3 text-green-600'>
                                                    &#8377; {totalDiscountedPrice} Only</span></p>

                                                <p className='text-xs text-green-500 border-t pt-2'>
                                                    You will save &#8377;{totalPrice! - totalDiscountedPrice!} on this order
                                                </p>
                                            </div>
                                            <Button onClick={() => setCurrentStep('payment')}
                                                className='bg-orange-500 hover:bg-orange-600 font-bold h-12 w-48 mt-6 min-[483px]:mt-0'>
                                                CONTINUE
                                            </Button>
                                        </div>
                                    </> :
                                        <div className='w-full h-[55vh] flex justify-center items-center'>
                                            <div className="loader2"></div>
                                        </div>
                                }
                            </>
                        }

                        {currentStep === 'payment' && <p className='text-sm w-full block pl-10 sm:pl-12 pr-2 pb-2 sm:pb-4 font-bold text-black'>
                            {totalQuantity} Items
                        </p>}
                    </div>



                    <div className='my-3 bg-white shadow-md rounded-md w-full'>
                        <div className={`w-full h-12 flex rounded-t-md px-2 sm:px-4 flex-nowrap justify-between items-center ${currentStep === 'payment' ? 'bg-blue-600 text-white' : "bg-white"}`}>
                            <div className='flex flex-nowrap justify-start items-center'>
                                <span
                                    className={`h-5 w-5 flex justify-center items-center text-sm rounded-sm text-blue-600 ${currentStep === 'payment' ? "bg-white" : "bg-gray-100"}`}>3</span>
                                <span className={`ml-4 font-bold block text-xs sm:text-sm ${currentStep === 'payment' ? "text-white" : "text-gray-500"}`}>
                                    PAYMENT OPTIONS
                                </span>
                            </div>
                        </div>

                        {currentStep === 'payment' && <div className='w-full'>
                            {isOnlinePaymenAvailable && <>
                                <div className='flex flex-nowrap text-xs sm:text-sm px-4 sm:px-8 mt-2 mb-4'>
                                    <Sparkles size={18} className=' text-green-600' />
                                    <span className='text-green-600 mx-2'>
                                        Get  &#8377; {instantDiscount} <strong>instant discount </strong> on online payment.
                                    </span>
                                    <Badge className='bg-pink-500 hidden sm:inline h-[22px]'>New</Badge>
                                </div>

                                <div
                                    className={`px-4 sm:px-8 py-3 ${paymentMethod === 'online' ? 'bg-blue-50' : 'bg-white'}`}>
                                    <div className='flex flex-nowrap justify-start pb-3'>
                                        <input type="radio" name="paymentMethod" id="onlinePayment" className='w-4 h-4' readOnly
                                            checked={paymentMethod === 'online'} />
                                        <label htmlFor="onlinePayment"
                                            className='ml-3 text-xs sm:text-sm font-bold w-[calc(100%-20px)] cursor-pointer'
                                            onClick={() => setPaymentMethod('online')}
                                        >
                                            Pay Online <span className='text-gray-600'>(Card, UPI, Net Banking, Wallet)</span>
                                        </label>
                                    </div>

                                    {paymentMethod === 'online' && <>
                                        <div className='w-full max-w-[400px] pl-8'>
                                            <h2 className='text-gray-500 font-bold pt-4 pb-1'>
                                                PRICE DETAILS
                                            </h2> <hr />
                                            <p className="flex flex-nowrap justify-between items-center my-2 text-sm">
                                                <span>Price ({totalQuantity} item{totalQuantity && totalQuantity > 1 ? 's' : ''})</span>
                                                <span>&#8377; {totalPrice}</span>
                                            </p>
                                            <p className="flex flex-nowrap justify-between items-center my-2 text-sm">
                                                <span>Discount </span>
                                                <span className='text-green-600'>- &#8377; {totalPrice! - totalDiscountedPrice!} </span>
                                            </p>
                                            <div className="flex flex-nowrap justify-between items-center my-2 text-sm">
                                                <span>Delivery Charges </span>
                                                <p>
                                                    <span className=' line-through'>
                                                        &#8377; {deliveryCharge}
                                                    </span>
                                                    <span className='text-green-600 ml-2'>
                                                        FREE
                                                    </span>
                                                </p>
                                            </div>
                                            <p className='flex flex-nowrap justify-between items-center my-2 text-sm'>
                                                <span>
                                                    Instant Discount
                                                </span>
                                                <span className='text-green-600'>
                                                    - &#8377; {instantDiscount}
                                                </span>
                                            </p>
                                            <hr />
                                            <p className="flex flex-nowrap justify-between items-center my-2 font-bold">
                                                <span>Total Amount</span>
                                                <span>&#8377; {totalDiscountedPrice! - instantDiscount}</span>
                                            </p>
                                            <hr />
                                            <p className='text-sm text-green-600 my-2'>
                                                You will save &#8377;{(totalPrice! - totalDiscountedPrice!) + instantDiscount} on this order.
                                            </p>
                                        </div>
                                        <div className='w-full flex flex-nowrap justify-between py-3'>
                                            <span></span>
                                            <Button onClick={() => placeOrder('online', totalDiscountedPrice! - instantDiscount)}
                                                className=' w-48 sm:w-56 bg-orange-500 hover:bg-orange-600 font-bold'>
                                                BUY NOW
                                            </Button>
                                        </div>
                                    </>}

                                </div>
                            </>}

                            <div
                                className={`px-4 sm:px-8 py-3 rounded-b-md ${paymentMethod === 'cod' ? 'bg-blue-50' : 'bg-white'}`}>
                                <div className='flex flex-nowrap justify-start py-3'>
                                    <input type="radio" name="paymentMethod" id="onlinePayment" className='w-4 h-4' readOnly
                                        checked={paymentMethod === 'cod'} />
                                    <label htmlFor="onlinePayment"
                                        className='ml-3 text-xs sm:text-sm font-bold w-[calc(100%-20px)] cursor-pointer'
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        Cash on Delivery
                                    </label>
                                </div>
                                {paymentMethod === 'cod' && <>
                                    <div className='w-full max-w-[400px] pl-8'>
                                        <h2 className='text-gray-500 font-bold pt-4 pb-1'>
                                            PRICE DETAILS
                                        </h2> <hr />
                                        <p className="flex flex-nowrap justify-between items-center my-2 text-sm">
                                            <span>Price ({totalQuantity} item{totalQuantity && totalQuantity > 1 ? 's' : ''})</span>
                                            <span>&#8377; {totalPrice}</span>
                                        </p>
                                        <p className="flex flex-nowrap justify-between items-center my-2 text-sm">
                                            <span>Discount </span>
                                            <span className='text-green-600'>- &#8377; {totalPrice! - totalDiscountedPrice!} </span>
                                        </p>
                                        <div className="flex flex-nowrap justify-between items-center my-2 text-sm">
                                            <span>Delivery Charges </span>
                                            <p>
                                                <span className=' line-through'>
                                                    &#8377; {deliveryCharge}
                                                </span>
                                                <span className='text-green-600 ml-2'>
                                                    FREE
                                                </span>
                                            </p>
                                        </div>
                                        <hr />
                                        <p className="flex flex-nowrap justify-between items-center my-2 font-bold">
                                            <span>Total Amount</span>
                                            <span>&#8377; {totalDiscountedPrice}</span>
                                        </p>
                                        <hr />
                                        <p className='text-sm text-green-600 my-2'>
                                            You will save &#8377;{totalPrice! - totalDiscountedPrice!} on this order.
                                        </p>
                                    </div>

                                    <div className='w-full flex flex-nowrap justify-between py-3'>
                                        <span></span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild disabled={placingOrder}>
                                                <Button disabled={placingOrder}
                                                    className='w-48 sm:w-56 bg-orange-500 hover:bg-orange-600 font-bold flex flex-nowrap justify-center items-center'>
                                                    {
                                                        !placingOrder ? "PLACE ORDER" : <>
                                                            <span className='spinner2 w-5 h-5 !border-2'></span> <span className='ml-3'>
                                                                processing...
                                                            </span>
                                                        </>
                                                    }
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Confirm Order
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to place this order? After placing the order,
                                                        We will share you the softcopy for re-confirmation before shipping.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className='bg-orange-500 hover:bg-orange-600'
                                                        onClick={() => placeOrder('cod', totalDiscountedPrice!)}
                                                        disabled={placingOrder}
                                                    >
                                                        Place Order
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </>}

                            </div>
                        </div>}

                    </div>

                </div>
            </div>
            <Footer />
        </>
    )
}
