'use client';
import React from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { download, getPublicId } from '@/lib/helper';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Trash2 } from 'lucide-react';
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
import { deleteALLTempCarts, deleteTempItem, getTempItems, getTempReviews, deleteTempReview } from '@/lib/actions/temp.action';

export default function TempCartPage({ searchParams }: { searchParams: { days?: string, type?: string } }) {
    const [tempCarts, setTempCarts] = useState<TempItems[]>([]);
    const [tempReviews, setTempReviews] = useState<TempReview[]>([]);
    const { register, handleSubmit } = useForm();
    const tempType = searchParams.type ? searchParams.type : 'product';
    const router = useRouter();
    // const [days, setDays] = useState(30);
    const days = searchParams.days ? Number.parseInt(searchParams.days) : 30;
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const { toast } = useToast();
    const limit = 25;

    const setDays = (days: number) => {
        router.push(`/admin/temp-carts?days=${days}&type=${tempType}`);
    };

    const fatchTempreviews = async (page: number) => {
        const response: TempReview[] | null = await getTempReviews(days, page, limit);
        if (response) {
            if (page === 1) {
                setTempReviews(response);
            } else {
                setTempReviews(priv => [...priv, ...response]);
            }
            setPage(page);
            setHasMore(response.length === limit);
        } else {
            toast({
                title: "Error",
                description: "Failed to fetch Temp Reviews",
                variant: "destructive"
            })
        }
        setLoading(false);
    };

    const fatchCarts = async (page: number) => {
        //setLoading(true);
        const response: TempItems[] | null = await getTempItems(days, page, limit);
        if (response) {
            if (page === 1) {
                setTempCarts(response);
            } else {
                setTempCarts(priv => [...priv, ...response]);
            }
            setPage(page);
            setHasMore(response.length === limit);
        } else {
            toast({
                title: "Error",
                description: "Failed to fetch unplaced carts",
                variant: "destructive"
            })
        }
        setLoading(false);
    }

    const deleteSingleItem = async (id: string) => {
        const res = await deleteTempItem(id);
        if (res) {
            setTempCarts(prev => prev.filter(cart => cart._id !== id));
            toast({
                title: "Success",
                description: "Cart deleted successfully",
                className: "bg-green-500"
            })
        } else {
            toast({
                title: "Error",
                description: "Failed to delete cart",
                variant: "destructive"
            })
        }
    }

    const deleteAll = async () => {
        const publicIds: string[] = [];
        const cartIds: string[] = [];
        tempCarts.map((cart, i) => {
            cartIds.push(cart._id);
            if (cart.images) {
                for (const i in cart.images) {
                    if (Array.isArray(cart.images[i])) {
                        cart.images[i].forEach((img: string) => {
                            publicIds.push(getPublicId({ url: img }));
                        });
                    } else {
                        publicIds.push(getPublicId({ url: cart.images[i] }));
                    }
                }
            }
        });
        setLoading(true);
        const res = await deleteALLTempCarts(cartIds, publicIds);
        if (res) {
            setTempCarts([]);
            setPage(1);
            toast({
                title: "Success",
                description: "All unplaced carts deleted successfully",
                className: "bg-green-500"
            })
        } else {
            toast({
                title: "Error",
                description: "Failed to delete unplaced carts",
                variant: "destructive"
            })
        }
        setLoading(false);
    }


    const onSubmit = async (data: any) => {
        if ((Number.parseInt(data.days) !== days) && (Number.parseInt(data.days) >= 0)) {
            setDays(Number.parseInt(data.days));
        }
    };

    useEffect(() => {
        if (tempType === 'product') {
            setLoading(true);
            fatchCarts(1);
        } else if (tempType === 'review') {
            setLoading(true);
            fatchTempreviews(1);
        }
    }, [days, tempType]);


    return (
        <div className=' bg-gray-100 min-h-screen'>
            <div className='flex justify-between flex-wrap items-center p-4 md:px-8'>
                <div className='w-full sm:w-[48%]'>
                    <h1 className="text-xl font-bold">
                        Temporary Uploads
                    </h1>
                    <p className="text-gray-500 text-sm">
                        These
                    </p>
                </div>
                <div className='mt-4 sm:mt-0 '>
                    <Label className='tempType'>
                        Show
                    </Label>
                    <select name="type" id="tempType" value={tempType}
                        className='bg-white border block w-44 px-3 py-2 border-gray-300 rounded-sm p-1'
                        onChange={(e) => router.push(`/admin/temp-carts?days=${days}&type=${e.target.value}`)} >
                        <option value="product">Products</option>
                        <option value="review">Reviews</option>
                    </select>
                </div>
                <form className='mt-4 sm:mt-0 min-w-80' onSubmit={handleSubmit(onSubmit)}>
                    <Label htmlFor='days'>
                        Show carts created at least
                    </Label>
                    <div className='flex flex-nowrap justify-start'>
                        <Input type="number" required placeholder="Days" id='days' min={0} max={365}
                            defaultValue={days}
                            {...register('days', { required: true, valueAsNumber: true })}
                        />

                        <Button type='submit' className='bg-green-600 hover:bg-green-500 ml-1'>
                            Filter
                        </Button>
                    </div>
                </form>
            </div>

            {
                loading ? <div className='fixed top-0 left-0 w-screen h-screen grid place-content-center bg-black/70 z-50'>
                    <div>
                        <div className='loader2'>

                        </div>
                        <p className='text-center text-white font-bold my-2'>
                            Loading...
                        </p>
                    </div>
                </div> : <>
                    {tempType !== 'review' && <div>
                        {
                            tempCarts.length > 0 ?
                                <div className='w-[94%] max-w-[900px] mx-auto'>
                                    {
                                        tempCarts.map((cart) => (
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

                                    {hasMore && <Button onClick={() => fatchCarts(page + 1)}
                                        className='block mx-auto my-10'
                                    >
                                        See more
                                    </Button>}

                                    <div className='w-full sticky bottom-0 shadow-top-md p-4 flex flex-wrap bg-white z-20 justify-between items-center'>
                                        <p className='font-bold '>
                                            Delete {tempCarts.length} Items
                                        </p>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className='bg-red-500 hover:bg-red-600 font-bold h-12 w-48 mt-6 min-[483px]:mt-0'>
                                                    Delete All
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete all items
                                                        and remove your data from servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={deleteAll}
                                                        className='bg-red-600 hover:bg-red-500'
                                                    >
                                                        Delete ALl
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>
                                </div> :
                                <div className='flex justify-center items-center h-64'>
                                    <p className='text-xl text-gray-500'>
                                        No unplaced carts 🫡
                                    </p>
                                </div>
                        }
                    </div>}
                    {
                        tempType === 'review' && <div>
                            {
                                tempReviews.length > 0 ? <><div className='w-full flex flex-wrap justify-start p-4 sm:p-8'>
                                    {
                                        tempReviews.map((review) => (
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
                                                                setTempReviews(prev => prev.filter(rev => rev._id !== review._id));
                                                                toast({
                                                                    title: "Success",
                                                                    description: "Review deleted successfully",
                                                                    className: "bg-green-500"
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
                                    {hasMore && <Button onClick={() => fatchTempreviews(page + 1)}
                                        className='block mx-auto my-6'
                                    >
                                        See more
                                    </Button>}
                                    <div className='w-full max-w-[800px] rounded-md mx-auto sticky bottom-0 shadow-top-md p-4 flex flex-wrap bg-white z-20 justify-between items-center'>
                                        <p className='font-bold '>
                                            Delete {tempReviews.length} Items
                                        </p>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className='bg-red-500 hover:bg-red-600 font-bold h-12 w-48 mt-6 min-[483px]:mt-0'>
                                                    Delete All
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete all items
                                                        and remove your data from servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={async () => {
                                                        const imagesPublicIds = [];
                                                        for (const review of tempReviews) {
                                                            imagesPublicIds.push(getPublicId({ url: review.image }));
                                                        }
                                                        const ids = tempReviews.map(rev => rev._id);
                                                        setLoading(true);
                                                        const res = await deleteALLTempCarts(ids, imagesPublicIds);
                                                        if (res) {
                                                            setTempReviews([]);
                                                            setPage(1);
                                                            toast({
                                                                title: "Success",
                                                                description: "All unplaced carts deleted successfully",
                                                                className: "bg-green-500"
                                                            })
                                                        } else {
                                                            toast({
                                                                title: "Error",
                                                                description: "Failed to delete unplaced carts",
                                                                variant: "destructive"
                                                            })
                                                        }
                                                        setLoading(false);
                                                    }}
                                                        className='bg-red-600 hover:bg-red-500'
                                                    >
                                                        Delete ALl
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>
                                </> : <div className='flex justify-center items-center h-64'>
                                    <p className='text-xl text-gray-500'>
                                        No Reviews is available 🫡
                                    </p>
                                </div>
                            }
                        </div>
                    }
                </>
            }
        </div>
    )
}
