import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function ShowNormalInputs({ field, inputClassname = 'bg-gray-100', removeField }: { field: Form, inputClassname?: string, removeField: (field: Form) => void }) {
  return (
    <div className='flex flex-nowrap items-center justify-between my-3'>
      {field.type === 'checkbox' ? <>
        <div className='w-[86%] pt-6 pb-4'>
          <input className='w-4 h-4'
            type="checkbox"
            id={field.label.replaceAll(" ", "_")}
            required={field.isRequired} />
          <Label htmlFor={field.label.replaceAll(" ", "_")}> {field.label}
            {field.isRequired && <sup className='text-red-500'> *</sup>}
          </Label>
        </div>
        <Button className='bg-red-500 text-white w-[10%] p-2 sm:p-3'
            onClick={() => removeField(field)}
          ><Trash2 /></Button>
      </> :
        <>
          <div className='w-[86%]'>
            <Label htmlFor={field.label.replaceAll(" ", "_")}>{field.label}
              {field.isRequired && <sup className='text-red-500'> *</sup>}
            </Label>
            <Input type={field.type}
              className={inputClassname}
              id={field.label.replaceAll(" ", "_")}
              placeholder={field.placeholder}
              required={field.isRequired} />
          </div>
          <Button className='bg-red-500 text-white w-[10%] p-2 sm:p-3'
            onClick={() => removeField(field)}
          ><Trash2 /></Button></>}
    </div>
  )
}
