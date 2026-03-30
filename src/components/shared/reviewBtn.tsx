'use client'
import React from 'react'
import { Button } from '../ui/button';
import { useState } from 'react';
import CreateReviewForm from './CreateReviewForm';
import { Pencil } from 'lucide-react';

type Review = {
    _id: string;
    rating: number;
    comment: string;
    product:string;
    image?: string;
}

export default function ReviewBtn({ review,userId,productId }: { review?: Review,userId:string,productId:string }) {
    const [showCreateReviewForm,setShowCreateReviewForm] = useState(false);
    const [productReview,setProductReview] = useState<Review | null>(review || null);
    return (
        <>
        <div className='flex flex-nowrap justify-between'>
            <div className='flex flex-col items-start justify-start'>
            <button 
            onClick={() => setShowCreateReviewForm(true)}
            >
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
                                className="mx-0 text-[25px] cursor-pointer"
                                style={{
                                    color:
                                        currentRating <= (productReview?.rating || 0) ? "#ffc107" : "#e4e5e9",
                                }}
                            >
                                &#9733;
                            </span>
                        </label>
                    );
                })}
            </button>
            {
                productReview ? <p className='text-xs text-gray-500'>
                    {productReview.comment}
                </p> : <button onClick={() => setShowCreateReviewForm(true)}
                className='text-xs text-blue-500 font-bold'>
                    Write a review
                </button>
            }
            </div>
            {productReview && <Button onClick={() => setShowCreateReviewForm(true)}
            variant='link' className='text-blue-600'
            >
                <Pencil size={16} className='mr-1' />Edit
            </Button>}
        </div>
        {
            showCreateReviewForm && 
            <CreateReviewForm 
            userId={userId} 
            review={productReview}
            productId={productId}
            setShowCreateReviewForm={setShowCreateReviewForm}
            addFakeName={false}
            setProductReview={setProductReview}
             />
        }
        </>
    )
}
