'use client';
import React, { useState,memo,useRef,useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CldUploadWidget } from 'next-cloudinary';
import { useToast } from '../ui/use-toast';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { getPublicId } from '@/lib/helper';
import { useRouter } from 'next/navigation';
import { addTemp, removeImgFromTemp, getTemp } from '@/lib/actions/temp.action';
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
import { deleteAsset } from '@/lib/actions/helper.action';
import { addToCart,updateCart,updateCartImages } from '@/lib/actions/cart.action';
import { updateQuantity, updateProduct } from '@/lib/features/customizeProductsSlice';
import { useAppDispatch } from '@/lib/hooks';
import { resetCart } from '@/lib/features/cartSlice';
import { setCheckout } from '@/lib/features/checkoutSlice';

export default memo(function FormPreview({ product, inputClassname = 'bg-gray-100' }: { product:ProductViewForCustomization, inputClassname?: string }) {
    const form = [...product.forms];
    const { register, handleSubmit } = useForm();
    const [images, setImages] = useState<any>(product.cart?.formData?.images || {});
    const { toast } = useToast();
    const submitRef = useRef<HTMLInputElement>(null);
    const ClickedBtnRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();


    const onSubmit = async (data: any) => {
        for (let i = 0; i < form.length; i++) {
            if (form[i].type === 'image') {
                if (!images[form[i].label.replaceAll(" ", "_")]) {
                    router.push(`#${form[i].label.replaceAll(" ", "_")}`)
                    return toast({
                        description: `Please upload ${form[i].label} image`,
                        variant: 'destructive'
                    })
                }
            } else if (form[i].type === 'images') {
                if (!images[form[i].label.replaceAll(" ", "_")] || images[form[i].label.replaceAll(" ", "_")].length < form[i].minLength!) {
                    router.push(`#${form[i].label.replaceAll(" ", "_")}`)
                    return toast({
                        title: 'Minimum images not uploaded',
                        description: `Please upload minimum ${form[i].minLength} ${form[i].label} images`,
                        variant: 'destructive'
                    })
                }
            }
        }
        // console.log({ data, images: images })
        if (ClickedBtnRef.current && ClickedBtnRef.current.value === 'cart') {
            let res;
            if (product.cart && product.cart._id) {
                res = await updateCart({
                    productId: product._id,
                    formData:{data:data, images:images},
                    quantity: product.quantity,
                })
            } else {
                res = await addToCart({
                    productId: product._id,
                    formData:{data:data, images:images},
                    quantity: product.quantity,
                })
            }
            if (res) {
                dispatch(updateProduct({ ...product, cart: res }));
                dispatch(resetCart());
                router.push('/my-cart')
                toast({
                    title:"Added to cart",
                    description:"Product added to cart successfully",
                    className:"bg-green-500"
                })
            } else {
                toast({
                    title:"Something went wrong",
                    description:"Please try again",
                    variant:"destructive"
                })
            }
        } else if(ClickedBtnRef.current && ClickedBtnRef.current.value === 'buy') {
            dispatch(setCheckout({
                product:{
                    _id:product._id,
                    name:product.name,
                    description:product.description,
                    maxPrice:product.maxPrice,
                    discountedPrice:product.discountedPrice,
                    mainPhoto:product.mainPhoto,
                    maxDeliveryDays:product.maxDeliveryDays,
                    minDeliveryDays:product.minDeliveryDays,
                    badge:product.badge
                },
                formData:{data:data, images:images},
                quantity: product.quantity,
            }))
            router.push(`/checkout/${product._id}`);
        } else {
            toast({
                title:"Something went wrong",
                description:"Please try again",
                variant:"destructive"
            })
        }
    };

    const onUploadErrorHandler = () => {
        toast({
            title: 'Something went wrong while uploading',
            description: 'Please try again',
            duration: 5000,
            variant: "destructive"
        })
    }

    const onSingleImageUploadSuccessHandler = async (field: string, result: any) => {
        setImages((prevImages: any) => {
            return {
                ...prevImages,
                [field]: result?.info?.secure_url
            }
        })
        if (product.cart && product.cart._id) {
            const res = await updateCartImages({
                cartId: product.cart._id,
                fieldName: field,
                image: result?.info?.secure_url
            })
            dispatch(updateProduct({ ...product, cart: res }));
        } else {
            await addTemp({ productId: product._id, fieldName: field, value: result?.info?.secure_url })
        }
    }

    const onAllPhotostSUploaded = async (field: string, results: any) => {
        const photos: string[] = []
        results?.info?.files?.map((file: any) => photos.push(file.uploadInfo.secure_url as string))
        setImages((prevImages: any) => {
            return {
                ...prevImages,
                [field]: prevImages[field] ? [...prevImages[field], ...photos] : photos
            }
        })
        if (product.cart && product.cart._id) {
            const res = await updateCartImages({
                cartId: product.cart._id,
                fieldName: field,
                images: photos
            })
            console.log(res)
            dispatch(updateProduct({ ...product, cart: res }));
        } else {
            await addTemp({ productId: product._id, fieldName: field, value: photos })
        }
    }

    useEffect(() => {
        if (!product.cart || !product.cart.formData) {
            getTemp(product._id ).then((res) => {
                if (res) {
                    setImages(res.images)
                }
            })
        }
    },[])

    const removeImage = async (field: string, photo: string) => {
        const publicId = getPublicId({ url: photo });
        const result = await deleteAsset(publicId);
        if (result) {
            setImages((prevImages: any) => {
                return {
                    ...prevImages,
                    [field]: prevImages[field].filter((img: string) => img !== photo)
                }
            })
            if (product.cart && product.cart._id) {
                const res = await updateCartImages({
                    cartId: product.cart._id,
                    fieldName: field,
                    imgTodelete: photo
                })
                dispatch(updateProduct({ ...product, cart: res }));
            } else {
                await removeImgFromTemp({productId:product._id,fieldName:field,value:photo})
            }
        } else {
            toast({
                title: 'Something went wrong while deleting',
                description: 'Please try again',
                duration: 5000,
                variant: "destructive"
            })
        }
    }

    return (
        <div className='p-3 min-[420px]:px-4 md:px-8 bg-white shadow-lg rounded-lg'>
            <div className='flex flex-nowrap justify-start items-center mb-8 mt-2'>
                <span className='text-sm font-semibold mr-3'>
                Quantity: 
                </span>
                <Button onClick={() => {
                    if (product.quantity > 1) {
                        dispatch(updateQuantity({ productId: product._id, quantity: product.quantity - 1 }))
                    }
                }}
                variant='secondary' className='text-xl'>
                    -
                </Button>
                <Button variant='outline' disabled className='mx-1 font-bold text-black'>
                    {product.quantity}
                </Button>
                <Button onClick={() => {
                    if (product.quantity < 10) {
                        dispatch(updateQuantity({ productId: product._id, quantity: product.quantity + 1 }))
                    }
                }}
                variant='secondary' className='text-xl' >
                    +
                </Button>
            </div>
        {product.forms.length > 0 && <h1 className='text-lg font-semibold'>Fill the form to customize</h1>}
        <form onSubmit={handleSubmit(onSubmit)}>
            {
                form.map((field, index) => {
                    if (field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' || field.type === 'time' || field.type === 'url') {
                        return <div key={index} className='my-3'>
                            <Label htmlFor={field.label.replaceAll(" ", "_")}>{field.label}
                                {field.isRequired && <sup className='text-red-500'> *</sup>}
                            </Label>
                            <Input type={field.type}
                                className={inputClassname}
                                defaultValue={product.cart?.formData?.data[field.label.replaceAll(" ", "_")] || ''}
                                id={field.label.replaceAll(" ", "_")}
                                placeholder={field.placeholder}
                                required={field.isRequired}
                                {...register(field.label.replaceAll(" ", "_"), { required: field.isRequired })} />
                        </div>
                    } else if (field.type === 'select') {
                        return <div key={index} className='my-3'>
                            <Label htmlFor={field.label.replaceAll(" ", "_")} className='block mb-1'>{field.label}
                                {field.isRequired && <sup className='text-red-500'> *</sup>}
                            </Label>
                            <select
                                className={`w-full p-2 border border-gray-200 rounded-md ${inputClassname}`}
                                required={field.isRequired}
                                defaultValue={product.cart?.formData?.data[field.label.replaceAll(" ", "_")] || ''}
                                {...register(field.label.replaceAll(" ", "_"), { required: field.isRequired })}
                                id={field.label.replaceAll(" ", "_")}>
                                <option value="">Select a value</option>
                                {
                                    field.selectValues?.map((value, index) => {
                                        return <option key={index} value={value}>{value}</option>
                                    })
                                }
                            </select>
                        </div>
                    } else if (field.type === 'radio') {
                        return <div key={index} className='mt-6 mb-4'>
                            <Label htmlFor={field.label.replaceAll(" ", "_")} className='block mb-2'>{field.label}
                                {field.isRequired && <sup className='text-red-500'> *</sup>}
                            </Label>
                            {
                                field.radioOptions?.map((value, index) => {
                                    return <div key={index}>
                                        <input type="radio" value={value}
                                            required={field.isRequired}
                                            defaultChecked={product.cart?.formData?.data[field.label.replaceAll(" ", "_")] === value}
                                            {...register(field.label.replaceAll(" ", "_"), { required: field.isRequired })}
                                            id={value.replaceAll(" ", "_")} />
                                        <label htmlFor={value.replaceAll(" ", "_")}> {value}</label>
                                    </div>
                                })
                            }
                        </div>
                    } else if (field.type === 'textarea') {
                        return <div key={index} className='my-3'>
                            <Label htmlFor={field.label.replaceAll(" ", "_")}>{field.label}
                                {field.isRequired && <sup className='text-red-500'> *</sup>}
                            </Label>
                            <Textarea
                                className={inputClassname}
                                required={field.isRequired}
                                defaultValue={product.cart?.formData?.data[field.label.replaceAll(" ", "_")] || ''}
                                placeholder={field.placeholder}
                                {...register(field.label.replaceAll(" ", "_"), { required: field.isRequired })}
                                id={field.label.replaceAll(" ", "_")}></Textarea>
                        </div>
                    } else if (field.type === 'checkbox') {
                        return <div key={index} className='mt-6 mb-4'>
                            <input className='w-4 h-4'
                                type="checkbox"
                                id={field.label.replaceAll(" ", "_")}
                                required={field.isRequired}
                                defaultChecked={product.cart?.formData?.data[field.label.replaceAll(" ", "_")] || false}
                                {...register(field.label.replaceAll(" ", "_"), { required: field.isRequired })} />
                            <Label htmlFor={field.label.replaceAll(" ", "_")}> {field.label}
                                {field.isRequired && <sup className='text-red-500'> *</sup>}
                            </Label>
                        </div>
                    } else if (field.type === 'image') {
                        return <div className='my-3' key={index}  id={field.label.replaceAll(" ", "_")} >
                            <Label className='block text-center'>{field.label}
                                {field.isRequired && <sup className='text-red-500'> *</sup>}
                            </Label>
                            {
                                images[field.label.replaceAll(" ", "_")] ? <Image src={images[field.label.replaceAll(" ", "_")]} alt='Image' width={90} height={120}
                                    className='object-contain w-[90px] h-[120px] block mx-auto my-1 rounded-md' /> :
                                    <Skeleton className=' w-[90px] h-[120px] block mx-auto my-2 rounded-md' />
                            }
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_TEMP}
                                onError={onUploadErrorHandler}
                                onSuccess={(result) => onSingleImageUploadSuccessHandler(field.label.replaceAll(" ", "_"), result)}
                                options={{
                                    multiple: false,
                                    resourceType: "image",
                                    clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                                    sources: ["local", "url", "camera", 'google_drive', 'facebook', 'instagram'],
                                }}>
                                {({ open }) => (
                                    <Button type='button' onClick={() => open()} className='my-1 block mx-auto'>
                                        {
                                            images[field.label.replaceAll(" ", "_")] ? 'Change Image' : 'Upload Image'
                                        }
                                    </Button>
                                )}
                            </CldUploadWidget>
                            <p className='text-red-600 text-center text-[10px] font-semibold p-0 m-0 mb-3'>
                                {field.placeholder}
                            </p>
                            <hr />
                        </div>
                    } else if (field.type === 'images') {
                        return <div className='my-3' key={index} id={field.label.replaceAll(" ", "_")}>
                            <Label className='block text-center'>{field.label}
                                {field.isRequired && <sup className='text-red-500'> *</sup>}
                            </Label>
                            <div className='flex flex-wrap justify-center'>
                                {images[field.label.replaceAll(" ", "_")] ? <>
                                    {images[field.label.replaceAll(" ", "_")].map((photo: any) => (
                                        <div key={photo} className='relative block m-1'>
                                            <Image src={photo} alt='product photo' width={90} height={120}
                                                className='object-contain w-[90px] h-[120px] m-2 rounded-md' />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button type='button'
                                                        className='absolute top-4 right-2 bg-red-600 hover:bg-red-500 p-1 rounded-full text-white'>
                                                        <Trash2 size={20} />
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
                                                            onClick={() => removeImage(field.label.replaceAll(" ", "_"), photo)}
                                                        >Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </div>
                                    ))}
                                    {images[field.label.replaceAll(" ", "_")]?.length < field.minLength! && [...Array(field.minLength! - images[field.label.replaceAll(" ", "_")].length)].map((_, index) => (
                                        <Skeleton key={index} className='w-[90px] h-[120px] m-2 rounded-md' />
                                    ))}
                                </> : <div className='flex flex-wrap justify-center'>
                                    {[...Array(field.minLength)].map((_, index) => (
                                        <Skeleton key={index} className='w-[90px] h-[120px] m-2 rounded-md' />
                                    ))}
                                </div>
                                }
                            </div>

                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_TEMP}
                                onError={onUploadErrorHandler}
                                onQueuesEnd={(results) => onAllPhotostSUploaded(field.label.replaceAll(" ", "_"), results)}
                                options={{
                                    multiple: true,
                                    resourceType: "image",
                                    maxFiles: field.maxLength,
                                    clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                                    sources: ["local", "url", "camera", 'google_drive', 'facebook', 'instagram'],
                                }}>
                                {({ open }) => (
                                    <Button onClick={() => open()} className='my-1 block mx-auto ' type='button'
                                        disabled={images[field.label.replaceAll(" ", "_")]?.length >= field.maxLength!}
                                    >
                                        Upload Images
                                    </Button>
                                )}
                            </CldUploadWidget>
                            <p className='text-red-600 text-center text-[10px] font-semibold p-0 m-0 mb-3'>
                                {field.placeholder ? field.placeholder : `Upload minimum ${field.minLength} images`}
                            </p>
                            <hr />
                        </div>
                    }
                })
            }

            <input type="submit" ref={submitRef} className='hidden' value='Submit'/>
        </form>

        <input type="text" name="sample" id="sample" ref={ClickedBtnRef} className='hidden' readOnly />

        {product.forms.length > 0 && <p className='text-xs text-gray-600'>
            <strong className='mr-1 text-black'>
                Note<sup className='text-red-600'>*</sup> :
            </strong>
            We will edit the images according to the product and send you the softcopy on your whatsapp number or you can see the preview on our website orders section. And if you want to make any changes in the images then you can tell us and we will make the changes and send you the updated images.
        </p>}

        <Button onClick={()=> {
            if (ClickedBtnRef.current && submitRef.current) {
                ClickedBtnRef.current.value = "buy"
                submitRef.current.click()
            }
        }}
        className='mx-auto w-full block mb-2 mt-10 text-lg h-12 bg-pink-500 hover:bg-pink-600'>
            Buy Now
        </Button>

        <Button variant='outline' className='mx-auto w-full block my-2 text-lg h-12'
        onClick={() =>{
            if (ClickedBtnRef.current && submitRef.current) {
                ClickedBtnRef.current.value = "cart"
                submitRef.current.click()
            }
        }}
        >
            {(product.cart && product.cart._id) ? 'Update Cart' : 'Add to Cart'}
        </Button>
        </div>
    )
})
