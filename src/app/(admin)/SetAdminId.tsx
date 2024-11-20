'use client';
import React from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { setAdminId } from '@/lib/features/authSlice';

export default function SetAdminId({adminId}:{adminId:string | null}) {
    const dispatch = useAppDispatch();
    dispatch(setAdminId(adminId));

  return (
    <div className='hidden'>
        
    </div>
  )
}
