'use client'
import React from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { setCategoriesName as setcategories } from '@/lib/features/tempSlice'
import { useEffect } from 'react'

export default function SetCategoriesName({categoriesName}:{categoriesName: {name:string,id:string}[]}) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setcategories(categoriesName))
    }, [])
  return (
    <div className='hidden' hidden>setCategoriesName</div>
  )
}
