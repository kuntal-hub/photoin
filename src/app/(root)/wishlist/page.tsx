'use client';
import React from 'react'
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { useToast } from '@/components/ui/use-toast';
import { getWishlist } from '@/lib/actions/wishlist.action';
import { setWishlist, addProtoductsToWishlist } from '@/lib/features/wishlistSlice';
import Productcard from '@/components/shared/Productcard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/shared/Footer';

export default function WishListPage() {
  const wishlist = useAppSelector((state) => state.wishlist.wishlist);
  const page = useAppSelector((state) => state.wishlist.page);
  const hasMore = useAppSelector((state) => state.wishlist.hasMore);
  const isFatched = useAppSelector((state) => state.wishlist.isFatched);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const fatchWishlist = async (page: number) => {
    const res: ProductView[] = await getWishlist(page, 20);
    if (res) {
      if (page === 1) {
        dispatch(setWishlist({ wishlist: res, page: page, hasMore: res.length < 20 ? false : true }));
        setLoading(false);
      } else {
        dispatch(addProtoductsToWishlist({ wishlist: res, page: page, hasMore: res.length < 20 ? false : true }));
      }
    } else {
      toast({
        title: "Error",
        description: "Error on fetching wishlist",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    (async () => {
      if (!isFatched) {
        await fatchWishlist(1);
      } else {
        setLoading(false);
      }
    })();
  }, [])

  return (
    <>
      <h1 className='text-2xl my-4 font-semibold text-center'>Wishlist</h1>

      {!loading ? <div className='flex flex-wrap justify-start p-2 sm:p-4 md:p-8'>
        {wishlist.length > 0 ? <>
          {wishlist.map((product, index) => {
            return <Productcard key={product._id} product={product} navLink={`/product/${product._id}`} />
          })}</> : <div className='w-full h-[50vh] text-lg flex items-center justify-center text-center'>
          Your wishlist is empty 🫡
        </div>}
      </div> : <div className='flex flex-wrap justify-start p-2 sm:p-4 md:p-8'>
        {
          Array.from({ length: 20 }, (_, i) => (
            <Skeleton key={i} className='h-[295px] w-[178px] rounded-[10px] m-1' />
          ))
        }
      </div>}
      {hasMore && <Button onClick={() => fatchWishlist(page + 1)}
        className='block mx-auto my-8'>
        Load More
      </Button>}
      <Footer />
    </>
  )
}
