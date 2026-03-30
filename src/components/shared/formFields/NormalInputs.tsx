'use client';
import React from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';

const schema = z.object({
    label: z.string(),
    placeholder: z.string().optional(),
    isRequired: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export default function NormalInputs({ type,addField }: { type: string,addField: (data: Schema) => void }) {
    const { register, handleSubmit, reset } = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            label: '',
            placeholder: '',
            isRequired: true,
        }
    });

    const onSubmit = (data: Schema) => {
        addField(data);
        reset();
    };

    return (
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

            <div className={`my-2 ${type === 'checkbox' && "hidden"}`}>
                <Label htmlFor='placeholder'>Field Placeholder </Label>
                <Input {...register('placeholder')} type='text' id='placeholder' placeholder='Enter placeholder about this field' className='bg-gray-100' />
            </div>

            <Button type='submit' className='mt-4'>Add Field</Button>
        </form>
    )
}
