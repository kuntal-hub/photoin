import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function ShowImagesField({ field, inputClassname = 'bg-gray-100', removeField }: { field: Form, inputClassname?: string, removeField: (field: Form) => void }) {
    return (
        <div className='flex flex-nowrap items-center justify-between my-3'>
            {field.type === 'image' ? <>
                <div className='w-[86%]'>
                    <Label className='block text-center'>{field.label}
                        {field.isRequired && <sup className='text-red-500'> *</sup>}
                    </Label>
                    <Skeleton className=' w-[90px] h-[120px] block mx-auto my-2 rounded-md' />
                    <Button type='button' className='my-1 block mx-auto'>
                        Upload Image
                    </Button>
                    <p className='text-red-600 text-center text-[10px] font-semibold p-0 m-0 mb-3'>
                        {field.placeholder}
                    </p>
                    <hr />
                </div>
                <Button className='bg-red-500 text-white w-[10%] p-2 sm:p-3'
                    onClick={() => removeField(field)}
                ><Trash2 /></Button>
            </> : <>
                <div className='w-[86%]'>
                    <Label className='block text-center'>{field.label}
                        {field.isRequired && <sup className='text-red-500'> *</sup>}
                    </Label>
                    <div className='flex flex-wrap justify-center'>
                    {[...Array(field.minLength)].map((_, index) => (
                        <Skeleton key={index} className='w-[90px] h-[120px] m-2 rounded-md' />
                    ))}
                    </div>
                    <Button type='button' className='my-1 block mx-auto'>
                        Upload Images
                    </Button>
                    <p className='text-red-600 text-center text-[10px] font-semibold p-0 m-0 mb-3'>
                            {field.placeholder ? field.placeholder : `Upload minimum ${field.minLength} images`}
                        </p>
                        <hr />
                </div>
                <Button className='bg-red-500 text-white w-[10%] p-2 sm:p-3'
                    onClick={() => removeField(field)}
                ><Trash2 /></Button>
            </>}
        </div>
    )
}
