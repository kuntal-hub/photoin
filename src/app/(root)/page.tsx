import React from 'react'
import { getCategoriesWithProducts } from '@/lib/actions/category.action'
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ImageSlider from '@/components/shared/ImageSlider';
import Productcard from '@/components/shared/Productcard';
import SetCategoriesName from './setCategoriesName';
import Footer from '@/components/shared/Footer';

export default async function RootPage() {
  const categoryes: categoriesView[] | null = await getCategoriesWithProducts();
  if (!categoryes) {
    return redirect('/404');
  }

  const categoryesWithBanner = categoryes.filter(category => category.banner);
  const categoryesWithLogo = categoryes.filter(category => category.logo);
  const categoryesWithProducts = categoryes.filter(category => category.products.length > 0);

  return (
    <>
      <div className='w-full'>
        <div className='w-full hidden md:flex md:flex-nowrap justify-center overflow-x-auto'>
          {
            categoryesWithLogo.map((category, index) => {
              return (
                <Link href={`#${category._id}`} key={category._id} className='flex flex-col justify-center items-center m-2'>
                  <Image
                    src={category.logo!}
                    alt={category.name}
                    width={60}
                    height={60}
                    className='cursor-pointer w-12 h-12'
                  />
                  <span className='text-[12px] my-1'>
                    {category.name.length > 13 ? category.name.slice(0, 13) + '...' : category.name}
                  </span>
                </Link>
              )
            })
          }
        </div>
        <div className='flex justify-center w-full h-[120px] p-1 md:hidden'>
          <Link href='/'>
            <Image src='/Purple Orange Camera Photography LogoCorped.png' alt='Photoin Logo' width={300} height={130}
              className='w-64 md:w-[300px] cursor-pointer'
            />
          </Link>
        </div>

        <ImageSlider categoryies={categoryesWithBanner} />
        <div className='my-4'>
          {
            categoryes.map((category, index) => {
              return category.products.length > 0 ? (<div key={category._id} className='w-full p-2 py-2 sm:px-4 md:px-8 ' id={category._id}>
                <h2 className='block text-lg sm:text-xl font-bold md:text-2xl text-center px-2 mt-6 mb-3'>{category.name}</h2>
                <div className='w-full flex flex-wrap justify-center'>
                  {category.products.map((product, index) => {
                    return <Productcard key={product._id} product={product} navLink={`/product/${product._id}`} />
                  })}
                </div>
              </div>) : <div key={category._id} className='hidden'>
                This category has no products 😑
              </div>
            })
          }
        </div>
        <SetCategoriesName categoriesName={categoryesWithProducts.map(item => ({ name: item.name, id: item._id }))} />
      </div>
      <br /> <br />
      <Footer />
    </>
  )
}
