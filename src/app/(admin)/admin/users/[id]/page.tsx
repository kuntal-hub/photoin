import React from 'react'
import { getUserDetails } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import Productcard from '@/components/shared/Productcard';
import { CopyText, CartSection, ReviewGalary, TempCartSection, TempReviewSection } from '@/components/ui/AllUsersComponents';
import { auth } from '@clerk/nextjs/server';

export default async function UserPage({ params }: { params: { id: string } }) {
  const user: UserDetils | null = await getUserDetails(params.id);
  const { userId } = auth()
  if (!userId) {
    return redirect('/sign-in')
  }
  if (!user) {
    return redirect('/admin/users')
  }
  // console.log(user)
  return (
    <div className='flex flex-wrap md:flex-nowrap justify-center'>
      <div className='max-w-full flex flex-col justify-start md:!sticky md:!top-5 h-[420px] p-4'>
        <img src={user.photo} alt="user photo" className='w-20 h-20 rounded-full' />
        <p className=' font-bold  text-black mt-4 mb-1'>{user.firstName} {user.lastName}</p>
        <p className='text-xs text-gray-500 mb-6'>
          Joined- {new Date(user.createdAt).toLocaleString()}
        </p>

        <CopyText title='Email' value={user.email} />

        <CopyText title='user ID' value={`${user._id.slice(0, 18)}...`} coppidValue={user._id} />

        <CopyText title='clerkId' value={user.clerkId.slice(0, 18) + "..."} coppidValue={user.clerkId} />


        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className='flex flex-nowrap justify-start items-center text-red-600 mt-6'>
              <Trash2 size={16} /> <span className='text-xs font-bold ml-2 p-3'>
                Delete User
              </span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                account and remove user data including their reviews, orders, carts and all other data. Delete the user in your own risk.
                Delete this user in your clerk account. click on continue to visit your clerk account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild className='text-white bg-red-500 hover:bg-red-600'>
                <a href={`https://dashboard.clerk.com/apps/app_2jea0O57IeyafS4jOpPthc0DyDY/instances/ins_2lFckHPaELAEKvfj2GvqDJpGoGQ/users/${user.clerkId}`} target="_blank" rel="noopener noreferrer">
                  Delete
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
      <div className='w-full flex flex-col md:max-w-[800px] p-2 sm:p-4'>
        <h2 className='text-xl font-bold mb-6 mt-3'>
          Orders:
        </h2>
        <div className=' shadow-md'>
          <table className='w-full rounded-md'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='py-2'>SL no.</th>
                <th className='py-2'>Total Amount</th>
                <th className='py-2'>Status</th>
                <th className='py-2'>
                  Delivery Status
                </th>
                <th className='py-2'>Placed At</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((order, i) => (
                <tr key={order._id} className=' cursor-pointer hover:bg-gray-100'>
                  <td>
                    <Link href={`/admin/order/${order._id}`} className='text-center py-2 w-full block'>
                      {i + 1}
                    </Link>
                  </td>
                  <td><Link href={`/admin/order/${order._id}`} className='text-center py-2 w-full block'>
                    {order.total}
                  </Link>
                  </td>
                  <td>
                    <Link href={`/admin/order/${order._id}`} className='text-center py-2 w-full block'>
                      {order.status}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/admin/order/${order._id}`} className='text-center py-2 w-full block'>
                      {order.deliveryStatus}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/admin/order/${order._id}`} className='text-center py-2 w-full block'>
                      {new Date(order.createdAt).toLocaleString()}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div><br />

        {user.wishlists.length > 0 && <>
          <h2 className='text-xl font-bold mb-4 mt-3'>
            Wishlist:
          </h2>
          <div className=' shadow-md flex flex-wrap justify-start p-2 '>
            {
              user.wishlists.map((product, i) => (
                <Productcard key={product._id} product={product} navLink={`/admin/product/${product._id}`} />
              ))
            }
          </div>
        </>}

        {
          user.cartItems.length > 0 && <>
            <br /><br />
            <h2 className='text-xl font-bold mb-6 mt-3'>
              Cart Items:
            </h2>
            <CartSection items={user.cartItems} />
          </>
        }

        {
          user.reviews.length > 0 && <>
            <br /><br />
            <h2 className='text-xl font-bold mb-1 mt-3'>
              Product Reviews:
            </h2>

            <ReviewGalary
              r={user.reviews.map(review => ({ ...review, user: { firstName: user.firstName, lastName: user.lastName, photo: user.photo, _id: user._id, clerkId: user.clerkId } }))} userId={userId}
            />
          </>
        }

        {
          user.addresses.length > 0 && <>
          <br /><br />
            <h2 className='text-xl font-bold mb-4 mt-3'>
              User Addresses:
            </h2>

            <div className=''>
              {
                user.addresses.map((address, i) => (
                  <p key={address._id}
                    className='text-sm w-full block bg-white shadow-md rounded-b-md p-4 text-gray-600'>
                    <span className='font-bold text-black'>
                      {address?.name} ({address?.phone})
                    </span><br />
                    {` ${address?.address}`}, {address?.locality}, {address?.landmark && address?.landmark + ','} {address?.district}, {address?.state} - <span className='text-black font-bold'>{address?.pinCode}</span>
                  </p>
                ))
              }
            </div>
          </>
        }


        {
          user.tempCarts.length > 0 && <>
          <br /><br />
            <h2 className='text-xl font-bold mb-1 mt-3'>
              Tempurary Carts:
            </h2>

            <TempCartSection
            c={user.tempCarts.map(cart => ({ ...cart, buyer: { firstName: user.firstName, lastName: user.lastName, _id: user._id, clerkId: user.clerkId, email:user.email } }))}
            />

          </>
        }


        {
          user.tempReviews.length > 0 && <>
          <br /><br />
            <h2 className='text-xl font-bold mb-1 mt-3'>
              Tempurary Reviews:
            </h2>

            <TempReviewSection
            r={user.tempReviews.map(review => ({_id:review._id, buyer: { firstName: user.firstName, lastName: user.lastName, photo: user.photo, _id: user._id, clerkId: user.clerkId,email: user.email },image:review.reviewImage }))}
            />
          </>
        }


      </div>
    </div>
  )
}
