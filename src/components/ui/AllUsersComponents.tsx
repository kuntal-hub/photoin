'use client'
import React from 'react';
import { useToast } from './use-toast'
import { Button } from './button'
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { useState } from 'react';
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
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { download } from '@/lib/helper';
import { Download, Trash2 } from 'lucide-react';
import { deletecartItemByAdmin } from '@/lib/actions/cart.action';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { deleteReviewByAdminId } from '@/lib/actions/review.action';
import { deleteTempItem, deleteTempReview } from '@/lib/actions/temp.action';

export function CopyText({ title, value, coppidValue }: { title: string, value: string, coppidValue?: string }) {
    const { toast } = useToast()
    return (
        <div className='flex flex-nowrap justify-start items-center text-xs my-2'>
            <p className='flex flex-nowrap justify-start items-center mr-3 bg-gray-100 px-2 py-[6px] rounded-lg'>
                <strong className='text-black mr-2'>
                    {title}
                </strong>
                <span className='text-gray-600'>
                    {value}
                </span>
            </p>
            <Button variant='outline' className='text-xs h-7'
                onClick={() => {
                    window.navigator.clipboard.writeText(coppidValue || value)
                    toast({
                        title: "Copied!🎉",
                        description: `${title} copied to clipboard`,
                        duration: 2000,
                        className: "bg-green-500 border-none text-white",
                    })
                }}
            >
                Copy
            </Button>
        </div>
    )
}

type CartItems = {
    _id: string;
    product: {
        _id: string;
        name: string;
        description?: string;
        maxPrice: number;
        discountedPrice?: number;
        mainPhoto: string;
        badge?: string;
    };
    quantity: number;
    processedImage?: string;
    formData?: {
        data: any;
        images: any;
    };
}[];

export function CartSection({ items }: { items: CartItems }) {
    const [disabled, setDisabled] = useState(false)
    const [cartItems, setCartItems] = useState(items);
    const { toast } = useToast()
    const deleteItem = async (id: string) => {
        setDisabled(true)
        const res = await deletecartItemByAdmin(id);
        if (!res) {
            toast({
                title: "Error!🚫",
                description: `Failed to delete item from cart`,
                variant: "destructive",
                duration: 2000,
            })
        } else {
            toast({
                title: "Success!🎉",
                description: `Item removed from cart`,
                className: "bg-green-500 border-none text-white",
                duration: 2000,
            })
            setCartItems(priv => priv.filter(item => item._id !== id))
        }
        setDisabled(false)
    }
    return (
        <div className=' shadow-md flex flex-wrap justify-start p-2 '>
            {
                cartItems.map((cartItem) => (
                    <div className=' w-full' key={cartItem._id}>
                        <div className='flex p-2 sm:p-4 w-full'>
                            <div className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm overflow-hidden'>
                                {(cartItem.processedImage || cartItem.product.mainPhoto) ?
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Image src={cartItem.processedImage ? cartItem.processedImage : cartItem.product.mainPhoto}
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
                                            <Image src={cartItem.processedImage ? cartItem.processedImage : cartItem.product.mainPhoto}
                                                alt='product image' width={450} height={600}
                                                className='w-full' />
                                        </DialogContent>
                                    </Dialog>
                                    : <Skeleton className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px]' />
                                }
                            </div>
                            <div className='flex flex-col ml-4 w-[calc(100%-90px)] sm:w-[calc(100%-120px)]'>
                                <div className='text-sm sm:text-lg font-bold'>{cartItem.product.name} <Badge className='text-xs h-[22px] bg-green-500 hover:bg-green-600 pb-1'>
                                    {cartItem.product.badge}
                                </Badge></div>
                                <p className='text-xs sm:text-sm mt-2 text-gray-500'>{cartItem.product.description}</p>
                                <p className='my-2 p-0'>
                                    <span className='text-xs text-red-600 line-through'>&#8377; {cartItem.product.maxPrice}</span>
                                    <span className=' text-sm ml-5 text-green-600'>
                                        &#8377; {cartItem.product.discountedPrice} Only</span>
                                </p>
                                {
                                    cartItem.processedImage && <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant='link' className='text-blue-600 w-32' >
                                                Printable Image
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[450px]">
                                            <DialogHeader>
                                                <DialogTitle></DialogTitle>
                                                <DialogDescription>

                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className=' relative'>
                                                <Image src={cartItem.processedImage}
                                                    alt='product image' width={450} height={600}
                                                    className='w-full max-h-[70vh]' />
                                                <button
                                                    onClick={() => download(cartItem.processedImage!, new Date().toISOString())}
                                                    className=' absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-sm'
                                                >
                                                    <Download />
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                }

                                {
                                    cartItem.formData?.data && <>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant='link' className='text-blue-600 w-32' >
                                                    Provided Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Customer Provided Details
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Those are the details provided by the customer and required to prepare the printable image.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <ul>
                                                    {
                                                        cartItem.formData && cartItem.formData.data && (Object.keys(cartItem.formData.data).map((item, i) => (
                                                            <li className="flex justify-start text-xs min-[375px]:text-sm my-1 items-center" key={i}>
                                                                <strong>
                                                                    {item.replaceAll('_', ' ')} :
                                                                </strong>
                                                                <span className='ml-2'>
                                                                    {`${cartItem.formData?.data[item]}`}
                                                                </span>
                                                            </li>
                                                        )))
                                                    }
                                                </ul>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                }

                                {
                                    cartItem.formData?.images && <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant='link' className='text-blue-600 w-32' >
                                                Provided Images
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Customer Provided Images
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Those are the images provided by the customer and required to prepare the printable image.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {
                                                cartItem.formData && cartItem.formData.images && (Object.keys(cartItem.formData.images).map((item, i) => (
                                                    <div key={i}>
                                                        <h2 className='font-bold my-2'>
                                                            {item.replaceAll('_', ' ')} :
                                                        </h2>
                                                        <div className='flex flex-wrap justify-start'>
                                                            {Array.isArray(cartItem.formData?.images[item]) ? <>
                                                                {
                                                                    cartItem.formData?.images[item].map((img, i) => (
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
                                                                    <Image src={cartItem.formData?.images[item]}
                                                                        alt='provided image' width={120} height={160}
                                                                        className='max-w-[120px] max-h-[160px] object-cover' />

                                                                    <button onClick={() => download(cartItem.formData?.images[item], new Date().toISOString())}
                                                                        className=' absolute top-0 left-0 bg-green-600 hover:bg-green-500 text-white p-1'>
                                                                        <Download size={18} />
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )))
                                            }
                                        </DialogContent>
                                    </Dialog>
                                }
                            </div>


                        </div>
                        <div className='flex flex-nowrap justify-start items-center px-2 sm:px-4 '>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className='flex flex-nowrap justify-start items-center text-red-600 mb-5'>
                                        <Trash2 size={16} /> <span className='text-xs font-bold ml-2 px-3'>
                                            Delete Item
                                        </span>
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this
                                            item from cart. Delete the item in your own risk.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteItem(cartItem._id)} className='text-white bg-red-500 hover:bg-red-600'>
                                            Delete Item
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        {disabled &&
                            <div className='w-screen h-screen fixed top-0 left-0 bg-black/60 z-50 flex items-center justify-center'>
                                <div>
                                    <div className='loader2'></div>
                                    <p className='py-4 text-lg text-white'>
                                        Removing Item...
                                    </p>
                                </div>
                            </div>}
                    </div>
                ))
            }
        </div>
    )
}


export function ReviewGalary({ r, userId }: { r: Review[], userId: string }) {
    const [reviews, setReviews] = useState(r);
    const { toast } = useToast()

    async function deleteReviewHandler(id: string) {
        const res = await deleteReviewByAdminId(id, userId);
        if (res === true) {
            toast({
                title: "Review Deleted",
                description: "Review deleted successfully",
                className: "bg-green-500 text-white",
                duration: 2000
            })
            setReviews(prev => prev.filter(review => review._id !== id))
        } else {
            toast({
                title: "unauthorized",
                description: "You are not authorized to delete this review",
                variant: "destructive",
                duration: 2000
            })
        }
    }

    return (
        <div className='w-full flex flex-wrap justify-center'>
            {
                reviews.map((review, index) => <ReviewCard key={index} review={review} deleteReviewHandler={deleteReviewHandler} />)
            }
        </div>
    )
}


function ReviewCard({ review, deleteReviewHandler }: { review: Review, deleteReviewHandler: (id: string) => void }) {
    const [seeAll, setSeeAll] = useState(false);
    const comment = seeAll ? review.comment : review.comment.slice(0, 50);

    return (
        <div
            className="bg-white w-full max-w-80 rounded-lg shadow-md hover:shadow-lg h-auto my-4 mx-1 min-[550px]:mx-2 sm:mx-3 sm:my-6 min-[800px]:mx-1 min-[800px]:my-4 lg:mx-2 xl:mx-3 xl:my-6">
            <div className='flex flex-col'>
                <div className='w-full'>
                    {
                        review.image && <img src={review.image.replace('upload/', 'upload/q_30/')} alt="review"
                            className="w-full rounded-t-lg bg-gray-200 min-h-[150px]" />
                    }
                </div>
                <div className={`p-2 border-b flex flex-nowrap justify-between`}>
                    <div className="flex flex-nowrap items-center">
                        <img src={review.user.photo} alt="user image" className='w-11 h-11 rounded-full' />
                        <div className="ml-2">
                            <h3 className="font-semibold text-sm leading-4 mt-2 h-4">{
                                review.user.firstName + " " + review.user.lastName
                            }</h3>
                            <span className='text-gray-500 text-[12px]'>
                                {new Date(review.createdAt).toDateString()}{" "}
                            </span>
                        </div>
                    </div>

                </div>

                <div className="px-4">
                    <div className='flex flex-nowrap justify-between'>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star, index) => (
                                <span
                                    key={index}
                                    className={`text-xl ${index < review.rating ? "text-yellow-500" : "text-gray-300"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className='text-red-600 p-2 '>
                                    <Trash2 size={20} />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your review.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteReviewHandler(review._id)}
                                        className='bg-red-600 hover:bg-red-500 text-white'
                                    >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <p className="mt-2 mb-4 text-sm text-gray-600">{comment}{
                        review.comment.length > 50 && <button onClick={() => setSeeAll(!seeAll)}
                            className='text-blue-600 text-sm hover:underline'>
                            {seeAll ? "See Less" : "...See More"}
                        </button>
                    }</p>
                </div>
            </div>
        </div>
    )
}


export function TempCartSection({ c }: { c: TempItems[] }) {
    const [carts, setCarts] = useState<TempItems[]>(c);
    const { toast } = useToast();

    const deleteSingleItem = async (cartId: string) => {
        const res = await deleteTempItem(cartId);
        if (res) {
            setCarts(prev => prev.filter(cart => cart._id !== cartId))
            toast({
                title: "Success🎉",
                description: "Item deleted successfully",
                className: "bg-green-500 text-white border-none"
            })
        } else {
            toast({
                title: "Error ",
                description: "Failed to delete cart",
                variant: "destructive"
            })
        }
    }
    return (
        <div>
            {
                carts.map((cart, index) => (
                    <div key={cart._id}
                        className='flex flex-nowrap justify-between bg-white rounded-sm shadow-lg my-3'>
                        <div className='flex p-2 sm:p-4'>
                            <div className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm overflow-hidden'>
                                {cart.product.mainPhoto ?
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Image src={cart.product.mainPhoto}
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
                                            <div className=' relative'>
                                                <Image src={cart.product.mainPhoto}
                                                    alt='product image' width={450} height={600}
                                                    className='w-full' />
                                                <button
                                                    onClick={() => download(cart.product.mainPhoto, new Date().toISOString())}
                                                    className=' absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-sm'
                                                >
                                                    <Download />
                                                </button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    : <Skeleton className='w-full h-full' />
                                }
                            </div>
                            <div className='flex flex-col ml-4'>
                                <p className='text-sm sm:text-lg font-bold'>{cart.product.name} </p>
                                <p className='p-0'>
                                    <span className='text-xs text-red-600 line-through'>&#8377; {cart.product.maxPrice}</span>
                                    <span className=' text-sm ml-5 text-green-600'>
                                        &#8377; {cart.product.discountedPrice} Only</span>
                                </p> <hr />
                                <p className='text-xs '>
                                    <strong className='mr-2'>
                                        Name :
                                    </strong>
                                    {cart.buyer.firstName} {cart.buyer.lastName}
                                </p>
                                <p className='text-xs'>
                                    <strong className='mr-2'>
                                        Email :
                                    </strong>
                                    {cart.buyer.email}
                                </p> <hr />

                                {
                                    cart.images && <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant='link' className='text-blue-600' >
                                                Uploaded Images
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Uploaded Images
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Those are the images uploaded by the customer but not added to the cart or not placed.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {
                                                cart.images && (Object.keys(cart.images).map((item, i) => (
                                                    <div key={i}>
                                                        <h2 className='font-bold my-2'>
                                                            {item.replaceAll('_', ' ')} :
                                                        </h2>
                                                        <div className='flex flex-wrap justify-start'>
                                                            {Array.isArray(cart.images[item]) ? <>
                                                                {
                                                                    cart.images[item].map((img, i) => (
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
                                                                    <Image src={cart.images[item]}
                                                                        alt='provided image' width={120} height={160}
                                                                        className='max-w-[120px] max-h-[160px] object-cover' />

                                                                    <button onClick={() => download(cart.images[item], new Date().toISOString())}
                                                                        className=' absolute top-0 left-0 bg-green-600 hover:bg-green-500 text-white p-1'>
                                                                        <Download size={18} />
                                                                    </button>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )))
                                            }
                                        </DialogContent>
                                    </Dialog>
                                }
                            </div>

                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className='mr-2 mt-2 sm:mt-4 sm:mr-4 bg-red-600 hover:bg-red-500'>
                                    <Trash2 />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this item
                                        and remove your data from servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteSingleItem(cart._id)}
                                        className='bg-red-600 hover:bg-red-500'
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                ))
            }
        </div>
    )
}


export function TempReviewSection({ r }: { r: TempReview[] }) {
    const [reviews, setReviews] = useState(r);
    const { toast } = useToast();

    return (
        <div className='w-full flex flex-wrap justify-start p-4 sm:p-8'>
            {
                reviews.map((review) => (
                    <div className=' relative max-w-40 md:max-w-48 m-2' key={review._id}>
                        <img src={review.image} alt="review image" className='w-full block' />
                        <div className='flex flex-nowrap justify-start items-center py-2 w-full overflow-hidden'>
                            <img src={review.buyer.photo} alt="avatar" className='w-10 h-10 rounded-full' />
                            <div className='ml-2'>
                                <p className='text-sm font-bold'>{review.buyer.firstName} {review.buyer.lastName}</p>
                                <p className='text-xs'>{review.buyer.email}</p>
                            </div>
                        </div>
                        <button onClick={() => {
                            const confirm = window.confirm('Are you sure to delete this review?');
                            if (confirm) {
                                deleteTempReview(review._id, review.image).then(res => {
                                    if (res) {
                                        setReviews(prev => prev.filter(rev => rev._id !== review._id));
                                        toast({
                                            title: "Success",
                                            description: "Review deleted successfully",
                                            className: "bg-green-500 text-white border-none"
                                        })
                                    } else {
                                        toast({
                                            title: "Error",
                                            description: "Failed to delete review",
                                            variant: "destructive"
                                        })
                                    }
                                })
                            }
                        }}
                            className='bg-red-600 p-2 text-white hover:bg-red-500 rounded-full absolute right-1 top-1'>
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))
            }
        </div>
    )
}