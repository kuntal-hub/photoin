'use client'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getAllReviews } from '@/lib/actions/review.action'
import { setAllReviews, addReviewsToAllReviews } from '@/lib/features/reviewSlice'
import ReviewGalary from '@/components/shared/ReviewGalary'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export default function ReviewPage() {
  const dispatch = useAppDispatch()
  const allReviews = useAppSelector(state => state.review.allReviews)
  const allReviewsPage = useAppSelector(state => state.review.allReviewsPage)
  const allReviewsHasmore = useAppSelector(state => state.review.allReviewsHasmore)
  const [loading, setLoading] = useState(false);

  const fatchReviews = async (page: number) => {
    const res: Review[] | null = await getAllReviews(page, 20);
    if (res) {
      if (page === 1) {
        dispatch(setAllReviews({ reviews: res, page: page, hasMore: res.length < 20 ? false : true }));
        setLoading(false);
      } else {
        dispatch(addReviewsToAllReviews({ reviews: res, page: page, hasMore: res.length < 20 ? false : true }));
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (allReviews.length === 0) {
        setLoading(true);
        await fatchReviews(1);
      }
    })();
  }, [])

  return (
    <div className='pb-8 xl:px-20'>
      {!loading ? <><ReviewGalary reviews={allReviews} adminDelete={true} />
        {allReviews.length === 0 && <div className='text-center text-2xl font-bold mt-14'>No Reviews Found</div>}
      </> :
        <div className='flex flex-wrap justify-center'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
            <Skeleton key={index} className='w-[200px] h-[300px] lg:w-[300px] mx-2 my-4' />
          ))}
        </div>}
        {allReviewsHasmore && <Button onClick={() => fatchReviews(allReviewsPage + 1)}
        className='block mx-auto my-8'
        >
          Load More
        </Button>}
    </div>
  )
}
