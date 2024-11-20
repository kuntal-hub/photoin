'use client';
import React from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { setUserId } from '@/lib/features/authSlice';

export default function SetUserId({userId}:{userId:string | null}) {
    const dispatch = useAppDispatch();
    dispatch(setUserId(userId));
  return (
    <div className='hidden'>
        
    </div>
  )
}