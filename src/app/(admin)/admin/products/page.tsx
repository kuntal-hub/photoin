'use client';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { getProducts } from '@/lib/actions/product.action';
import { useToast } from '@/components/ui/use-toast';
import Productcard from '@/components/shared/Productcard';
import { Button } from '@/components/ui/button';
import { useAppSelector,useAppDispatch } from '@/lib/hooks';
import { setProducts,addProducts } from '@/lib/features/adminProductsSlice';

export default function ProductsPage() {
  // const [products, setProducts] = useState<ProductView[]>([]);
  const products = useAppSelector(state => state.adminProducts.products);
  const page = useAppSelector(state => state.adminProducts.page);
  const hasmore = useAppSelector(state => state.adminProducts.hasmore);
  const isFatched = useAppSelector(state => state.adminProducts.isFatched);
  const dispatch = useAppDispatch();
  //const [page, setPage] = useState(1);
  //const [hasmore, setHasmore] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async (page: number) => {
    const res = await getProducts(page, 20);
    if (res) {
      if (page === 1) {
        dispatch(setProducts({ products: res, page: page, hasmore: res.length < 20 ? false : true }));
      } else {
        dispatch(addProducts({ products: res, page: page, hasmore: res.length < 20 ? false : true }));
      }
    } else {
      toast({
        title: "Error",
        description: "Error on fetching products",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (!isFatched) {
      fetchProducts(1);
    }
  }, [])

  return (
    <>
      <div className='w-screen flex flex-wrap justify-start p-2 sm:p-4 md:p-8'>
        <Link href={"/admin/create-product"} className="media-uploader_cta block w-[180px] h-[294px] m-1">
          <div className="media-uploader_cta-image">
            <Image
              src="/icons/add.svg"
              alt="Add Image"
              width={24}
              height={24}
            />
          </div>
          <p className=" text-[12px] py-3 px-6">Create Product</p>
        </Link>
        {products.map((product, index) => {
          return <Productcard key={product._id} product={product} navLink={`/admin/product/${product._id}`} />
        })}

      </div>
      {hasmore && <Button onClick={() => fetchProducts(page + 1)}
      className='block mx-auto my-8'>
        Load More
      </Button>}
    </>
  )
}
