'use client'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { download, downloadImages } from '@/lib/helper';
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
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react';

type AdminOrderProductCardProps = {
    product: {
        _id: string;
        description?: string;
        name: string;
        mainPhoto: string;
        photos: string[];
        maxPrice: number;
        discountedPrice?: number;
    };
    quantity: number;
    formData?: {
        data: any;
        images: any;
    };
    processedImage?: string;
}

export default function AdminOrderProductCard({ product }: { product: AdminOrderProductCardProps }) {

    const handaleDownloadAllImages = () => {
        if (product.formData && product.formData.images) {
            const urls = Object.keys(product.formData.images).map((key) => {
                const images = product.formData!.images[key];
                return Array.isArray(images) ? images : [images];
            }).flat();
            downloadImages(urls);
        }
    }
    
    return (
        <div className='flex p-2 sm:p-4 w-full'>
            <div className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm overflow-hidden'>
                {(product.product.mainPhoto || product.product.photos[0]) ?
                    <Dialog>
                        <DialogTrigger asChild>
                            <img src={product.product.mainPhoto || product.product.photos[0]}
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
                            <Image src={product.product.mainPhoto || product.product.photos[0]}
                                alt='product image' width={450} height={600}
                                className='w-full' />
                        </DialogContent>
                    </Dialog>
                    : <Skeleton
                        className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px]' />
                }
            </div>
            <div className='flex flex-col ml-4 w-[calc(100%-90px)] sm:w-[calc(100%-120px)]'>
                <p className='text-sm sm:text-lg font-bold'>{product.product.name}</p>
                <p className='text-xs sm:text-sm mt-2 text-gray-500'>{product.product.description}</p>
                <p className='my-2 p-0'>
                    <span className='text-xs text-red-600 line-through'>&#8377; {product.product.maxPrice}</span>
                    <span className=' text-sm ml-5 text-green-600'>
                        &#8377; {product.product.discountedPrice || product.product.maxPrice} Only</span>
                </p>
                <p className='text-sm'>
                    <strong className='mr-2'>Product Quantity:</strong> {product.quantity} Units
                </p>

                {product.processedImage && <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='link' className='text-blue-600 w-32 items-start mt-2' >
                            Printable Image
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[450px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Printable Image
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className=' relative'>
                            <Image src={product.processedImage}
                                alt='product image' width={450} height={600}
                                className='w-full max-h-[70vh]' />
                            <button
                                onClick={() => download(product.processedImage!, new Date().toISOString())}
                                className=' absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-sm'
                            >
                                <Download />
                            </button>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}


                {product.formData && product.formData.data && <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='link' className='text-blue-600 w-32 items-start mt-2' >
                            Provided Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Customer Provided Details</AlertDialogTitle>
                            <AlertDialogDescription>
                                Those are the details provided by the customer and required to prepare the printable image.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <ul>
                            {
                                (Object.keys(product.formData.data).map((item, i) => (
                                    <li className="flex justify-start text-xs min-[375px]:text-sm my-1 items-center" key={i}>
                                        <strong>
                                            {item.replaceAll('_', ' ')} :
                                        </strong>
                                        <span className='ml-2'>
                                            {`${product.formData?.data[item]}`}
                                        </span>
                                    </li>
                                )))
                            }
                        </ul>
                        <AlertDialogFooter>
                            <AlertDialogAction>OK</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}


                {product.formData && product.formData.images && <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='link' className='text-blue-600 w-32 items-start' >
                            Provided Images
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Customer Provided Images</AlertDialogTitle>
                            <AlertDialogDescription>
                                Those are the images provided by the customer and required to prepare the printable image.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {
                            product.formData && product.formData.images && (Object.keys(product.formData.images).map((item, i) => (
                                <div key={i}>
                                    <h2 className='font-bold my-2'>
                                        {item.replaceAll('_', ' ')} :
                                    </h2>
                                    <div className='flex flex-wrap justify-start'>
                                        {Array.isArray(product.formData?.images[item]) ? <>
                                            {
                                                product.formData?.images[item].map((img, i) => (
                                                    <div className='m-1 relative' key={i}>
                                                        <Image src={img}
                                                            alt='provided image' width={120} height={160}
                                                            className='object-cover max-w-[120px] max-h-[160px]' />

                                                        <button onClick={() => download(img, new Date().toISOString())}
                                                            className=' absolute top-0 left-0 bg-green-600 hover:bg-green-500 text-white p-1'>
                                                            <Download size={18} />
                                                        </button>
                                                    </div>
                                                ))
                                            }
                                        </> :
                                            <div className='m-1 relative'>
                                                <Image src={product.formData?.images[item]}
                                                    alt='provided image' width={120} height={160}
                                                    className='max-w-[120px] max-h-[160px] object-cover' />

                                                <button onClick={() => download(product.formData?.images[item], new Date().toISOString())}
                                                    className=' absolute top-0 left-0 bg-green-600 hover:bg-green-500 text-white p-1'>
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )))
                        }
                        <AlertDialogFooter className='w-full flex !justify-between flex-nowrap'>
                            <Button onClick={handaleDownloadAllImages}
                            className='bg-green-500 hover:bg-green-600'>
                                Download All
                            </Button>
                            <AlertDialogAction className='bg-blue-600 hover:bg-blue-500'>OK</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}
            </div>
        </div>
    )
}
