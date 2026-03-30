import React from 'react'
import { getAllUsers } from '@/lib/actions/user.action'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default async function UsersPage({searchParams}:{searchParams:{page:string,limit:string}}) {
  const page = parseInt(searchParams.page) || 1
  const limit = parseInt(searchParams.limit) || 25
  const responce:{users:User[],totalUsers:number} | null = await getAllUsers(page,limit)
  if (!responce) {
    return redirect('/admin')
  }
  const hasNext = responce?.totalUsers > page*limit
  const users = responce?.users

  return (
    <div className='w-full bg-gray-100 min-h-screen py-7'>
        <h1 className='text-2xl mb-5 font-bold text-center'>Users</h1>
      <div className='w-[96%] max-w-[900px] mx-auto rounded-md bg-white shadow-md'>
        <table className='w-full'>
          <thead className=' bg-gray-200/20'>
            <tr className='w-full px-4 py-2'>
              <th className='p-2'>USER</th>
              <th className='p-2'>ID</th>
              <th className='p-2'>Joined</th>
              <th className='p-2'>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className=' cursor-pointer hover:bg-gray-200 w-full px-4'>
                <td>
                <Link href={`/admin/users/${user._id}`} className='py-2 px-4 flex flex-nowrap justify-start items-center'>
                  <img src={user.photo} alt="user photo" className='rounded-full w-11 h-11 mr-2' />
                  <div className='flex flex-col'>
                    <p className='font-bold text-sm'>{user.firstName} {user.lastName}</p>
                    <p className='text-xs text-gray-600'>{user.email}</p>
                  </div>
                </Link>
                </td>
                <td>
                  <Link href={`/admin/users/${user._id}`} className='p-2 text-sm'>
                  {user._id}
                  </Link>
                  </td>
                <td>
                <Link href={`/admin/users/${user._id}`} className='p-2 text-sm'>
                  {new Date(user.createdAt).toLocaleString()}
                </Link>
                </td>
                <td>
                <Link href={`/admin/users/${user._id}`} className='p-2 text-sm'>
                  {new Date(user.updatedAt).toLocaleString()}
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    <div className='my-12'>
      <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className='hover:underline' href={(page > 1) ? `/admin/users?page=${page-1}&limit=${limit}` : "#"} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`/admin/users?page=${1}&limit=${limit}`} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>
        {page > 1 && <PaginationItem>
          <PaginationLink href={`/admin/users?page=${2}&limit=${limit}`} isActive={page === 2}>
            2
          </PaginationLink>
        </PaginationItem>}
        {page > 2 && <PaginationItem>
          <PaginationLink href={`/admin/users?page=${3}&limit=${limit}`} isActive={page === 3}>
            3
          </PaginationLink>
        </PaginationItem>}
        {page > 3 && <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>}
        <PaginationItem>
          <PaginationNext className='hover:underline' href={hasNext ? `/admin/users?page=${page+1}&limit=${limit}` : "#"} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div>
    </div>
  )
}
