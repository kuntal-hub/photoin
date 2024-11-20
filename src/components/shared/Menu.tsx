'use client';
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/lib/hooks';
import { BaggageClaim, Facebook, Menu as MenuIcon, Gem, Heart, House, Instagram, Mail, MessagesSquare, Phone, ShoppingCart, Twitter, Youtube } from 'lucide-react';
import { email, phone, chatWithUsUrl, fbUrl, instaUrl, twitterUrl, youtubeUrl } from '@/constants';

export default function Menu() {
    const categoriesName = useAppSelector(state => state.temp.cateGoiesName);
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <button className='h-8 w-8 text-white py-1 inline md:hidden' title='Menu' aria-label='Menu'>
                        <MenuIcon size={32} />
                        {/* <Image src='/icons/icons8-menu (1).svg' alt='logo' width={48} height={48}
                            className='w-full' /> */}
                    </button>
                </SheetTrigger>
                <SheetContent side='left' className=' overflow-y-auto'>
                    <SheetHeader>
                        <SheetTitle>
                            <Image src='/20240823_164421-min.png' alt='Our Logo' width={150} height={41} className='w-[150px]' />
                        </SheetTitle>
                        <SheetDescription>
                            Favourite gift for your favourite once.
                        </SheetDescription>
                    </SheetHeader>
                    <div className=' grid grid-cols-1 gap-3 mt-8 mb-3'>
                        <Link href={"/"} className='flex flex-nowrap justify-start hover:underline text-purple-600 items-center font-bold w-full'>
                            <House size={20} /> <span className='ml-2'>Home</span>
                        </Link>
                        <Link href={"/wishlist"} className='flex flex-nowrap justify-start hover:underline text-purple-600 items-center font-bold w-full'>
                            <Heart size={20} /> <span className='ml-2'>My Wishlist</span>
                        </Link>
                        <Link href={"/my-cart"} className='flex flex-nowrap justify-start hover:underline text-purple-600 items-center font-bold w-full'>
                            <ShoppingCart size={20} /> <span className='ml-2'>My Cart</span>
                        </Link>
                        <Link href={"/my-orders"} className='flex flex-nowrap justify-start hover:underline text-purple-600 items-center font-bold w-full'>
                            <BaggageClaim size={20} /> <span className='ml-2'>My Orders</span>
                        </Link>
                    </div><hr />
                    {
                        categoriesName.length > 0 && <div className=' grid grid-cols-1 gap-2 my-3 text-sm'>
                            <h3 className='mt-3 mb-1 font-bold'>
                                Product Categories
                            </h3>
                            {
                                categoriesName.map((item, index) => (
                                    <Link key={index} href={`/#${item.id}`} className=' pl-3 flex text-pink-600 hover:underline flex-nowrap justify-start items-center font-bold w-full'>
                                        <Gem size={18} />
                                        <span className='ml-2'>{item.name.length > 25 ? item.name.slice(0, 22) : item.name}{item.name.length > 25 && "..."}</span>
                                    </Link>
                                ))
                            }
                            <br />
                            <hr />
                        </div>
                    }
                    <div className=' grid grid-cols-1 gap-2 text-sm text-gray-600'>
                        <a href={`mailto:${email}`} className='flex flex-nowrap justify-start hover:underline items-center font-bold w-full' >
                            <Mail size={18} /> <span className='ml-2'>{email}</span>
                        </a>
                        <a href={`tel:+91${phone}`} className='flex flex-nowrap justify-start hover:underline items-center font-bold w-full' >
                            <Phone size={18} /> <span className='ml-2'>+91 {phone}</span>
                        </a>
                        <a href={chatWithUsUrl} target='_blank' className='flex flex-nowrap justify-start hover:underline items-center font-bold w-full' >
                            <MessagesSquare size={18} /> <span className='ml-2'>Chat With Us.</span>
                        </a>
                    </div>
                    <div className='flex flex-nowrap justify-evenly mt-6 text-gray-600'>
                        <a href={fbUrl} target="_blank" rel="noopener noreferrer">
                            <Facebook />
                        </a>
                        <a href={instaUrl} target="_blank" rel="noopener noreferrer">
                            <Instagram />
                        </a>
                        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                            <Twitter />
                        </a>
                        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                            <Youtube />
                        </a>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
