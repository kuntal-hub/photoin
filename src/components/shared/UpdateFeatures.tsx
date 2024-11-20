import React from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';

const schema = z.object({
    feature: z.string()
});

type FormValues = z.infer<typeof schema>;

export default function UpdateFeatures({ features,setFeatures,updateFeaturesHandler }: { features: string[], setFeatures: React.Dispatch<React.SetStateAction<string[]>>, updateFeaturesHandler: () => void }) {

    const { register, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { feature: '' }
    });

    const onSubmit = (data:{feature:string}) => {
        setFeatures([...features, data.feature]);
        reset();
    };

  return (
    <div className=' mt-4 mb-8'>
        <h2 className='text-center font-bold text-xl mb-5'>Features :</h2>
        <div className=' border p-3 mb-3 rounded-lg bg-gray-100'>
        {
            features.map((feature, index) => (
                <div key={index} className='flex items-center justify-center mb-2'>
                    <Input
                    type='text'
                    readOnly
                    value={feature}
                    className='rounded-full px-3 py-2 max-w-80 mr-3 bg-gray-200' />
                    <Button onClick={() => {
                        setFeatures(features.filter((_, i) => i !== index));
                    } }
                    className=' bg-red-600 hover:bg-red-500'>
                        <Trash2 size={20} />
                    </Button>
                </div>
            ))
        }
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex items-center justify-center'>
            <Input
                type='text'
                placeholder='Type a feature...'
                required
                {...register('feature',{required:true})}
                className='rounded-full bg-gray-100 max-w-80 px-3 mr-3 py-2' />
            <Button type='submit' className='bg-green-600 hover:bg-green-500'>
                Add
            </Button>
        </form>
        <Button onClick={updateFeaturesHandler} className='mt-6 block mx-auto bg-blue-600 hover:bg-blue-500'>
            save changes
        </Button>

    </div>
  )
}
