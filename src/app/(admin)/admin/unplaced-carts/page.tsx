'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getUnusedCartitems } from '@/lib/actions/cart.action';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { download, getPublicId } from '@/lib/helper';
import { deleteUnplacedCartItem, deleteALlUnplacedCarts } from '@/lib/actions/cart.action';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Trash2 } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

export default function UnplacedCartsPage({searchParams}:{searchParams:{days?:string}}) {
  const [unplacedCarts, setUnplacedCarts] = useState<UnplacedCartItems[]>([]);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  // const [days, setDays] = useState(30);
  const days = Number.parseInt(searchParams.days || '30');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { toast } = useToast();

  const setDays = (days: number) => {
    router.push(`/admin/unplaced-carts?days=${days}`);
  };

  const fatchCarts = async (page: number) => {
    setLoading(true);
    const response: UnplacedCartItems[] | null = await getUnusedCartitems(days, page, 25);
    if (response) {
      if (page === 1) {
        setUnplacedCarts(response);
      } else {
        setUnplacedCarts(priv => [...priv, ...response]);
      }
      setPage(page);
      setHasMore(response.length === 25);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch unplaced carts",
        variant: "destructive"
      })
    }
    setLoading(false);
  }

  const deleteSingleItem = async (id:string) => {
    const res = await deleteUnplacedCartItem(id);
    if (res) {
      setUnplacedCarts(prev => prev.filter(cart => cart._id !== id));
      toast({
        title: "Success",
        description: "Cart deleted successfully",
        className:"bg-green-500"
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete cart",
        variant: "destructive"
      })
    }
  }

  const deleteAll = async () => {
    const publicIds: string[] = [];
    const cartIds: string[] = [];
    unplacedCarts.map((cart, i) => {
      cartIds.push(cart._id);
      if (cart.processedImage) {
        const publicId = getPublicId({ url: cart.processedImage });
        publicIds.push(publicId);
      } else if (cart.formData && cart.formData.images) {
        for (const i in cart.formData.images) {
          if (Array.isArray(cart.formData.images[i])) {
            cart.formData.images[i].forEach((img: string) => {
              publicIds.push(getPublicId({ url: img }));
            });
          } else {
            publicIds.push(getPublicId({ url: cart.formData.images[i] }));
          }
        }
      }
    })
    const res = await deleteALlUnplacedCarts(cartIds, publicIds);
    if (res) {
      setUnplacedCarts([]);
      setPage(1);
      toast({
        title: "Success",
        description: "All unplaced carts deleted successfully",
        className:"bg-green-500"
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete unplaced carts",
        variant: "destructive"
      })
    }
  }

  const onSubmit = async (data: any) => {
    if ((Number.parseInt(data.days) !== days) && (Number.parseInt(data.days) >= 0)) {
      setDays(Number.parseInt(data.days));
    }
  };

  useEffect(() => {
    fatchCarts(1);
  }, [days]);

  return (
    <div className=' bg-gray-100 min-h-screen'>
      <div className='flex justify-between flex-wrap items-center p-4 md:px-8'>
        <div className='w-full sm:w-[48%]'>
          <h1 className="text-xl font-bold">Unplaced carts</h1>
          <p className="text-gray-500 text-sm">
            These are carts that were created {days} days ago and have not been placed.
          </p>
        </div>
        <form className='mt-4 sm:mt-0 min-w-80' onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor='days'>
            Show carts created at least
          </Label>
          <div className='flex flex-nowrap justify-start'>
            <Input type="number" required placeholder="Days" id='days' min={0} max={365}
              defaultValue={days}
              {...register('days', { required: true, valueAsNumber: true })}
            />

            <Button type='submit' className='bg-green-600 hover:bg-green-500 ml-1'>
              Filter
            </Button>
          </div>
        </form>
      </div>

      {
        loading ? <div className='fixed top-0 left-0 w-screen h-screen grid place-content-center bg-black/70 z-50'>
          <div>
            <div className='loader2'>

            </div>
            <p className='text-center text-white font-bold my-2'>
              Loading...
            </p>
          </div>
        </div> :
          <div>
            {
              unplacedCarts.length > 0 ?
                <div className='w-[94%] max-w-[900px] mx-auto'>
                  {
                    unplacedCarts.map((cart) => (
                      <div key={cart._id}
                        className='flex flex-nowrap justify-between bg-white rounded-sm shadow-lg my-3'>
                        <div className='flex p-2 sm:p-4'>
                          <div className='w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] bg-gray-200 rounded-sm overflow-hidden'>
                            {cart.product.mainPhoto ?
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Image src={cart.product.mainPhoto}
                                    alt="product image"
                                    width={120} height={160}
                                    className='w-full h-full object-cover cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[450px]">
                                  <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>

                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className=' relative'>
                                    <Image src={cart.product.mainPhoto}
                                      alt='product image' width={450} height={600}
                                      className='w-full' />
                                    <button
                                      onClick={() => download(cart.product.mainPhoto, new Date().toISOString())}
                                      className=' absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-sm'
                                    >
                                      <Download />
                                    </button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              : <Skeleton className='w-full h-full' />
                            }
                          </div>
                          <div className='flex flex-col ml-4'>
                            <p className='text-sm sm:text-lg font-bold'>{cart.product.name} </p>
                            <p className='p-0'>
                              <span className='text-xs text-red-600 line-through'>&#8377; {cart.product.maxPrice}</span>
                              <span className=' text-sm ml-5 text-green-600'>
                                &#8377; {cart.product.discountedPrice} Only</span>
                            </p> <hr />
                            <p className='text-xs '>
                              <strong className='mr-2'>
                                Name :
                              </strong>
                              {cart.buyer.firstName} {cart.buyer.lastName}
                            </p>
                            <p className='text-xs'>
                              <strong className='mr-2'>
                                Email :
                              </strong>
                              {cart.buyer.email}
                            </p> <hr />
                            {
                              cart.processedImage && <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant='link' className='text-blue-600' >
                                    Printable Image
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[450px]">
                                  <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>

                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className=' relative'>
                                    <Image src={cart.processedImage}
                                      alt='product image' width={450} height={600}
                                      className='w-full max-h-[70vh]' />
                                    <button
                                      onClick={() => download(cart.processedImage!, new Date().toISOString())}
                                      className=' absolute top-0 right-0 p-2 bg-blue-600 text-white rounded-bl-sm'
                                    >
                                      <Download />
                                    </button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            }

                            {
                              cart.formData?.data && <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant='link' className='text-blue-600' >
                                      Provided Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Customer Provided Details
                                      </DialogTitle>
                                      <DialogDescription>
                                        Those are the details provided by the customer and required to prepare the printable image.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <ul>
                                      {
                                        cart.formData && cart.formData.data && (Object.keys(cart.formData.data).map((item, i) => (
                                          <li className="flex justify-start text-xs min-[375px]:text-sm my-1 items-center" key={i}>
                                            <strong>
                                              {item.replaceAll('_', ' ')} :
                                            </strong>
                                            <span className='ml-2'>
                                              {`${cart.formData?.data[item]}`}
                                            </span>
                                          </li>
                                        )))
                                      }
                                    </ul>
                                  </DialogContent>
                                </Dialog>
                              </>
                            }

                            {
                              cart.formData?.images && <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant='link' className='text-blue-600' >
                                    Provided Images
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Customer Provided Images
                                    </DialogTitle>
                                    <DialogDescription>
                                      Those are the images provided by the customer and required to prepare the printable image.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {
                                    cart.formData && cart.formData.images && (Object.keys(cart.formData.images).map((item, i) => (
                                      <div key={i}>
                                        <h2 className='font-bold my-2'>
                                          {item.replaceAll('_', ' ')} :
                                        </h2>
                                        <div className='flex flex-wrap justify-start'>
                                          {Array.isArray(cart.formData?.images[item]) ? <>
                                            {
                                              cart.formData?.images[item].map((img, i) => (
                                                <div className='m-1 relative' key={i}>
                                                  <Image src={img}
                                                    alt='provided image' width={120} height={160}
                                                    className='object-cover max-w-[120px] max-h-[160px]' />

                                                  <button onClick={() => download(img, new Date().toISOString())}
                                                    className=' absolute top-0 left-0 bg-green-600 hover:bg-green-500 text-white p-1'>
                                                    <Download size={18} />
                                                  </button>
                                                </div>
                                              ))
                                            }
                                          </> :
                                            <div className='m-1 relative'>
                                              <Image src={cart.formData?.images[item]}
                                                alt='provided image' width={120} height={160}
                                                className='max-w-[120px] max-h-[160px] object-cover' />

                                              <button onClick={() => download(cart.formData?.images[item], new Date().toISOString())}
                                                className=' absolute top-0 left-0 bg-green-600 hover:bg-green-500 text-white p-1'>
                                                <Download size={18} />
                                              </button>
                                            </div>
                                          }
                                        </div>
                                      </div>
                                    )))
                                  }
                                </DialogContent>
                              </Dialog>
                            }
                          </div>

                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className='mr-2 mt-2 sm:mt-4 sm:mr-4 bg-red-600 hover:bg-red-500'>
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this cartItem
                                and remove your data from servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteSingleItem(cart._id)}
                                className='bg-red-600 hover:bg-red-500'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>
                    ))
                  }

                  {hasMore && <Button onClick={() => fatchCarts(page + 1)}
                    className='block mx-auto my-10'
                  >
                    See more
                  </Button>}

                  <div className='w-full sticky bottom-0 shadow-top-md p-4 flex flex-wrap bg-white z-20 justify-between items-center'>
                    <p className='font-bold '>
                      Delete {unplacedCarts.length} Items
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className='bg-red-500 hover:bg-red-600 font-bold h-12 w-48 mt-6 min-[483px]:mt-0'>
                          Delete All
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all cartItems
                            and remove your data from servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={deleteAll}
                            className='bg-red-600 hover:bg-red-500'
                          >
                            Delete ALl
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div> :
                <div className='flex justify-center items-center h-64'>
                  <p className='text-xl text-gray-500'>
                    No unplaced carts 🫡
                  </p>
                </div>
            }
          </div>
      }
    </div>
  )
}
