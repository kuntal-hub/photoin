'use client';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getProducts } from '@/lib/actions/product.action';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type HiddenProductView = {
    _id: string;
    name: string;
    badge?: string;
    discountedPrice?: number;
    maxPrice: number;
    rank?: number;
}

export default function HiddenProductsPage() {
    const [products, setProducts] = useState<HiddenProductView[]>([]);
    const [page, setPage] = useState(1);
    const [hasmore, setHasmore] = useState(false);
    const { toast } = useToast();

    const fetchProducts = async (page: number) => {
        const res: HiddenProductView[] = await getProducts(page, 20, false);
        if (res) {
            if (page === 1) {
                setProducts(res);
            } else {
                setProducts(priv => [...priv, ...res]);
            }
            setPage(page);
            setHasmore(res.length === 20);
        } else {
            toast({
                title: "Error",
                description: "Error on fetching products",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        fetchProducts(1);
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
                    return <Link href={`/admin/product/${product._id}`} key={index}
                        className='block relative m-1 rounded-[10px] border border-dashed bg-purple-100/20 shadow-inner w-[150px] min-[410px]:w-[180px]'>
                        <Skeleton className='w-[150px] min-[410px]:w-[180px] rounded-t-[10px] min-[410px]:h-[240px] h-[200px] object-contain aspect-[3/4]' />
                        <div className='p-1'>
                            <p className='text-[14px] text-center p-0 m-0 font-semibold'>{product.name.length < 19 ? product.name : product.name.slice(0, 18) + '...'}</p>
                            <p className='m-0 p-0 text-center'>
                                <span className='text-[12px] text-red-600 line-through'>&#8377; {product.maxPrice}</span>
                                <span className='text-[14px] ml-3 text-green-600'>
                                    &#8377; {product.discountedPrice ? product.discountedPrice : product.maxPrice} Only</span></p>
                        </div>
                        {product.badge && <div className="ribbon"><span>{product.badge}</span></div>}
                    </Link>
                })}

            </div>
            {hasmore && <Button onClick={() => fetchProducts(page + 1)}
                className='block mx-auto my-8'>
                Load More
            </Button>}
        </>
    )
}
