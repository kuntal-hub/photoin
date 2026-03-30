'use client';
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { createCategory,updateCategory,deleteCategory } from '@/lib/actions/category.action';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image';
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
import { Trash2 } from 'lucide-react';

const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    rank: z.number().optional(),
})

type Schema = z.infer<typeof schema>

export default function CatagoryForm({ action, data = null }: CatagoryFormParams) {
    const [logo, setLogo] = useState<string>(data?.logo || '');
    const [banner, setBanner] = useState<string>(data?.banner || '');
    const { toast } = useToast();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.name || '',
            description: data?.description || '',
            rank: data?.rank || 0
        }
    })

    const onSubmit = async (formData: Schema) => {
        if (action === "create") {
            const result = await createCategory(formData);
            if (result) {
                toast({
                    title: 'Success',
                    description: 'Category has been created successfully',
                    duration: 5000,
                    className: 'bg-green-500'
                })
                router.push(`/admin/category/${result._id}`)
            } else {
                toast({
                    title: 'Something went wrong while creating',
                    description: 'Please try again',
                    duration: 5000,
                    variant: "destructive"
                })
            }
        } else if (action === "update" && data) {
            const result = await updateCategory(data._id,formData);
            if (result) {
                toast({
                    title: 'Success',
                    description: 'Category has been updated successfully',
                    duration: 5000,
                    className: 'bg-green-500'
                })
            } else {
                toast({
                    title: 'Something went wrong while updating',
                    description: 'Please try again',
                    duration: 5000,
                    variant: "destructive"
                })
            }
        }
    }

    const onUploadErrorHandler = () => {
        toast({
          title: 'Something went wrong while uploading',
          description: 'Please try again',
          duration: 5000,
          variant:"destructive" 
        })
    }

    const onUploadLogoSuccess = async (result:any)=>{
        const res = await updateCategory(data!._id,{logo:result?.info?.secure_url})
        if (res) {
            setLogo(result?.info?.secure_url)
            toast({
                title: 'Success',
                description: 'Category logo has been updated successfully',
                duration: 5000,
                className: 'bg-green-500'
            })
        } else {
            toast({
                title: 'Something went wrong while updating',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    const onUploadBannerSuccess = async (result:any)=>{
        const res = await updateCategory(data!._id,{banner:result?.info?.secure_url})
        if (res) {
            setBanner(result?.info?.secure_url)
            toast({
                title: 'Success',
                description: 'Category banner has been updated successfully',
                duration: 5000,
                className: 'bg-green-500'
            })
        } else {
            toast({
                title: 'Something went wrong while updating',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    const deleteCategoryHandler = async ()=>{
        const result = await deleteCategory(data!._id);
        if (result) {
            toast({
                title: 'Success',
                description: 'Category has been deleted successfully',
                duration: 5000,
                className: 'bg-green-500'
            })
            router.push('/admin/categories')
        } else {
            toast({
                title: 'Something went wrong while deleting',
                description: 'Category is not empty',
                duration: 5000,
                variant: "destructive"
            })
        }
    }


    return (
        <div className='w-screen'>
            <h1 className='text-center text-2xl font-bold mt-3 mb-6 capitalize'>
                {action} category
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className='p-3'>
                <div className="grid w-full max-w-md items-center gap-1.5 mx-auto my-3">
                    <Label htmlFor="name">Category name  <sup className='required'>*</sup>:</Label>
                    <Input type="text" id="name" placeholder="Type catagory name here." className='bg-gray-200'
                        required
                        {...register('name', { required: true })} />

                </div>

                <div className="grid w-full max-w-md items-center gap-1.5 mx-auto mt-8">
                    <Label htmlFor="desc">Category description :</Label>
                    <Textarea id="desc" placeholder="Type catagory description here." className='bg-gray-200'
                        {...register('description')}
                    />
                </div>

                <div className="grid w-full max-w-md items-center gap-1.5 mx-auto mt-8">
                    <Label htmlFor="desc">Rank :</Label>
                    <Input type='number' id="desc" placeholder="Type catagory description here." className='bg-gray-200'
                        {...register('rank',{valueAsNumber:true,required:true})}
                    />
                </div>
                <Button type='submit' className='block w-full max-w-md mx-auto my-3 bg-blue-600 hover:bg-blue-500'>
                    {action} category
                </Button>
            </form>

            { data && action==='update' && <>

            <div >
                {
                    logo ? <Image src={logo} alt='category logo' width={320} height={320}
                    className='object-contain w-60 h-60 block mx-auto my-3 rounded-md' /> : 
                    <Skeleton className=' w-60 h-60 block mx-auto my-3 rounded-md' />
                }
                <p className='text-red-600 text-center font-bold'>
                    Aspect ratio 1:1 is recommended for logo
                </p>
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onError={onUploadErrorHandler}
                    onSuccess={onUploadLogoSuccess}
                    options={{
                        multiple: false,
                        resourceType: "image",
                        clientAllowedFormats: ["png", "jpg", "jpeg", "webp"]
                    }}>
                    {({ open }) => (
                        <Button onClick={() => open()} className='mt-3 bg-blue-600 hover:bg-blue-500 block mx-auto'>
                            {
                                logo ? 'Update logo' : 'Upload logo'
                            }
                        </Button>
                    )}
                </CldUploadWidget>
            </div>
            <div className='pb-10'>
                {
                    banner ? <Image src={banner} alt='category banner' width={900} height={300}
                    className='object-contain w-[90%] md:w-[70%] aspect-[3/1] h-60 block mx-auto my-3 rounded-md' /> :
                    <Skeleton className='w-[90%] md:w-[70%] aspect-[3/1] h-60 block mx-auto my-3 rounded-md' />
                }
                <p className='text-red-600 text-center font-bold'>
                    Aspect ratio 3:1 is recommended for banner
                </p>
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onError={onUploadErrorHandler}
                    onSuccess={onUploadBannerSuccess}
                    options={{
                        multiple: false,
                        resourceType:"image",
                        clientAllowedFormats:["png","jpg","jpeg","webp"]
                    }}>
                    {({ open }) => (
                        <Button onClick={() => open()} className='mt-3 bg-blue-600 hover:bg-blue-500 block mx-auto '>
                            {
                                banner ? 'Update banner' : 'Upload banner'
                            }
                        </Button>
                    )}
                </CldUploadWidget>
            </div>

            <div className='flex flex-nowrap items-center h-44 justify-center'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className='bg-red-600 hover:bg-red-500 text-white'>
                                    <Trash2 size={20} /> <span className='ml-2'>
                                        Delete category
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this product.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className='bg-red-600 hover:bg-red-500 text-white'
                                        onClick={deleteCategoryHandler}
                                    >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

            </>}

        </div>
    )
}
