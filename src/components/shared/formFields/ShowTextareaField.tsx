import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function ShowTextareaField({ field, inputClassname = 'bg-gray-100', removeField }: { field: Form, inputClassname?: string, removeField: (field: Form) => void }) {
    return (
        <div className='flex flex-nowrap items-center justify-between my-3'>
            <div className='w-[86%]'>
                <Label htmlFor={field.label.replaceAll(" ", "_")}>{field.label}
                    {field.isRequired && <sup className='text-red-500'> *</sup>}
                </Label>
                <Textarea
                    className={inputClassname}
                    required={field.isRequired}
                    placeholder={field.placeholder}
                    id={field.label.replaceAll(" ", "_")}></Textarea>
            </div>
            <Button className='bg-red-500 text-white w-[10%] p-2 sm:p-3'
                onClick={() => removeField(field)}
            ><Trash2 /></Button>
        </div>
    )
}
