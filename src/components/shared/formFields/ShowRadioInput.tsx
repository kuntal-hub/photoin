import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import React from 'react'

export default function ShowRadioInput({ field,inputClassname = 'bg-gray-100',removeField }: { field: Form, inputClassname?: string, removeField: (field: Form) => void }) {
  return (
    <div className='flex flex-nowrap items-center justify-between mt-6 mb-4'>
      <div className='w-[86%]'>
        <Label htmlFor={field.label.replaceAll(" ", "_")} className='block mb-2'>{field.label}
          {field.isRequired && <sup className='text-red-500'> *</sup>}
        </Label>
        {
          field.radioOptions?.map((value, index) => {
            return <div key={index}>
              <input type="radio" value={value}
                name={field.label.replaceAll(" ", "_")}
                id={value.replaceAll(" ", "_")} />
              <label htmlFor={value.replaceAll(" ", "_")}> {value}</label>
            </div>
          })
        }
      </div>
      <Button 
      onClick={() => removeField(field)}
      className='bg-red-500 text-white w-[10%] p-2 sm:p-3'><Trash2 /></Button>
    </div>
  )
}
