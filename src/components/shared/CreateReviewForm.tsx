'use client';
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch } from "@/lib/hooks"
import { createReview, changeReviewImage, updateReview } from "@/lib/actions/review.action"
import { CldUploadWidget } from 'next-cloudinary';
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Skeleton } from '../ui/skeleton';
import { Trash2 } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from '../ui/label';
import { getRandomName } from '@/lib/helper';
import { addReview, setIsReviewedByMe, addReviewToAllReviews } from '@/lib/features/reviewSlice';
import { addTemp, getTemp, deleteTemp } from '@/lib/actions/temp.action';

const schema = z.object({
    comment: z.string().max(1000),
    fakeName: z.string().optional()
})

type Schema = z.infer<typeof schema>

type Review = {
    _id: string;
    rating: number;
    comment: string;
    product: string;
    image?: string;
}

export default function CreateReviewForm({ 
    productId, 
    addFakeName, 
    setShowCreateReviewForm, 
    userId, 
    review,
    setProductReview }:{ 
        productId: string, 
        addFakeName: boolean, 
        setShowCreateReviewForm: React.Dispatch<React.SetStateAction<boolean>>, 
        userId: string, 
        review?: Review | null,
        setProductReview?:React.Dispatch<React.SetStateAction<Review | null>> }) {
    const [rating, setRating] = useState<number | null>(review?.rating || null);
    const [hover, setHover] = useState<number | null>(null);
    const [photo, setPhoto] = useState<string | null>(review?.image || null);
    const { toast } = useToast();
    const dispatch = useAppDispatch()
    const { register, handleSubmit, watch } = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            fakeName: addFakeName ? getRandomName() : "",
            comment: review?.comment || "",
        }
    })
    const comment = watch('comment');

    const onUploadErrorHandler = () => {
        toast({
            title: 'Something went wrong while uploading',
            description: 'Please try again',
            duration: 5000,
            variant: "destructive"
        })
    }

    const removePhoto = async (photo: string) => {
        if (review) {
            await changeReviewImage(review._id);
            if (setProductReview) {
                setProductReview((priv) => ({
                    ...priv!,
                    image: ""
                }));
            }
        } else {
            await deleteTemp(productId, 'review');
        }
        setPhoto(null);
    }

    const mainPhotoUploadSuccess = async (result: any) => {
        if (review) {
            await changeReviewImage(review._id, result?.info?.secure_url);
            if (setProductReview) {
                setProductReview((priv) => ({
                    ...priv!,
                    image: result?.info?.secure_url
                }));
            }
        } else {
            await addTemp({
                productId: productId,
                fieldName: 'reviewImage',
                value: result?.info?.secure_url,
                type: 'review'
            });
        }
        setPhoto(result?.info?.secure_url);
    }

    const onSubmit = async (data: Schema) => {
        if (rating === null || rating === undefined || rating === 0) {
            return toast({
                title: 'Rating is required',
                description: 'Please select a rating',
                variant: 'destructive'
            })
        }
        if (review) {
            const res = await updateReview(review._id, rating, data.comment, photo);
            if (res) {
                toast({
                    title: 'Your review updated successfully',
                    className: 'bg-green-500 text-white border-none',
                })
                if (setProductReview) {
                    setProductReview({
                        _id: review._id,
                        rating: rating,
                        comment: data.comment,
                        product: productId,
                        image: photo ? photo : ""
                    })
                }
                setShowCreateReviewForm(false);
            } else {
                toast({
                    title: 'Something went wrong while updating review',
                    variant: 'destructive'
                })
            }
        } else {
            const res = await createReview({
                rating: rating,
                comment: data.comment,
                fakeName: data.fakeName,
                clerkId: userId,
                image: photo ? photo : "",
                product: productId,
            });
            if (res) {
                if (!addFakeName) {
                    dispatch(addReview({ productId: productId, review: res }));
                    dispatch(setIsReviewedByMe({ productId: productId, isReviewedByMe: true }));
                } else {
                    dispatch(addReviewToAllReviews(res));
                }
                toast({
                    title: 'Review posted successfully',
                    description: 'Your review has been posted successfully',
                    className: 'bg-green-500 text-white',
                })
                if (setProductReview) {
                    setProductReview({
                        _id: res._id,
                        rating: rating,
                        comment: data.comment,
                        product: productId,
                        image: photo ? photo : ""
                    })
                }
                setShowCreateReviewForm(false);
            } else {
                toast({
                    title: 'Something went wrong',
                    description: 'Please try again',
                    variant: 'destructive'
                })
            }
        }
    }

    const onCancle = async () => {
        if (photo && !review) {
            await deleteTemp(productId, 'review');
        }
        setShowCreateReviewForm(false);
    }

    useEffect(() => {
        if (!review) {
            (async () => {
                const temp = await getTemp(productId, 'review');
                if (temp) {
                    setPhoto(temp.images.reviewImage);
                }
            })();
        }
    }, [])

    return (
        <div className='fixed top-0 left-0 w-screen h-screen z-50 bg-black/70 grid place-content-center'>
            <div className='bg-white rounded-lg w-full md:w-[500px] max-w-[500px] p-4 md:p-8'>
                <h2 className='font-bold text-xl w-full text-start'>
                    Write a Review
                </h2>
                <p className={`text-center mt-6 mb-2 ${rating !== null && "text-6xl"}`}>
                    {
                        rating === 1 ? '🥺' : rating === 2 ? '😥' : rating === 3 ? '🙂' : rating === 4 ? '😀' : rating === 5 ? '😍' : 'Select a rating'
                    }
                </p>
                <div className='flex flex-nowrap justify-center'>
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
                                    onChange={() => setRating(currentRating)}
                                />
                                <span
                                    className="mx-1 text-[35px] lg:text-[40px] cursor-pointer"
                                    style={{
                                        color:
                                            currentRating <= (hover || rating)! ? "#ffc107" : "#e4e5e9",
                                    }}
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(null)}
                                >
                                    &#9733;
                                </span>
                            </label>
                        );
                    })}
                </div> <hr />
                <div className='py-3 flex flex-nowrap justify-center items-center' >
                    {!photo && <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_TEMP}
                        onError={onUploadErrorHandler}
                        onSuccess={mainPhotoUploadSuccess}
                        options={{
                            multiple: false,
                            resourceType: "image",
                            clientAllowedFormats: ["png", "jpg", "jpeg", "webp"]
                        }}>
                        {({ open }) => (
                            <Button onClick={() => open()} className=' bg-blue-600 mr-8 hover:bg-blue-500 block'>
                                Upload Photo
                            </Button>
                        )}
                    </CldUploadWidget>}
                    {
                        photo ? <div className='relative h-[162px]'><img src={photo} alt='main photo'
                            className=' max-w-[120px] max-h-[160px]' />
                            <button onClick={() => removePhoto(photo)}
                                className=' absolute top-1 bg-red-600 hover:bg-red-500 p-2 text-white rounded-full right-1'>
                                <Trash2 size={18} />
                            </button>
                        </div> :
                            <Skeleton className=' w-[120px] h-[160px] block rounded-md' />
                    }
                </div>
                <p className='text-center text-xs text-red-600'>
                    Maximum file size: 2MB
                </p>
                <hr />

                <form className='pt-2' onSubmit={handleSubmit(onSubmit)}>

                    <div className={`${!addFakeName && "hidden"} mb-2`}>
                        <Label htmlFor='fakeName'>Fake Name </Label>
                        <Input {...register('fakeName')} type='text' id='fakeName'
                            placeholder='Enter a fake name' className='bg-gray-100' />
                    </div>
                    <div className='mb-4'>
                        <Label htmlFor='comment'>Comment : <sup className='required'>*</sup></Label>
                        <Textarea {...register('comment', { required: true, maxLength: 1000 })} required id='comment'
                            placeholder='Type your review here.'
                            className={`bg-gray-100 ${comment.length >= 1000 && 'border-red-500'}`} />
                        <p className={`flex flex-nowrap justify-between text-[10px] mt-1 ${(comment.length >= 1000) && 'text-red-500'}`}>
                            <span>
                                {comment.length >= 1000 ? 'Maximum characters reached' : 'Minimum 20 characters required'}
                            </span>
                            <span>
                                {comment.length}/1000
                            </span>
                        </p>
                    </div>
                    <Button className='float-right bg-green-500 hover:bg-green-600' type='submit'>
                        {
                            review ? "Save Changes" : "Post review"
                        }
                    </Button>
                </form>
                <Button
                    className='float-left bg-transparent text-black border-gray-400 hover:bg-gray-200/80 border'
                    onClick={onCancle}>
                    Cancel
                </Button>
            </div>
        </div>
    )
}
