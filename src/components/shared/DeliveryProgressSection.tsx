'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import ProgressBar from './ProgressBar'
import { Button } from '../ui/button'
import { chatWithUsUrl } from '@/constants/index'
import { MessageCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '../ui/textarea'
import { useForm } from 'react-hook-form'
import { cancleOrder } from '@/lib/actions/order.action'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function DeliveryProgressSection({
    orderId,
    deliveryStatus,
    createdAt,
    updatedAt,
    status,
    paymentMethod
}: {
    orderId: string,
    deliveryStatus: "ordered" | "shipped" | "outOfDelivery" | "delivered",
    createdAt: string,
    updatedAt: string,
    status: "pending" | "processing" | "completed" | "cancelled",
    paymentMethod: 'cod' | 'online'
}) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [progressValue, setProgressValue] = useState<number>(0);
    const steps = ["ordered", "shipped", "outOfDelivery", "delivered"];
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const { register, handleSubmit,reset } = useForm();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        const res = await cancleOrder(orderId);
        if (res) {
            await axios.post("/api/email/order-cancle", {
                name: res.buyer.firstName + ' ' + res.buyer.lastName,
                paymentMode: 'Cash on Delivery',
                redirectURL: `https://photoin.in/admin/order/${res._id}`,
                time: new Date(`${res.createdAt}`).toLocaleString(),
                reason: data.reason,
              });
            reset();
            setIsOpened(false);
            router.replace('/my-orders');
        }
    }

    useEffect(() => {
        // const maxvalue = 100;
        const maxvalue = deliveryStatus === 'ordered' ? 8 : deliveryStatus === 'shipped' ? 40 : deliveryStatus === 'outOfDelivery' ? 80 : 100;
        let progress = 0;
        const interval = setInterval(() => {
            if (progress >= maxvalue) {
                clearInterval(interval);
                return;
            } else {
                if (progress < 33) {
                    setCurrentStep(0);
                } else if (progress < 66 && progress >= 33) {
                    setCurrentStep(1);
                } else if (progress < 100 && progress >= 66) {
                    setCurrentStep(2);
                } else if (progress >= 100) {
                    setCurrentStep(3);
                }
                progress += 4;
                setProgressValue(progress);
            }
        }, 100);
    }, [])
    return (
        <>
            <div className=' py-5'>
                <div className='sm:hidden block'>
                    <div className='flex flex-nowrap justify-between  px-2 sm:px-4 py-2'>
                        <span></span>
                        <span className={`text-xs font-bold ${(progressValue < 100 ? currentStep : 3) >= 1 ? "text-black" : "text-gray-400"}`}>shipped</span>
                        <span></span>
                        <span className={`text-xs font-bold ${(progressValue < 100 ? currentStep : 3) === 3 ? "text-black" : "text-gray-400"}`}>delivered</span>
                    </div>
                    <div className=''>
                        <ProgressBar steps={["Ordered", "", "Out of delivery", ""]}
                            progressValue={progressValue}
                            currentStep={progressValue < 100 ? currentStep : 3}
                            className='h-10 md:h-14 px-2 sm:px-4'
                        />
                    </div>
                </div>
                <div className='hidden sm:block'>
                    <div className='flex flex-nowrap justify-between  px-2 sm:px-4 py-2'>
                        {
                            ["ordered", "shipped", "outOfDelivery", "delivered"].map((step, index) => (
                                <span key={step} className='text-xs'>
                                    {step === 'ordered' && `${createdAt}`}
                                    {(progressValue < 100 ? currentStep : 3) === index && step !== 'ordered' && `${updatedAt}`}
                                </span>
                            ))
                        }
                    </div>
                    <ProgressBar steps={["Ordered", "Shipped", "Out of delivery", "Delivered"]}
                        progressValue={progressValue}
                        currentStep={progressValue < 100 ? currentStep : 3}
                        className='h-10 md:h-14 px-2 sm:px-4'
                    />
                </div>
            </div>

            <div className='flex flex-nowrap justify-center items-center border border-gray-300'>
                {paymentMethod === 'cod' && status === "pending" && <Dialog open={isOpened}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsOpened(true)}
                            variant='ghost' className='block w-full border-r h-10 text-xs sm:text-sm border-gray-300 rounded-none'>
                            Cancle Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Cancel this order?
                            </DialogTitle>
                            <DialogDescription>
                                Sorry to see you go! Please tell us why you want to cancel this order.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-1 items-center gap-2">
                                    <Label htmlFor="name" className="text-left">
                                        Reason :
                                    </Label>
                                    <Textarea
                                        id="name"
                                        required
                                        {...register('reason', { required: true })}
                                        placeholder='Tell us your reason'
                                        className="col-span-3 bg-gray-50"
                                    />
                                </div>
                            </div>
                            <Button variant='outline' type='submit' className='float-right mt-6' 
                            >Cancle Order
                            </Button>
                            <Button type="button" className='inline float-left mt-6'
                            onClick={() => setIsOpened(false)}>
                                Close
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>}
                <a className='flex flex-nowrap justify-center items-center hover:bg-gray-100 w-full h-10 text-center text-xs sm:text-sm'
                    href={chatWithUsUrl} target='_blank' rel="noopener noreferrer">
                    <MessageCircle size={16} /> <span className='ml-2'>Chat with us</span>
                </a>
            </div>

        </>
    )
}
