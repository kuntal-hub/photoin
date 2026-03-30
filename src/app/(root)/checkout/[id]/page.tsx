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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { updateQUantity } from '@/lib/features/checkoutSlice'
import { placeOrder } from '@/lib/actions/order.action'
import ProgressBar from '@/components/shared/ProgressBar'
import { resetCart } from '@/lib/features/cartSlice'
import axios from 'axios'
import { deliveryCharge, instantDiscount } from '@/constants/index'
import Footer from '@/components/shared/Footer'

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const isOnlinePaymenAvailable = false;
  const dispatch = useAppDispatch()
  const router = useRouter()
  const product = useAppSelector(state => state.checkout.product);
  const quantity = useAppSelector(state => state.checkout.quantity);
  const formData = useAppSelector(state => state.checkout.formData);
  const processedImage = useAppSelector(state => state.checkout.processedImage);
  const [addressId, setAddressId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'address' | 'summary' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>(isOnlinePaymenAvailable ? 'online' : 'cod');
  const [placingOrder, setPlacingOrder] = useState(false);

  const placeMyOrder = async (paymentMethod: "cod" | "online", total: number) => {
    if (!addressId) {
      return toast({
        title: 'Something went wrong!',
        description: 'Address not found',
        variant: "destructive"
      })
    }
    if (!product) {
      return toast({
        title: 'Something went wrong!',
        variant: 'destructive'
      })
    }
    setPlacingOrder(true);
    const res: any = await placeOrder({
      paymentMethod: paymentMethod,
      total: total,
      products: [{
        product: product._id,
        quantity: quantity || 1,
        formData: formData,
        processedImage: processedImage,
      }],
      deliveryAddress: addressId,
      type: 'single'
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
      console.log(res);
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

  useEffect(() => {
    if (!product || !quantity || (!formData && !processedImage)) {
      if (params.id && params.id === 'own-design') {
        router.replace('/your-own-design');
      } else if (params.id) {
        router.replace(`/customize/${params.id}`);
      }
    }
  }, [])

  return (
    <> {product && quantity &&
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
            {currentStep === 'summary' && <>
              <div className='flex w-full p-2 sm:p-4'>
                <div className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm overflow-hidden'>
                  {(processedImage || product.mainPhoto) ?
                    <Dialog>
                      <DialogTrigger asChild>
                        <Image src={processedImage ? processedImage : product.mainPhoto}
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
                        <Image src={processedImage ? processedImage : product.mainPhoto}
                          alt='product image' width={450} height={600}
                          className='w-full' />
                      </DialogContent>
                    </Dialog>
                    : <Skeleton className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px]' />
                  }
                </div>
                <div className='flex flex-col ml-4 w-[calc(100%-90px)] sm:w-[calc(100%-120px)]'>
                  <div className='text-sm sm:text-lg font-bold'>{product.name} <Badge className='text-xs h-[22px] bg-green-500 hover:bg-green-600 pb-1'>
                    {product.badge}
                  </Badge></div>
                  <p className='text-xs sm:text-sm mt-2 h-auto text-gray-500'>{product.description}</p>
                  <p className='my-2 p-0'>
                    <span className='text-xs text-red-600 line-through'>&#8377; {product.maxPrice * quantity}</span>
                    <span className=' text-sm ml-5 text-green-600'>
                      &#8377; {product.discountedPrice && product.discountedPrice * quantity} Only</span>
                  </p>
                  <p>
                    <span className='text-xs lg:text-sm text-gray-600'>Delivery in {product.minDeliveryDays}-{product.maxDeliveryDays} days</span>
                  </p>
                  {formData && (Object.keys(formData.data || {}).length > 0 || Object.keys(formData.images || {}).length > 0) && !processedImage && <Dialog>
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
                          formData && formData.data && (Object.keys(formData.data).map((item, i) => (
                            <li className="flex justify-start text-xs min-[375px]:text-sm my-1 items-center" key={i}>
                              <strong>
                                {item.replaceAll('_', ' ')} :
                              </strong>
                              <span className='ml-2'>
                                {`${formData?.data[item]}`}
                              </span>
                            </li>
                          )))
                        }
                      </ul>
                      <ul>
                        {
                          formData && formData.images && (Object.keys(formData.images).map((item, i) => (
                            <li className="flex justify-start text-xs min-[375px]:text-sm my-1 items-center" key={i}>
                              <strong>
                                {item.replaceAll('_', ' ')} :
                              </strong>
                              <Link href={`/customize/${product._id}#${item}`}
                                className='ml-2 hover:underline hover:text-blue-700'>
                                {Array.isArray(formData?.images[item]) ? `${formData?.images[item].length} images` : `1 image`}
                              </Link>
                            </li>
                          )))
                        }
                      </ul>
                      {!processedImage && <DialogFooter>
                        <Link href={`/customize/${product._id}`}>
                          <Button className='bg-blue-500 hover:bg-blue-600'>
                            Edit Details
                          </Button>
                        </Link>
                      </DialogFooter>}
                    </DialogContent>
                  </Dialog>}
                </div>


              </div>

              <div className='flex flex-nowrap justify-between items-center mt-4 px-2 sm:px-4 pb-2 sm:pb-4'>
                <div>
                  <Button onClick={async () => {
                    if (quantity > 1) {
                      dispatch(updateQUantity(quantity - 1))
                    }
                  }} disabled={(quantity === 1)}
                    variant='secondary' className='text-lg border border-gray-300 rounded-full'>
                    -
                  </Button>
                  <span className='px-6 mx-2 border border-gray-400 py-[2px]'>
                    {quantity}
                  </span>
                  <Button onClick={async () => {
                    if (quantity < 10) {
                      dispatch(updateQUantity(quantity + 1))
                    }
                  }} disabled={(quantity === 10)}
                    variant='secondary' className='text-lg border border-gray-300 rounded-full'>
                    +
                  </Button>
                </div>

                <Button onClick={() => setCurrentStep('payment')}
                  className='bg-orange-500 h-12 sm:w-48 font-bold hover:bg-orange-600 text-white'>
                  CONTINUE
                </Button>
              </div>
            </>}
            {currentStep === 'payment' && <p className='text-sm w-full block pl-10 sm:pl-12 pr-2 pb-2 sm:pb-4 font-bold text-black'>
              1 Item
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
                        <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                        <span>&#8377; {product.maxPrice && product.maxPrice * quantity}</span>
                      </p>
                      <p className="flex flex-nowrap justify-between items-center my-2 text-sm">
                        <span>Discount </span>
                        <span className='text-green-600'>- &#8377; {(product.maxPrice - (product.discountedPrice || product.maxPrice)) * quantity} </span>
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
                        <span>&#8377; {((product.discountedPrice ? product.discountedPrice : product.maxPrice) * quantity) - instantDiscount}</span>
                      </p>
                      <hr />
                      <p className='text-sm text-green-600 my-2'>
                        You will save &#8377;{((product.maxPrice - (product.discountedPrice || product.maxPrice)) * quantity) + instantDiscount} on this order.
                      </p>
                    </div>
                    <div className='w-full flex flex-nowrap justify-between py-3'>
                      <span></span>
                      <Button onClick={() => placeMyOrder('online', ((product.discountedPrice ? product.discountedPrice : product.maxPrice) * quantity) - instantDiscount)}
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
                      <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                      <span>&#8377; {product.maxPrice && product.maxPrice * quantity}</span>
                    </p>
                    <p className="flex flex-nowrap justify-between items-center my-2 text-sm">
                      <span>Discount </span>
                      <span className='text-green-600'>- &#8377; {(product.maxPrice - (product.discountedPrice || product.maxPrice)) * quantity} </span>
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
                      <span>&#8377; {(product.discountedPrice ? product.discountedPrice : product.maxPrice) * quantity}</span>
                    </p>
                    <hr />
                    <p className='text-sm text-green-600 my-2'>
                      You will save &#8377;{(product.maxPrice - (product.discountedPrice || product.maxPrice)) * quantity} on this order.
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
                          <AlertDialogAction
                            className='bg-orange-500 hover:bg-orange-600'
                            onClick={() => placeMyOrder('cod', (product.discountedPrice ? product.discountedPrice : product.maxPrice) * quantity)} disabled={placingOrder}
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
      </div>}


      {(!product || !quantity) && <div className='w-full h-[calc(100vh-64px)] flex justify-center items-center'>
        <div className='loader2'>

        </div>
      </div>}
      <Footer />
    </>
  )
}
