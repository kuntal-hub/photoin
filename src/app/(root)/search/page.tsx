import React from 'react'
import { redirect } from 'next/navigation';
import Productcard from '@/components/shared/Productcard';
import { searchProducts } from '@/lib/actions/search.action';
import Footer from '@/components/shared/Footer';

export default async function SearchPage({ searchParams }: { searchParams: { query: string } }) {
  if (!searchParams.query) {
    return redirect('/');
  }

  const products: ProductView[] | null = await searchProducts(searchParams.query);
  if (!products) {
    return redirect('/');
  }

  return (
    <>
      <div className='w-full px-2 sm:px-4 md:px-8 pb-6'>
        <h1 className='text-xl text-center font-bold sm:text-2xl lg:text-3xl my-6 sm:my-8'>
          Search results for {`"${searchParams.query}"`}
        </h1>
        {
          products.length > 0 ? <div className='w-full flex flex-wrap justify-start'>
            {products.map((product, index) => {
              return <Productcard key={product._id} product={product} navLink={`/product/${product._id}`} />
            })}</div> : <div className='flex justify-center items-center h-[40vh]'>
            <p className='text-2xl text-center font-bold sm:text-2xl'>
              No products found 🥺
            </p>
          </div>
        }
      </div>
      <Footer />
    </>
  )
}
