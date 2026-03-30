'use client';
import React from 'react'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getReviews,isUserCreateReview } from '@/lib/actions/review.action';
import { setReviews,addReviews,setIsReviewedByMe } from '@/lib/features/reviewSlice';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import CreateReviewForm from './CreateReviewForm';
import { ToastAction } from '../ui/toast';
import { useRouter } from 'next/navigation';
import ReviewGalary from './ReviewGalary';
import { Skeleton } from '../ui/skeleton';


export default function ReviewSection({productId,userId}:{productId:string,userId?:string | null}) {
  const reviews = useAppSelector(state => state.review.productReviews.find(pr => pr.productId === productId)?.reviews) || [];
  const isReviewedByMe = useAppSelector(state => state.review.productReviews.find(pr => pr.productId === productId)?.isReviewedByMe) || false;
  const page = useAppSelector(state => state.review.productReviews.find(pr => pr.productId === productId)?.page) || 1;
  const hasmore = useAppSelector(state => state.review.productReviews.find(pr => pr.productId === productId)?.hasmore) || false;
  const [showCreateReviewForm,setShowCreateReviewForm] = useState(false);
  const [loading,setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {toast} = useToast();
  const router = useRouter();

  const fetchReviews = async (page:number) => {
    const res:Review[] | null = await getReviews(productId,page,20);
    if(res){
      if(page === 1){
        dispatch(setReviews({productId:productId,reviews:res,page:page,hasmore:res.length < 20 ? false : true,isReviewedByMe:isReviewedByMe}));
        setLoading(false);
      }else{
        dispatch(addReviews({productId:productId,reviews:res,page:page,hasmore:res.length < 20 ? false : true,isReviewedByMe:isReviewedByMe}));
      }
    }
  }

  useEffect(() => {
    (async ()=> {
      if(reviews.length === 0){
        setLoading(true);
        await fetchReviews(1);
      }
      if(userId){
        const res = await isUserCreateReview(productId,userId);
        dispatch(setIsReviewedByMe({productId:productId,isReviewedByMe:res}));
      }
    })();
  },[])

  return (
    <div className='w-full'>
        <Button onClick={() => {
          if (!userId) {
            return toast({
              title: "Login Required",
              description: "You need to login to write a review",
              variant: "destructive",
              action: <ToastAction altText="Login"
              onClick={() => router.push('/sign-in')}
              >
                  Login
              </ToastAction>,
            })
          }
          if (isReviewedByMe) {
            return toast({
              title: "Already Reviewed",
              description: "You already reviewed this product",
              variant: "destructive",
            })
          }
          setShowCreateReviewForm(true);
        }}
        className='block mx-auto my-8 bg-pink-500 hover:bg-pink-600'
        >
          Write a Review
        </Button>

        {reviews.length > 0 && <h2 className='text-xl sm:text-2xl font-bold'>
          Customer Reviews :
        </h2>}
        {!loading ? <ReviewGalary reviews={reviews} /> : 
        <div className='flex flex-wrap justify-center'>
          {[1,2,3,4,5,6,7,8,9,10].map((_,index) => (
            <Skeleton key={index} className='w-[200px] h-[300px] lg:w-[300px] mx-2 my-4' />
          ))}
        </div>}
        {hasmore && <Button className='block mx-auto mt-4'
        onClick={() => fetchReviews(page + 1)}
        >
          See More
        </Button>}

        {showCreateReviewForm && <CreateReviewForm 
        productId={productId} 
        setShowCreateReviewForm={setShowCreateReviewForm}
        addFakeName={false}
        userId={userId!} />}
    </div>
  )
}
