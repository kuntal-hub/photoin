import React from 'react'
import { getProduct } from '@/lib/actions/product.action';
import ProductForm from '@/components/shared/ProductForm';
import { redirect } from 'next/navigation'

export default async function UpdateProductPage({ params }: { params: { id: string } }) {
    const data:Product = await getProduct(params.id);
    if (!data) {
        redirect('/admin/products')
    }
  return (
    <ProductForm action='update' data={data} />
  )
}