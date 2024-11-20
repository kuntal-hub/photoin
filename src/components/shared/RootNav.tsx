'use client';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { BaggageClaim, Heart, House, Search, ShoppingCart } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { SearchItem } from './SearchSuggestions';
import { useRouter } from 'next/navigation';
import { getSearchSuggestions } from '@/lib/actions/search.action';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { chatWithUsUrl } from '@/constants/index';
import Menu from './Menu';

const schema = z.object({
  search: z.string()
});

type Schema = z.infer<typeof schema>

export default function RootNav() {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<SearchSuggestions[]>([]);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { search: '' }
  });
  const search = watch('search');
  const pathname = usePathname();

  const onSuggestionsClick = (query: string) => {
    setShowSuggestions(false);
    setValue('search', query);
    router.push(`/search?query=${query.replaceAll(' ', '+')}`);
  }

  const handleOutsideClick = (event: any) => {
    if (showSuggestions && !event.target.closest('.menu-container')) {
      setShowSuggestions(false);
    }
  };

  const onSubmit = (data: Schema) => {
    setShowSuggestions(false);
    router.push(`/search?query=${data.search.replaceAll(' ', '+')}`);
  }

  // Adding event listener for clicks outside menu
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showSuggestions]);

  useEffect(() => {
    if (search.length > 2) {
      const timeout = setTimeout(async () => {
        const suggestions = await getSearchSuggestions(search);
        if (suggestions) {
          setSuggestions([...suggestions]);
        }
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [search])

  return (
    <>
      <nav className='flex flex-nowrap sticky z-50 top-0 justify-between bg-pink-500 h-14 py-2 px-4 min-[440px]:px-3 md:px-3'>
        <div>
          <Link href='/'>
            <Image src='/20240823_164421-min.png' alt='logo' width={144} height={43} 
            className='hidden w-[144px] md:inline' />
          </Link>
          <Menu />
        </div>

        <div
          className='relative w-full sm:max-w-[360px] md:max-w-[380px] lg:max-w-[480px] xl:max-w-[600px] ml-4 sm:ml-1 sm:mr-1 md:mx-3'>
          <form onSubmit={handleSubmit(onSubmit)}
            className='flex items-center border rounded-full px-3 bg-gray-100 menu-container'>
            <Search size={18} className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input type="search"
              required
              autoFocus
              onFocus={() => setShowSuggestions(true)}
              placeholder='Search for anything...'
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              {...register('search', { required: true })}
            />
          </form>

          {suggestions.length > 0 && showSuggestions &&
            <div className='absolute w-full top-11 left-0 z-50 rounded-lg bg-gray-100 menu-container border'>
              {
                suggestions.map((suggestion, index) => {
                  return <SearchItem
                    key={suggestion._id}
                    itemText={suggestion.query}
                    searchText={search}
                    onClick={() => onSuggestionsClick(suggestion.query)}
                  />
                })
              }
            </div>}
        </div>

        <div className='sm:flex sm:flex-nowrap sm:justify-end hidden '>
          <SignedIn>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/wishlist'}
                    className={`p-2 flex flex-nowrap justify-center ${pathname === '/wishlist' ? "text-black" : "text-white"} hover:text-black md:mx-[6px]`}>
                    <Heart /> <span className='ml-1 font-semibold hidden lg:inline'>
                      Wishlist
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    My Wishlist
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/my-cart'}
                    className={`p-2 flex flex-nowrap justify-center ${pathname === '/my-cart' ? "text-black" : "text-white"} hover:text-black md:mx-[6px]`}>
                    <ShoppingCart /> <span className='font-semibold ml-1 hidden lg:inline'>Cart</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    My Cart
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/my-orders'}
                    className={`p-2 flex flex-nowrap justify-center ${pathname === '/my-orders' ? "text-black" : "text-white"} hover:text-black md:mx-[6px]`}>
                    <BaggageClaim /> <span className='font-semibold ml-1 hidden lg:inline'>Orders</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    My Orders
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex-center cursor-pointer p-4">
              <UserButton />
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/sign-up'}>

                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    My Account
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SignedIn>

          <SignedOut>
            <Button asChild className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>

      </nav>

      <div className='fixed bottom-0 left-0 block sm:hidden w-screen z-50 h-12 bg-white shadow-top-md border-t border-t-gray-300 py-1 px-3'>
        <ul className=' flex flex-nowrap justify-between items-center w-full min-[380px]:px-1 min-[400px]:px-2 min-[500px]:px-4'>
          <li className={`${pathname === '/' ? "text-blue-600" : "text-gray-600"}`}>
            <Link href='/' className='flex flex-col items-center'>
              <House className='w-5 h-5 mx-2' />
              <span className='text-[10px] font-bold'>
                Home
              </span>
            </Link>
          </li>

          <li className={`${pathname === '/wishlist' ? "text-blue-600" : "text-gray-600"}`}>
            <Link href='/wishlist' className='flex flex-col items-center'>
              <Heart className='w-5 h-5 mx-2' />
              <span className='text-[10px] font-bold'>
                Wishlist
              </span>
            </Link>
          </li>

          <li className='flex flex-col items-center text-gray-600'>
            <SignedIn>
              <UserButton />
              <span className='text-[10px] font-bold'>
                Account
              </span>
            </SignedIn>
            <SignedOut>
              <Button asChild className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500">
                <Link href="/sign-in">Login</Link>
              </Button>
            </SignedOut>
          </li>

          <li className={`${pathname === '/my-cart' ? "text-blue-600" : "text-gray-600"}`}>
            <Link href='/my-cart' className='flex flex-col items-center'>
              <ShoppingCart className='w-5 h-5 mx-2' />
              <span className='text-[10px] font-bold'>
                Cart
              </span>
            </Link>
          </li>

          <li className={`${pathname === '/my-orders' ? "text-blue-600" : "text-gray-600"}`}>
            <Link href='/my-orders' className='flex flex-col items-center'>
              <BaggageClaim className='w-5 h-5 mx-2' />
              <span className='text-[10px] font-bold'>
                Orders
              </span>
            </Link>
          </li>
        </ul>
      </div>


      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a href={chatWithUsUrl}
              target="_blank" rel="noopener noreferrer"
              className='fixed bottom-14 sm:bottom-4 right-4 sm:right-6 md:right-8 lg:bottom-6 lg:right-10 z-50'
            >
              <Image
                className='cursor-pointer w-12 sm:w-14 h-12 sm:h-14'
                src={'/icons/icons8-whatsapp-96.svg'}
                height={56}
                width={56}
                alt='whatsapp'
              />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Chat with us
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
