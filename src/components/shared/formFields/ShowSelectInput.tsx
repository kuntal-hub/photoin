import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function ShowSelectInput({ field, inputClassname = 'bg-gray-100',removeField }: { field: Form, inputClassname?: string, removeField: (field: Form) => void }) {
  return (
    <div className='flex flex-nowrap items-center justify-between my-3'>
      <div className='w-[86%]'>
        <Label htmlFor={field.label.replaceAll(" ", "_")} className='block mb-1'>{field.label}
          {field.isRequired && <sup className='text-red-500'> *</sup>}
        </Label>
        <select
          className={`w-full p-2 border border-gray-200 rounded-md ${inputClassname}`}
          required={field.isRequired}
          id={field.label.replaceAll(" ", "_")}>
          <option value="">Select a value</option>
          {
            field.selectValues?.map((value, index) => {
              return <option key={index} value={value}>{value}</option>
            })
          }
        </select>

      </div>
      <Button 
      onClick={() => removeField(field)}
      className='bg-red-500 text-white w-[10%] p-2 sm:p-3'><Trash2 /></Button>
    </div>
  )
}
