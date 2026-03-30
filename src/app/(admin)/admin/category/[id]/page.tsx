import React from 'react'
import { getCategory } from '@/lib/actions/category.action'
import CatagoryForm from '@/components/shared/CatagoryForm'
import { redirect } from 'next/navigation'

export default async function UpdateCategoryPage({ params }: { params: { id: string } }) {
    const data:Catagory = await getCategory(params.id);
    if (!data) {
        redirect('/admin/categories')
    }
  return (
    <CatagoryForm action='update' data={data} />
  )
}
