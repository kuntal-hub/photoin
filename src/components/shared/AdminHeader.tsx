"use client";
import Link from 'next/link'
import React from 'react'
import { adminNavItems } from '@/constants/index'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  EyeOff,
  ShieldQuestion,
  ShieldX,
  Star,
  User,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function AdminHeader() {
  const pathname = usePathname();
  const moreAdminNavItems = [
    {
        name: "Reviews",
        path: "/admin/reviews",
        icon: <Star className="mr-2 h-4 w-4" />
    },
    // {
    //     name: "Users",
    //     path: "/admin/users",
    //     icon: <Users className="mr-2 h-4 w-4" />
    // },
    {
        name: "Unplaced carts",
        path: "/admin/unplaced-carts",
        icon: <ShieldQuestion className="mr-2 h-4 w-4" />
    },
    {
        name: "Temp Items",
        path: "/admin/temp-carts",
        icon: <ShieldX className="mr-2 h-4 w-4" />
    },
    {
        name: "Hidden products",
        path: "/admin/hidden-products",
        icon: <EyeOff className="mr-2 h-4 w-4" />
    }
  ]
  return (
    <header>
    <nav>
      <ul className='flex flex-nowrap justify-center py-2 bg-pink-500 text-white font-bold'>
      {adminNavItems.map((link) => {
            const isActive = link.path === pathname;

            return (
              <li key={link.path} className={` mx-2 md:mx-4 ${ 
                isActive ? 'text-black' : 'text-white'
              }`}>
                <Link href={link.path}>
                  {link.name}
                </Link>
              </li>
            )
          })}

<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <li className='text-white mx-2 md:mx-4 flex flex-nowrap items-center cursor-pointer'>
          More <ChevronDown />
        </li>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>

          {
            moreAdminNavItems.map((link) => {
              const isActive = link.path === pathname;
              return (
                <DropdownMenuItem key={link.path} 
                className={`${isActive && "text-blue-600 bg-gray-100"}`}>
                  <Link href={link.path}>
                  {link.icon}
                  </Link>
                  <Link href={link.path}>
                    <span className="ml-2">{link.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })
          }

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
      </ul>
    </nav>
  </header>
  )
}
