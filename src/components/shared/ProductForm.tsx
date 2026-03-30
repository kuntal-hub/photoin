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
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoriesName } from '@/lib/actions/category.action';
import { useAppSelector } from '@/lib/hooks';
import UpdateFeatures from './UpdateFeatures';
import CreateReviewForm from './CreateReviewForm';
import {
    createProduct,
    updateProduct,
    updatePhotos,
    deletePhoto,
    deleteProduct,
    chengeMainPhoto,
    updateFeatures,
    updateForms,
    deleteMainPhoto,
} from '@/lib/actions/product.action';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import CreateDynamicForm from './CreateDynamicForm';
import Image from 'next/image';

const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    badge: z.string().optional(),
    discountedPrice: z.number(),
    maxPrice: z.number(),
    designId: z.string().optional(),
    maxDeliveryDays: z.number().optional(),
    minDeliveryDays: z.number().optional(),
    rank: z.number().optional(),
})

type Schema = z.infer<typeof schema>

export default function ProductForm({ action, data }: { action: 'create' | 'update', data?: Product }) {
    const { toast } = useToast();
    const router = useRouter();
    const [catagoryes, setCatagoryes] = useState<Catagory[]>([]);
    const [selectedCatagory, setSelectedCatagory] = useState<string>(data?.catagory || '');
    const [features, setFeatures] = useState<string[]>(data?.features ? [...data.features] : []);
    const [forms, setForms] = useState<Form[]>(data?.forms ? [...data.forms] : []);
    const [mainPhoto, setMainPhoto] = useState<string>(data?.mainPhoto || '');
    const [photos, setPhotos] = useState<string[]>(data?.photos ? [...data.photos] : []);
    const [designId, setDesignId] = useState<string>(data?.designId || '');
    const [showCreateReviewForm, setShowCreateReviewForm] = useState(false);
    const adminId = useAppSelector(state => state.auth.adminId);

    const { register, handleSubmit } = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.name || '',
            description: data?.description || '',
            badge: data?.badge || '',
            discountedPrice: data?.discountedPrice || 0,
            maxPrice: data?.maxPrice || 0,
            designId: data?.designId || '',
            maxDeliveryDays: data?.maxDeliveryDays || 14,
            minDeliveryDays: data?.minDeliveryDays || 7,
            rank: data?.rank || 0,
        }
    })

    const onSubmitHandler = async (formData: Schema) => {
        if (!selectedCatagory) {
            toast({
                title: 'Please select a category',
                description: 'Please select a category for the product',
                duration: 5000,
                variant: "destructive"
            })
            return;
        }
        if (action === 'create') {
            const res = await createProduct({ ...formData, catagory: selectedCatagory });
            if (res) {
                toast({
                    title: 'Success',
                    description: 'Product has been created successfully',
                    duration: 5000,
                    className: 'bg-green-500'
                })
                router.push(`/admin/product/${res._id}`)
            } else {
                toast({
                    title: 'Something went wrong while creating',
                    description: 'Please try again',
                    duration: 5000,
                    variant: "destructive"
                })
            }
        } else if (action === 'update' && data) {
            const res = await updateProduct(data._id, { ...formData, catagory: selectedCatagory });
            if (res) {
                setDesignId(formData.designId || '');
                toast({
                    title: 'Success',
                    description: 'Product has been updated successfully',
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

    const updateFeaturesHandler = async () => {
        const res = await updateFeatures(data!._id, features);
        if (res) {
            toast({
                title: 'Success',
                description: 'Product features has been updated successfully',
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

    const deleteProductHandler = async () => {
        const res = await deleteProduct(data!._id);
        if (res) {
            toast({
                title: 'Success',
                description: 'Product has been deleted successfully',
                duration: 5000,
                className: 'bg-green-500'
            })
            router.push('/admin/products')
        } else {
            toast({
                title: 'Something went wrong while deleting',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    const onUploadErrorHandler = () => {
        toast({
            title: 'Something went wrong while uploading',
            description: 'Please try again',
            duration: 5000,
            variant: "destructive"
        })
    }

    const mainPhotoUploadSuccess = async (result: any) => {
        const res = await chengeMainPhoto(data!._id, result?.info?.secure_url)
        if (res) {
            setMainPhoto(result?.info?.secure_url)
            toast({
                title: 'Success',
                description: 'Product Photo has been updated successfully',
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

    const deleteMainPhotoHandler = async () => {
        const confirme = confirm('Are you sure you want to delete this image?');
        if (!confirme) {
            return;
        }
        const res = await deleteMainPhoto(data!._id);
        if (res) {
            setMainPhoto('');
            toast({
                title: 'Success',
                description: 'Product main photo has been deleted successfully',
                duration: 5000,
                className: 'bg-green-500'
            })
        } else {
            toast({
                title: 'Something went wrong while deleting',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    const onAllPhotostSUploaded = async (results: any) => {
        //console.log(results)
        const photos: string[] = []
        results?.info?.files.map((file: any) => photos.push(file.uploadInfo.secure_url as string))
        //console.log(photos)
        const res = await updatePhotos(data!._id, photos);
        if (res) {
            // console.log(res.photos)
            setPhotos(res.photos);
            toast({
                title: 'Success',
                description: 'Product photos has been updated successfully',
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

    const removeImage = async (photo: string) => {
        const res = await deletePhoto(data!._id, photo);
        if (res) {
            setPhotos(photos.filter(p => p !== photo));
            toast({
                title: 'Success',
                description: 'Product photo has been deleted successfully',
                duration: 5000,
                className: 'bg-green-500'
            })
        } else {
            toast({
                title: 'Something went wrong while deleting',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    const updateFormsHandler = async () => {
        if (forms.length === 0) {
            return toast({
                title: 'Please add some fields',
                description: 'Please add some fields to the form',
                duration: 5000,
                variant: "destructive"
            })
        }
        // console.log(forms)
        const res = await updateForms(data!._id, forms);
        if (res) {
            toast({
                title: 'Success',
                description: 'Product form has been updated successfully',
                duration: 4000,
                className: 'bg-green-500'
            })
        } else {
            toast({
                title: 'Something went wrong while updating',
                description: 'Please try again',
                duration: 4000,
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        getCategoriesName().then(data => {
            if (!data) {
                toast({
                    title: 'Something went wrong while fetching catagoryes',
                    description: 'Please try again',
                    duration: 5000,
                    variant: "destructive"
                })
            }
            setCatagoryes(data);
        })
    }, [])

    return (
        <div className='w-screen m-0 px-3 md:px-4 lg:px-8'>
            <h1 className='text-center text-2xl font-bold mt-3 mb-6 capitalize'>
                {action} product
            </h1>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <Label htmlFor='name'>Name <sup className='required'>*</sup></Label>
                        <Input {...register('name', { required: true })} type='text' required id='name' placeholder='Enter product name' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea {...register('description')} id='description' placeholder='Enter product description' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='badge'>Badge</Label>
                        <Input {...register('badge')} type='text' id='badge' placeholder='Enter product badge' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='maxPrice'>Max Price <sup className='required'>*</sup></Label>
                        <Input {...register('maxPrice', { required: true, valueAsNumber: true })} type='number' required id='maxPrice' placeholder='Enter product max price' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='discountedPrice'>Discounted Price <sup className='required'>*</sup></Label>
                        <Input {...register('discountedPrice', { valueAsNumber: true,required:true })} required type='number' id='discountedPrice' placeholder='Enter product discounted price' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='catagory'>Catagory <sup className='required'>*</sup></Label>
                        <Select required defaultValue={selectedCatagory}
                            onValueChange={(value) => setSelectedCatagory(value as string)}
                        >
                            <SelectTrigger className='bg-gray-100' >
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categoryes</SelectLabel>
                                    {
                                        catagoryes.map(catagory => (
                                            <SelectItem key={catagory._id} value={catagory._id}>
                                                {catagory.name}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor='designId'>Design Id</Label>
                        <Input {...register('designId')} type='text' id='designId' readOnly={data ? true : false} 
                        placeholder='Enter product design id' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='maxDeliveryDays'>Max Delivery Days</Label>
                        <Input {...register('maxDeliveryDays', { valueAsNumber: true })} type='number' id='maxDeliveryDays' placeholder='Enter product max delivery days' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='minDeliveryDays'>Min Delivery Days</Label>
                        <Input {...register('minDeliveryDays', { valueAsNumber: true })} type='number' id='minDeliveryDays' placeholder='Enter product min delivery days' className='bg-gray-100' />
                    </div>
                    <div>
                        <Label htmlFor='rank'>Rank</Label>
                        <Input {...register('rank', { valueAsNumber: true })} type='number' id='rank' placeholder='Enter product rank' className='bg-gray-100' />
                    </div>
                </div>

                <Button type='submit' className='block w-full max-w-md mx-auto my-8 bg-blue-600 hover:bg-blue-500'>
                    {action} product
                </Button>
            </form>
            {
                data && action === 'update' && <>
                    <hr />
                    <div className='py-6' >
                        {
                            mainPhoto ? <Image src={mainPhoto} alt='main photo' width={300} height={400}
                                className='object-contain w-[300px] h-[400px] block mx-auto my-3 rounded-md' /> :
                                <Skeleton className=' w-[300px] h-[400px] block mx-auto my-3 rounded-md' />
                        }
                        <p className='text-red-600 text-center font-bold'>
                            Aspect ratio 3:4 is recommended
                        </p>
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            onError={onUploadErrorHandler}
                            onSuccess={mainPhotoUploadSuccess}
                            options={{
                                multiple: false,
                                resourceType: "image",
                                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"]
                            }}>
                            {({ open }) => (
                                <Button onClick={() => open()} className='mt-3 bg-blue-600 hover:bg-blue-500 block mx-auto'>
                                    {
                                        mainPhoto ? 'Change Image' : 'Upload Image'
                                    }
                                </Button>
                            )}
                        </CldUploadWidget>
                        {mainPhoto && <Button onClick={deleteMainPhotoHandler}
                         className='mx-auto flex flex-nowrap mt-3 text-red-600' variant='outline'>
                            <Trash2 className='mr-2 h-4 w-4' /> <span>Remove Image</span>
                        </Button>}
                    </div>
                    <hr />
                    <div className='py-6'>
                        <div className='flex flex-wrap justify-center'>
                            {
                                photos.map(photo => (
                                    <div key={photo} className='relative block m-2'>
                                        <Image src={photo} alt='product photo' width={300} height={400}
                                            className='object-contain w-[300px] h-[400px] block mx-auto my-3 rounded-md' />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className='absolute top-4 right-2 bg-red-600 hover:bg-red-500 p-1 rounded-full text-white'>
                                                    <Trash2 size={24} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete this image.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => removeImage(photo)}
                                                    >Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>
                                ))
                            }
                        </div>
                        <p className='text-red-600 text-center font-bold'>
                            Aspect ratio 3:4 is recommended
                        </p>
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            onError={onUploadErrorHandler}
                            onQueuesEnd={onAllPhotostSUploaded}
                            options={{
                                multiple: true,
                                resourceType: "image",
                                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"]
                            }}>
                            {({ open }) => (
                                <Button onClick={() => open()} className='mt-3 bg-blue-600 hover:bg-blue-500 block mx-auto '>
                                    Upload more photos
                                </Button>
                            )}
                        </CldUploadWidget>
                    </div>
                    <hr />
                    <UpdateFeatures features={features} setFeatures={setFeatures} updateFeaturesHandler={updateFeaturesHandler} />
                    <hr />
                    {!designId && <CreateDynamicForm forms={forms} setForms={setForms} updateFormsHandler={updateFormsHandler} />}
                    <hr />
                    <Button onClick={() => setShowCreateReviewForm(true)}
                        className='block mx-auto my-12 bg-pink-500 hover:bg-pink-600'
                    >
                        Write a Review
                    </Button>
                    <hr />
                    <div className='flex flex-nowrap items-center h-44 justify-center'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className='bg-red-600 hover:bg-red-500 text-white'>
                                    <Trash2 size={20} /> <span className='ml-2'>
                                        Delete Product
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
                                        onClick={deleteProductHandler}
                                    >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {showCreateReviewForm && <CreateReviewForm
                        productId={data._id}
                        setShowCreateReviewForm={setShowCreateReviewForm}
                        addFakeName={true}
                        userId={adminId!} />}
                </>
            }
        </div>
    )
}
