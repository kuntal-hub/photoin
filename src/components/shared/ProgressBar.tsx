'use client';
import React from 'react'
import { Progress } from "@/components/ui/progress"
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function ProgressBar({ steps, progressValue, className, currentStep }: { steps: string[], progressValue: number, className?: string, currentStep: number }) {
  return (
    <div className={cn('mt-0 mb-6', className)}>
      <div className='flex flex-nowrap justify-between items-center relative h-[50%] mx-3 sm:mx-6'>
        <div className='w-full h-full items-center flex flex-nowrap justify-between  absolute top-0 left-0'>
          <div className={cn('p-1 w-5 h-5 rounded-full bg-green-600')}>
            <Check size={12} className='text-white font-bold' />
          </div>
          <Progress value={progressValue} className='w-full h-1 md:h-2 rounded-none bg-gray-300' />
          <div className={cn('p-1 w-5 h-5 rounded-full', progressValue >= 100 ? 'bg-green-600' : 'bg-gray-300')}>
            {progressValue >= 100 && <Check size={12} className='text-white font-bold' />}
          </div>
        </div>
        <div
          className='flex justify-between items-center w-full h-full z-10'
        >
          {steps.map((step, index) => (
              <div key={index} className={cn('p-1 w-5 h-5 rounded-full', index <= currentStep ? 'bg-green-600' : 'bg-gray-300', (index === 0 || index === steps.length - 1) && 'opacity-0')}>
                {index <= currentStep && <Check size={12} className='text-white font-bold' />}
              </div>
          ))}
        </div>
      </div>
      <div className='flex flex-nowrap justify-between items-center mt-1 w-full h-[50%]'>
        {steps.map((step, index) => (
            <p className={cn('text-xs md:text-sm font-bold', index <= currentStep ? 'text-primary' : 'text-gray-400')} key={index}>{step}</p>
        ))}
      </div>

    </div>
  )
}
