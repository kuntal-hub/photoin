'use client';
import React, { useState } from 'react'
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Trash2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { deleteReview,deleteReviewByAdminId } from '@/lib/actions/review.action';
import { deleteReview as deleteReviewfromStore,setIsReviewedByMe,deleteFromAllReviews } from '@/lib/features/reviewSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export default function ReviewCard({ review, adminDelete = false }: { review: Review, adminDelete?: boolean }) {
  const [seeAll, setSeeAll] = useState(false);
  const comment = seeAll ? review.comment : review.comment.slice(0, 50);
  const user_id = useAppSelector(state => state.auth.userId);
  const admin_id = useAppSelector(state => state.auth.adminId);
  const userId = adminDelete ? admin_id : user_id;
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const deleteReviewHandler = async () => {
    if (!userId) {
      return toast({
        title: "unauthorized",
        description: "You are not authorized to delete this review",
        variant: "destructive"
      })
    }
    if (adminDelete) {
      const res = await deleteReviewByAdminId(review._id, userId);
      if (res === true) {
        dispatch(deleteFromAllReviews(review._id));
        toast({
          title: "Review Deleted",
          description: "Review deleted successfully",
          className: "bg-green-500 text-white",
        })
      } else {
        toast({
          title: "unauthorized",
          description: "You are not authorized to delete this review",
          variant: "destructive"
        })
      }
    } else {
      const res = await deleteReview(review._id, userId);
      if (res === true) {
        dispatch(deleteReviewfromStore({productId:review.product,reviewId:review._id}));
        dispatch(setIsReviewedByMe({productId:review.product,isReviewedByMe:false}));
        toast({
          title: "Review Deleted",
          description: "Review deleted successfully",
          className: "bg-green-500 text-white",
        })
      } else {
        toast({
          title: "unauthorized",
          description: "You are not authorized to delete this review",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg h-auto my-4 mx-1 min-[550px]:mx-2 sm:mx-3 sm:my-6 min-[800px]:mx-1 min-[800px]:my-4 lg:mx-2 xl:mx-3 xl:my-6">
      <div className='flex flex-col'>
        <div className='w-full'>
          {
            review.image && <img src={review.image.replace('upload/', 'upload/q_30/')} alt="review" 
            className="w-full rounded-t-lg bg-gray-200 min-h-[150px]" />
          }
        </div>
        <div className={`p-2 border-b ${review.fakeName && adminDelete && "flex flex-nowrap justify-between"}`}>
          <div className="flex flex-nowrap items-center">
            <Avatar>
              <AvatarImage src={review.fakeName ? "https://example.com/abc.png" : review.user.photo } alt="user" />
              <AvatarFallback className='bg-gray-600 text-white font-semibold'>{
                review.fakeName ? review.fakeName[0].toUpperCase() : review.user.firstName[0].toUpperCase()
              }</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <h3 className="font-semibold text-sm leading-4 mt-2 h-4">{
                review.fakeName ? review.fakeName : review.user.firstName + " " + review.user.lastName
                }</h3>
              <span className='text-gray-500 text-[12px]'>
                {new Date(review.createdAt).toLocaleDateString()}{" "}
              </span>
            </div>
          </div>
          {review.fakeName && adminDelete &&<span>
            🤫
          </span>}
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
            {userId && (userId === review.user.clerkId || adminDelete) && <AlertDialog>
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
                  <AlertDialogAction onClick={deleteReviewHandler}
                    className='bg-red-600 hover:bg-red-500 text-white'
                  >Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>}
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
