'use client';
import React from 'react'
import { Button } from '@/components/ui/button';
import { ArrowBigRightDash } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getHiddenProducts } from '@/lib/actions/product.action';
import { CldUploadWidget } from 'next-cloudinary';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import Offers from '@/components/shared/Offers';
import { addTemp, deleteTemp, updateTempProductId, getTemp } from '@/lib/actions/temp.action';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/lib/actions/cart.action';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { resetCart } from '@/lib/features/cartSlice';
import { setCheckout } from '@/lib/features/checkoutSlice';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import MoreProductDetails from '@/components/shared/MoreProductDetails';
import { Progress } from '@/components/ui/progress';
import ReviewSection from '@/components/shared/ReviewSection';
import Footer from '@/components/shared/Footer';

type HiddenProduct = {
    _id: string;
    name: string;
    description?: string;
    maxPrice: number;
    discountedPrice: number;
    badge: string;
    photo: string;
    minDeliveryDays?: number;
    maxDeliveryDays?: number;
    features: string[];
    rating: number | null;
    reviewCount: number;
    "star1": number;
    "star2": number;
    "star3": number;
    "star4": number;
    "star5": number;
}


export default function YourOwnDesignPage() {
    const [products, setProducts] = useState<HiddenProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<HiddenProduct | null>(null);
    const [mainPhoto, setMainPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const selectedProductRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.auth.userId);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const response: HiddenProduct[] | null = await getHiddenProducts();
            if (response && response.length > 0) {
                setProducts(response);
                setSelectedProduct(response[0]);
                if (selectedProductRef.current) {
                    selectedProductRef.current.value = response[0]._id;
                }
                const temp = await getTemp(response[0]._id);
                if (temp) {
                    setMainPhoto(temp.images.processedImage);
                }
                setLoading(false);
            } else {
                router.replace('/');
            }
        }
        fetchProducts();
    }, [])

    const onUploadErrorHandler = () => {
        toast({
            title: 'Something went wrong while uploading',
            description: 'Please try again',
            duration: 5000,
            variant: "destructive"
        })
    }

    const mainPhotoUploadSuccess = async (result: any) => {
        if (!selectedProductRef.current?.value) {
            return;
        }
        const res = await addTemp({
            productId: selectedProductRef.current.value,
            fieldName: 'processedImage',
            value: result?.info?.secure_url
        })
        if (res) {
            setMainPhoto(result?.info?.secure_url)
        } else {
            toast({
                title: 'Something went wrong while uploading',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    const selectProduct = async (product: HiddenProduct) => {
        if (!mainPhoto) {
            setSelectedProduct(product);
            if (selectedProductRef.current) {
                selectedProductRef.current.value = product._id;
            }
            const temp = await getTemp(product._id);
            if (temp) {
                setMainPhoto(temp.images.processedImage);
            }
        } else {
            if (!selectedProductRef.current?.value) {
                return;
            }
            setLoading(true);
            const res = await updateTempProductId(selectedProductRef.current.value, product._id);
            if (res) {
                setSelectedProduct(product);
                if (selectedProductRef.current) {
                    selectedProductRef.current.value = product._id;
                }
            } else {
                toast({
                    title: 'Something went wrong while updating',
                    description: 'Please try again',
                    duration: 5000,
                    variant: "destructive"
                })
            }
            setLoading(false);
        }
    }

    const deleteMainPhotoHandler = async () => {
        if (!selectedProductRef.current?.value) {
            return;
        }
        setLoading(true);
        const res = await deleteTemp(selectedProductRef.current.value);
        if (res) {
            setMainPhoto('');
        } else {
            toast({
                title: 'Something went wrong while deleting',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
        setLoading(false);
    }


    const addToMyCArt = async () => {
        if (!mainPhoto) {
            return toast({
                title: 'Please upload a photo',
                description: 'Please upload a photo to continue',
                duration: 5000,
                variant: "destructive"
            })
        }
        if (!selectedProductRef.current) {
            return toast({
                title: 'Something went wrong',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
        const res = await addToCart({
            productId: selectedProductRef.current.value,
            processedImage: mainPhoto,
            quantity: quantity
        })
        if (res) {
            dispatch(resetCart());
            router.push('/my-cart');
            toast({
                title: "Added to cart",
                description: "Product added to cart successfully",
                className: "bg-green-500"
            })
        } else {
            toast({
                title: 'Something went wrong',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    const buyNowHandler = () => {
        if (!mainPhoto) {
            return toast({
                title: 'Please upload a photo',
                description: 'Please upload a photo to continue',
                duration: 3000,
                variant: "destructive"
            })
        }
        if (!selectedProduct) {
            return toast({
                title: 'Something went wrong',
                description: 'Please try again',
                duration: 3000,
                variant: "destructive"
            })
        }
        dispatch(setCheckout({
            product: {
                _id: selectedProduct._id,
                name: selectedProduct.name,
                description: selectedProduct?.description,
                maxPrice: selectedProduct.maxPrice,
                discountedPrice: selectedProduct?.discountedPrice,
                mainPhoto: selectedProduct.photo,
                minDeliveryDays: selectedProduct?.minDeliveryDays,
                maxDeliveryDays: selectedProduct?.maxDeliveryDays,
                badge: selectedProduct?.badge
            },
            quantity: quantity,
            processedImage: mainPhoto
        }))
        router.push('/checkout/own-design');
    }

    return (
        <>
            <div className='flex flex-col md:flex-row justify-center'>
                <div
                    className='w-full md:w-[50%] md:h-[calc(100vh-56px)] flex p-2 lg:p-8 lg:pb-0 min-[400px]:p-4 md:sticky md:top-12 lg:top-10  justify-center md:justify-end'>

                    <div className='w-full max-h-[500px] max-w-[400px] relative' >
                        {
                            mainPhoto ? <Image src={mainPhoto} alt='main photo' width={300} height={400}
                                className='object-contain w-full max-h-full block mx-auto my-3 rounded-md' /> :
                                <Skeleton className=' w-[300px] h-[400px] block mx-auto my-3 rounded-md' />
                        }
                        <p className='text-red-600 text-center text-xs font-bold'>
                            Aspect ratio 3:4 or 4:3 is recommended
                        </p>
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_TEMP}
                            onError={onUploadErrorHandler}
                            onSuccess={mainPhotoUploadSuccess}
                            options={{
                                multiple: false,
                                resourceType: "image",
                                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"]
                            }}>
                            {({ open }) => (
                                <Button onClick={() => open()} className='mt-3 bg-blue-600 hover:bg-blue-500 block mx-auto'>
                                    {
                                        mainPhoto ? 'Change Image' : 'Upload Image'
                                    }
                                </Button>
                            )}
                        </CldUploadWidget>
                        {mainPhoto && <Button onClick={deleteMainPhotoHandler}
                            className='mx-auto flex flex-nowrap mt-3 text-red-600' variant='outline'>
                            <Trash2 className='mr-2 h-4 w-4' /> <span>Remove Image</span>
                        </Button>}
                    </div>

                </div>
                <div className='w-full md:w-[50%] md:min-h-[calc(100vh-56px)] p-4 lg:p-8 flex flex-col justify-start'>
                    <div className='w-full max-w-[450px] md:max-w-full mx-auto md:mx-0'>
                        <h2 className='font-bold mt-3'>
                            Select a frame for your photo.
                        </h2>
                        <div className='flex flex-wrap justify-start mb-3'>
                            {
                                products.map((product, index) => {
                                    return <div key={index}
                                        className={`mx-[2px] p-1 my-2 flex flex-col justify-center cursor-pointer rounded-sm ${selectedProduct?._id === product._id ? 'border-2 border-blue-600 bg-blue-200' : ''}`}>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Image src={product.photo} alt={product.name} width={120} height={160}
                                                    className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm object-cover' />
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[450px]">
                                                <DialogHeader>
                                                    <DialogTitle></DialogTitle>
                                                    <DialogDescription>

                                                    </DialogDescription>
                                                </DialogHeader>
                                                <Image src={product.photo} alt={product.name} width={450} height={600}
                                                    className='w-full' />
                                            </DialogContent>
                                        </Dialog>

                                        <Button
                                            variant='outline'
                                            onClick={() => selectProduct(product)}
                                            className={`mt-1 ${selectedProduct?._id === product._id ? '' : 'border-blue-600 border'}`}>
                                            {
                                                product._id === selectedProduct?._id ? 'Selected' : 'Select'
                                            }
                                        </Button>
                                    </div>
                                })
                            }
                        </div>
                        <h1 className='md:text-2xl text-xl xl:text-2xl font-bold'>{selectedProduct?.name}</h1>
                        {selectedProduct?.description && <p className='my-3 text-sm md:text-[16px] text-gray-600'>{selectedProduct?.description}</p>}


                        <p className='my-2 p-0'>
                            <span className='text-[15px] text-red-600 line-through'>&#8377; {selectedProduct?.maxPrice}</span>
                            <span className='text-[18px] ml-5 text-green-600'>
                                &#8377; {selectedProduct?.discountedPrice ? selectedProduct?.discountedPrice : selectedProduct?.maxPrice} Only</span>
                        </p>

                        <div className='flex flex-nowrap justify-start items-center mt-5'>
                            <h2 className='font-bold mr-3'>
                                Quantity :
                            </h2>
                            <Button onClick={() => {
                                if (quantity > 1) {
                                    setQuantity(quantity - 1);
                                }
                            }} disabled={quantity <= 1}
                                variant='secondary' className='text-lg border border-gray-300 rounded-full'>
                                -
                            </Button>
                            <span className='px-6 mx-2 border border-gray-400 py-[2px]'>
                                {quantity}
                            </span>
                            <Button onClick={() => {
                                if (quantity < 10) {
                                    setQuantity(quantity + 1);
                                }
                            }} disabled={quantity >= 10}
                                variant='secondary' className='text-lg border border-gray-300 rounded-full'>
                                +
                            </Button>
                        </div>

                        <Button onClick={buyNowHandler}
                            className='mx-auto w-full block mb-2 mt-10 text-lg h-12 bg-pink-500 hover:bg-pink-600'>
                            Buy Now
                        </Button>

                        <Button onClick={addToMyCArt}
                            variant='outline' className='mx-auto w-full block my-2 text-lg h-12'>
                            Add to Cart
                        </Button>

                        <Offers />

                        <div className='mb-6 mt-8'>
                            <h2 className='font-bold my-2'>
                                Highlights
                            </h2>
                            <ul className='pl-6 mt-3'>
                                {selectedProduct?.features?.map((feature, index) => {
                                    return <li key={index} className='flex flex-nowrap items-center text-sm my-[6px]'>
                                        <ArrowBigRightDash size={18} className=' text-blue-600' />
                                        <span className='text-gray-600 mx-2'>
                                            {feature}
                                        </span>
                                    </li>
                                })}
                            </ul>
                        </div>

                        <MoreProductDetails
                            minDeliveryDays={selectedProduct?.minDeliveryDays ? selectedProduct?.minDeliveryDays : 5}
                            maxDeliveryDays={selectedProduct?.maxDeliveryDays ? selectedProduct?.maxDeliveryDays : 7} />

                    </div>
                </div>
            </div>
            {
                loading && <div className='fixed top-0 left-0 w-screen h-screen grid place-content-center bg-black/75 z-50'>
                    <div>
                        <div className='loader2'>

                        </div>
                        <p className='text-center text-white font-bold my-2'>
                            Loading...
                        </p>
                    </div>
                </div>
            }
            <input type="text" name="selected" readOnly className='hidden' ref={selectedProductRef} />


            {selectedProduct && <div id='reviews' className='w-full p-2 my-6 sm:px-4 md:px-8 border-t'>

                <div className='flex flex-wrap md:flex-nowrap justify-start'>
                    <div
                        className='flex flex-col justify-center items-center p-4 border-b-4 border-gray-200 md:border-b-0 md:border-r-4 w-full md:w-[30%]'>
                        <h3 className='lg:text-xl text-lg font-bold mr-3'>
                            User Rating
                        </h3>
                        <div>
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
                                            className="mx-1 text-[35px] lg:text-[40px]"
                                            style={{
                                                color:
                                                    currentRating <= (selectedProduct.rating || 0) ? "#ffc107" : "#e4e5e9",
                                            }}
                                        >
                                            &#9733;
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        <p>
                            {selectedProduct.rating ? selectedProduct.rating.toFixed(1) : 0} average based on {selectedProduct.reviewCount} reviews.
                        </p>
                    </div>

                    <div className='w-full md:w-[70%] flex flex-col py-4 justify-center items-center'>
                        <div className="retingbardiv">
                            <span>5 ⭐</span>
                            <Progress value={(selectedProduct.star5 / selectedProduct.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-green-500' />
                            <span>
                                {selectedProduct.star5}
                            </span>
                        </div>
                        <div className="retingbardiv">
                            <span>4 ⭐</span>
                            <Progress value={(selectedProduct.star4 / selectedProduct.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-blue-500' />
                            <span>
                                {selectedProduct.star4}
                            </span>
                        </div>
                        <div className="retingbardiv">
                            <span>3 ⭐</span>
                            <Progress value={(selectedProduct.star3 / selectedProduct.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-pink-500' />
                            <span>
                                {selectedProduct.star3}
                            </span>
                        </div>
                        <div className="retingbardiv">
                            <span>2 ⭐</span>
                            <Progress value={(selectedProduct.star2 / selectedProduct.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-orange-500' />
                            <span>
                                {selectedProduct.star2}
                            </span>
                        </div>
                        <div className="retingbardiv">
                            <span>1 ⭐</span>
                            <Progress value={(selectedProduct.star1 / selectedProduct.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-red-500' />
                            <span>
                                {selectedProduct.star1}
                            </span>
                        </div>
                    </div>
                </div>


                <ReviewSection productId={selectedProduct._id} userId={userId} />
            </div>}
            <Footer />
        </>
    )
}
