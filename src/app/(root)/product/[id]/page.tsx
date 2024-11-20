import React from 'react'
import ImageSlider2 from '@/components/shared/ImageSlider2'
import { getProductsPageData } from '@/lib/actions/product.action'
import { auth } from "@clerk/nextjs/server"
import { redirect } from 'next/navigation';
import Productcard from '@/components/shared/Productcard';
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { ArrowBigRightDash, Share } from 'lucide-react';
import ReviewSection from '@/components/shared/ReviewSection';
import ShareBtn from '@/components/shared/ShareBtn';
import { Button } from '@/components/ui/button';
import Offers from '@/components/shared/Offers';
import MoreProductDetails from '@/components/shared/MoreProductDetails';
import Footer from '@/components/shared/Footer';


export default async function RootProductPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  const product: ProductDetails | null = await getProductsPageData(params.id);
  if (!product) {
    return redirect('/');
  }
  // console.log(product)
  const productImages = [product.mainPhoto, ...product.photos];
  const similarProducts = product.similarProducts.filter((p: ProductView) => p._id !== product._id);
  const rating = product.rating ? Math.round(product.rating) : 0;
  return (
    <>
      <div className='flex flex-col md:flex-row justify-center'>
        <div
          className='w-full md:w-[50%] md:h-[calc(100vh-56px)] flex p-2 lg:p-8 lg:pb-0 min-[400px]:p-4 md:sticky md:top-12 lg:top-10  justify-center md:justify-end'>
          <ImageSlider2
            images={productImages}
            badge={product.badge}
            userId={userId}
            productId={product._id}
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
        <div className='w-full md:w-[50%] md:min-h-[calc(100vh-56px)] p-4 lg:p-8 flex flex-col justify-start'>
          <div className='w-full max-w-[450px] md:max-w-full mx-auto md:mx-0'>
            <h1 className='md:text-2xl text-xl xl:text-4xl font-bold'>{product.name}</h1>
            {product.description && <p className='my-3 text-sm md:text-[16px] text-gray-600'>{product.description}</p>}

            <Link href={'#reviews'} className='flex flex-nowrap justify-start items-center'>
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
                        className="mx-0 text-[25px] cursor-pointer"
                        style={{
                          color:
                            currentRating <= rating ? "#ffc107" : "#e4e5e9",
                        }}
                      >
                        &#9733;
                      </span>
                    </label>
                  );
                })}
              </div>
              <span className=' hover:underline text-gray-600 ml-3 text-sm'>
                {product.reviewCount} Reviews
              </span>
            </Link>

            <p className='my-2 p-0'>
              <span className='text-[15px] text-red-600 line-through'>&#8377; {product.maxPrice}</span>
              <span className='text-[18px] ml-5 text-green-600'>
                &#8377; {product.discountedPrice ? product.discountedPrice : product.maxPrice} Only</span>
            </p>

            <Offers />

            <div className='mt-10 flex flex-nowrap justify-between'>
              <div className="arrows-body">
                <div className="movingArrowLtoR"></div>
                <div className="movingArrowLtoR"></div>
                <div className="movingArrowLtoR"></div>
              </div>
              <Link href={`/customize/${product._id}`} prefetch={true} className='glow-on-hover py-3 px-4 w-40 text-center'>
                Customize Now
              </Link>
              <div className="arrows-body">
                <div className="movingArrowRtoL"></div>
                <div className="movingArrowRtoL"></div>
                <div className="movingArrowRtoL"></div>
              </div>
            </div>

            <p className='text-center my-3 text-sm'>
              OR
            </p>

            <Button variant='outline' className='mx-auto block'>
              <Link href={'/your-own-design'} prefetch={true}>
                Upload Your Own Design
              </Link>
            </Button>

            <div className='mb-6 mt-8'>
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
      </div>

      <>
        {similarProducts.length > 0 &&
          <div className='w-full p-2 mb-6 sm:px-4 md:px-8 ' id='similarProducts'>
            <h2 className='block text-lg sm:text-xl font-bold md:text-2xl px-2 my-4'>
              Similar Products
            </h2>
            <div className='w-full flex flex-wrap justify-start'>
              {similarProducts.map((product, index) => {
                return <Productcard key={product._id} product={product} navLink={`/product/${product._id}`} />
              })}
            </div>
          </div>}
      </>

      <div id='reviews' className='w-full p-2 my-6 sm:px-4 md:px-8 border-t'>

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
                          currentRating <= rating ? "#ffc107" : "#e4e5e9",
                      }}
                    >
                      &#9733;
                    </span>
                  </label>
                );
              })}
            </div>
            <p>
              {product.rating ? product.rating.toFixed(1) : 0} average based on {product.reviewCount} reviews.
            </p>
          </div>

          <div className='w-full md:w-[70%] flex flex-col py-4 justify-center items-center'>
            <div className="retingbardiv">
              <span>5 ⭐</span>
              <Progress value={(product.star5 / product.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-green-500' />
              <span>
                {product.star5}
              </span>
            </div>
            <div className="retingbardiv">
              <span>4 ⭐</span>
              <Progress value={(product.star4 / product.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-blue-500' />
              <span>
                {product.star4}
              </span>
            </div>
            <div className="retingbardiv">
              <span>3 ⭐</span>
              <Progress value={(product.star3 / product.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-pink-500' />
              <span>
                {product.star3}
              </span>
            </div>
            <div className="retingbardiv">
              <span>2 ⭐</span>
              <Progress value={(product.star2 / product.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-orange-500' />
              <span>
                {product.star2}
              </span>
            </div>
            <div className="retingbardiv">
              <span>1 ⭐</span>
              <Progress value={(product.star1 / product.reviewCount) * 100} className='w-[70%] bg-gray-200' slot='bg-red-500' />
              <span>
                {product.star1}
              </span>
            </div>
          </div>
        </div>


        <ReviewSection productId={product._id} userId={userId} />
      </div>
      <Footer />
    </>
  )
}

// https://codesandbox.io/p/sandbox/react-starrating-dhmyh4?from-embed=
