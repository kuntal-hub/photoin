import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCategoriesWithProducts } from '@/lib/actions/category.action'
import { redirect } from 'next/navigation'
import Productcard from '@/components/shared/Productcard';

export default async function CategoriesPage() {

  const categoryes: categoriesView[] | null = await getCategoriesWithProducts();
  if (!categoryes) {
    return redirect('/admin');
  }

  return (
    <div className='w-full py-6'>
      <Link href={"/admin/create-catagory"} className="media-uploader_cta block w-[200px] h-[200px] ml-2 sm:ml-4 md:ml-8">
        <div className="media-uploader_cta-image">
          <Image
            src="/icons/add.svg"
            alt="Add Image"
            width={24}
            height={24}
          />
        </div>
        <p className=" text-[12px] py-3 px-6">Create Catagory</p>
      </Link>

      {
        categoryes.map((category, index) => (
          <div key={category._id} className='w-full p-2 py-2 sm:px-4 md:px-8 '>
            <Link href={`/admin/category/${category._id}`} 
            className='block text-lg sm:text-xl md:text-2xl hover:text-blue-600 my-2 hover:underline'>{category.name}</Link>
            <div className='w-full flex flex-wrap justify-start'>
              {category.products.length > 0 ? category.products.map((product, index) => {
                return <Productcard key={product._id} product={product} navLink={`/admin/product/${product._id}`} />
              }) : 
              <div className='w-full flex flex-nowrap items-center justify-center h-44'>
                This category has no products 😑
              </div>
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}
