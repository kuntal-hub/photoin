'use client';
import React from 'react'
import ImageSlider2 from '@/components/shared/ImageSlider2'
import { getProductForCustomization } from '@/lib/actions/product.action'
import { useRouter } from 'next/navigation';
import { ArrowBigRightDash, Share } from 'lucide-react';
import ShareBtn from '@/components/shared/ShareBtn';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { addProduct } from '@/lib/features/customizeProductsSlice';
import { Skeleton } from '@/components/ui/skeleton';
import FormPreview from '@/components/shared/FormPreview';
import Offers from '@/components/shared/Offers';
import MoreProductDetails from '@/components/shared/MoreProductDetails';
import Footer from '@/components/shared/Footer';

export default function CustomizePage({ params }: { params: { id: string } }) {
  const userId = useAppSelector(state => state.auth.userId);
  const product = useAppSelector(state => state.customizeProducts.products).find(product => product._id === params.id);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!product) {
        const product: ProductViewForCustomization | null = await getProductForCustomization(params.id);
        if (!product) {
          router.replace('/');
        } else {
          dispatch(addProduct(product));
        }
      }
    })()
  }, []);

  return (
    <div>
      {product ?
        <>
          {
            product.designId ? <div>

            </div> :
              <div className='flex flex-col md:flex-row justify-center'>
                <div
                  className='w-full md:w-[45%] md:h-[calc(100vh-56px)] flex p-2 lg:p-8 lg:pb-0 min-[400px]:p-4 md:sticky md:top-12 lg:top-10 justify-center md:justify-end'>
                  <ImageSlider2
                    images={[product.mainPhoto, ...product.photos]}
                    badge={product.badge}
                    userId={userId}
                    productId={product._id}
                    duration={8000}
                    product={{
                      _id: product._id,
                      name: product.name,
                      mainPhoto: product.mainPhoto,
                      badge: product.badge,
                      maxPrice: product.maxPrice,
                      discountedPrice: product.discountedPrice,
                    }}
                  />
                </div>
                <div className='w-full md:w-[55%] md:min-h-[calc(100vh-56px)] p-4 lg:p-8 flex flex-col justify-start'>
                  <div className='w-full max-w-[450px] md:max-w-full mx-auto md:mx-0'>
                    <h1 className='md:text-2xl text-xl xl:text-4xl font-bold'>{product.name}</h1>
                    {product.description && <p className='my-3 text-sm md:text-[16px] text-gray-600'>{product.description}</p>}


                    <p className='my-2 p-0'>
                      <span className='text-[15px] text-red-600 line-through'>&#8377; {product.maxPrice * product.quantity}</span>
                      <span className='text-[18px] ml-5 text-green-600'>
                        &#8377; {(product.discountedPrice ? product.discountedPrice : product.maxPrice) * product.quantity} Only</span>
                    </p>

                    <FormPreview product={product} />

                    <Offers />
                    <div className=' my-6'>
                      <h2 className='font-bold my-2'>
                        Highlights
                      </h2>
                      <ul className='pl-6 mt-3'>
                        {product.features?.map((feature, index) => {
                          return <li key={index} className='flex flex-nowrap items-center text-sm my-[6px]'>
                            <ArrowBigRightDash size={18} className=' text-blue-600' />
                            <span className='text-gray-600 mx-2'>
                              {feature}
                            </span>
                          </li>
                        })}
                      </ul>
                    </div>

                    <MoreProductDetails minDeliveryDays={product.minDeliveryDays || 5} maxDeliveryDays={product.maxDeliveryDays || 7} />

                    <ShareBtn
                      className='flex flex-nowrap justify-start items-center text-sm text-blue-600 hover:underline'
                      pathName={`/product/${product._id}`}
                      title={product.name}
                    >
                      <Share size={16} /> <span className='ml-2'>
                        Share this product
                      </span>
                    </ShareBtn>

                  </div>
                </div>
              </div>}
        </> : <div className='flex flex-col md:flex-row justify-center'>
          <div className='w-full md:w-[45%] md:h-[calc(100vh-56px)] flex p-2 lg:p-8 min-[400px]:p-4 justify-center md:justify-end'>
            <Skeleton className='w-full max-w-[450px] aspect-[3/4]' />
          </div>

          <div className='w-full md:w-[55%] md:min-h-[calc(100vh-56px)] p-4 lg:p-8 flex flex-col justify-start'>
            <Skeleton className='w-[90%] h-10 rounded-xl' />
            <Skeleton className='w-[80%] h-5 mt-4 rounded-xl' />
            <Skeleton className='w-[90%] h-5 my-2 rounded-xl' />

            <Skeleton className='w-[30%] h-4 mt-6 rounded-xl' />
            <Skeleton className='w-[40%] h-6 my-3 rounded-xl' />

            <Skeleton className='w-[70%] h-4 mt-8 mb-2 rounded-xl' />
            <Skeleton className='w-[60%] h-4 my-2 rounded-xl' />
            <Skeleton className='w-[70%] h-4 my-2 rounded-xl' />
            <Skeleton className='w-[60%] h-4 my-2 rounded-xl' />

            <Skeleton className='w-[90%] h-96 mt-8 mb-2 rounded-xl' />
          </div>
        </div>}
      <br /><br />
      <Footer />
    </div>
  )
}
