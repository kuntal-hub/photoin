'use client';
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react'

const schema = z.object({
    label: z.string(),
    isRequired: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export default function SelectField({ addField, type }: { addField: (data: any) => void, type: string }) {
    const submitRef = useRef<HTMLButtonElement>(null);
    const [options, setOptions] = useState<string[]>([]);
    const { register, handleSubmit, reset } = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            label: '',
            isRequired: true,
        }
    });

    const onSubmit = (data: Schema) => {
        if (options.length < 2) {
            return alert('Please add at least two options');
        }
        if (type === 'select') {
            addField({ ...data, selectValues: options });
        } else if (type === 'radio') {
            addField({ ...data, radioOptions: options });
        }
        reset();
        setOptions([]);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='my-2'>
                    <Label htmlFor='name'>Field Name <sup className='required'>*</sup></Label>
                    <Input {...register('label', { required: true })} type='text' required id='name' placeholder='Enter field name' className='bg-gray-100' />
                </div>

                <div className="flex items-center space-x-2 my-4">
                    <input type="checkbox" id="terms" className='w-4 h-4'
                        {...register('isRequired')}
                    />

                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Is this field required? <sup className='required'>*</sup>
                    </label>
                </div>

                <Button type='submit' ref={submitRef} className='hidden'>Add Field</Button>
            </form>
            <div className='my-8'>
                <h3 className='text-lg font-bold mb-2'>Options</h3>

                {options.map((option, index) => (
                    <div className='flex flex-nowrap justify-between my-1' key={index}>
                        <Input type='text' value={option} readOnly className='bg-gray-100 w-[88%]' />
                        <Button onClick={() => setOptions(options.filter((_, i) => i !== index))}
                            className='w-[10%] p-2 bg-red-500 hover:bg-red-600'
                        ><Trash2 size={20} /></Button>

                    </div>
                ))}

                <AddOption options={options} setOptions={setOptions} />
            </div>
            <Button onClick={() => submitRef.current?.click()}
            className='mb-4 block mx-auto bg-blue-600 hover:bg-blue-500'>Add Field</Button>
        </div>
    )

}

const optionSchema = z.object({
    value: z.string(),
});

type OptionSchema = z.infer<typeof optionSchema>;

function AddOption({ options, setOptions }: { options: string[], setOptions: React.Dispatch<React.SetStateAction<string[]>> }) {

    const { register, handleSubmit, resetField } = useForm<OptionSchema>({
        resolver: zodResolver(optionSchema),
        defaultValues: {
            value: '',
        }
    });

    const addOption = (data: OptionSchema) => {
        // check if the option already exists
        const isOptionExists = options.find(option => option === data.value)
        if (isOptionExists) {
            alert('Option already exists')
            resetField('value');
            return
        }
        setOptions([...options, data.value]);
        resetField('value');
    }

    return (
        <form onSubmit={handleSubmit(addOption)} className='flex flex-nowrap justify-between my-4'>
            <div className='w-[88%]'>
                <Input {...register('value', { required: true })} type='text' required id='option' placeholder='Type an option here' className='bg-gray-100' />
            </div>
            <Button type='submit' className='w-[10%]'>Add</Button>
        </form>
    )
}
