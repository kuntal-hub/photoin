'use client';
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import NormalInputs from './formFields/NormalInputs';
import SelectField from './formFields/SelectField';
import ImagesField from './formFields/ImagesField';
import ShowNormalInputs from './formFields/ShowNormalInputs';
import ShowSelectInput from './formFields/ShowSelectInput';
import ShowRadioInput from './formFields/ShowRadioInput';
import ShowTextareaField from './formFields/ShowTextareaField';
import ShowImagesField from './formFields/ShowImagesField';
import { Button } from '../ui/button';
// import FormPreview from './FormPreview';


export default function CreateDynamicForm({ forms, setForms, updateFormsHandler }: { forms: Form[], setForms: React.Dispatch<React.SetStateAction<Form[]>>, updateFormsHandler: () => void }) {
  const [fieldType, setFieldType] = useState<string>('text');
  // console.log(forms)

  const addField = (data: any) => {
    // check if the field already exists
    const isFieldExists = forms.find(field => field.label === data.label)
    if (isFieldExists) {
      alert('Field already exists')
      return
    }
    setForms([...forms, { ...data, type: fieldType }])
  }

  const removeField = (field:Form) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this field?')
    if (!confirmDelete) return;
    setForms((prev) => prev.filter(f => f.label !== field.label))
  }

  return (
    <div className='mt-4 mb-8'>
      <h2 className='text-center font-bold text-xl mb-5'>Form Preview :</h2>
      <div className='w-full mx-auto max-w-[500px] rounded-lg border my-4 p-2'>
        {forms.length > 0 ? <div>
          {forms.map((field, index) => {
            if (field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' || field.type === 'time' || field.type === 'url' || field.type === 'checkbox') {
              return <ShowNormalInputs key={index} field={field} removeField={removeField} />
            } else if (field.type === 'select') {
              return <ShowSelectInput key={index} field={field} removeField={removeField} />
            } else if (field.type === 'radio') {
              return <ShowRadioInput key={index} field={field} removeField={removeField} />
            } else if (field.type === 'image' || field.type === 'images') {
              return <ShowImagesField key={index} field={field} removeField={removeField} />
            } else if (field.type === 'textarea') {
              return <ShowTextareaField key={index} field={field} removeField={removeField} />
            }
          })}

          <Button onClick={updateFormsHandler}
          className='bg-blue-600 hover:bg-blue-500 block mx-auto my-4'
          >
            Save Form Fields
          </Button>
        </div> : <p className='text-center p-4'>No fields added yet</p>}
      </div>
      <h2 className='text-center font-bold text-xl mb-5'>Form Fields :</h2>
      <div className='w-full max-w-[400px] mx-auto'>
        <div>
          <Label htmlFor='catagory'>Input Type <sup className='required'>*</sup></Label>
          <Select required defaultValue={fieldType}
            onValueChange={(value) => setFieldType(value as string)}
          >
            <SelectTrigger className='bg-gray-100' >
              <SelectValue placeholder="Select an input type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='text'>Text</SelectItem>
                <SelectItem value='email'>Email</SelectItem>
                <SelectItem value='number'>Number</SelectItem>
                <SelectItem value='date'>Date</SelectItem>
                <SelectItem value='time'>Time</SelectItem>
                <SelectItem value='url'>URL</SelectItem>
                <SelectItem value='checkbox'>Checkbox</SelectItem>
                <SelectItem value='textarea'>Textarea</SelectItem>
                <SelectItem value='select'>Select</SelectItem>
                <SelectItem value='radio'>Radio</SelectItem>
                <SelectItem value='image'>Image</SelectItem>
                <SelectItem value='images'>Images</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {
          (fieldType === 'text' || fieldType === 'email' || fieldType === 'number' || fieldType === 'date' || fieldType === 'time' || fieldType === 'url' || fieldType === 'checkbox' || fieldType === 'textarea') && <NormalInputs type={fieldType} addField={addField} />
        }

        {
          (fieldType === 'select' || fieldType === 'radio') && <SelectField addField={addField} type={fieldType} />
        }

        {
          (fieldType === 'image' || fieldType === 'images') && <ImagesField type={fieldType} addField={addField} />
        }
      </div>

    </div>
  )
}
