'use client'
import React from 'react'

export default function ShareBtn({children,title,pathName,className,disabled=false}:{children:React.ReactNode,title:string,pathName:string,className:string,disabled?:boolean}) {

  const handleShare = async () => {
    const url = `${window.location.protocol}//${window.location.host}${pathName}`;
    if (window.navigator.share) {
      try {
        await window.navigator.share({
          title,
          url,
        });
        console.log('Share was successful.');
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      console.warn('Share API not supported in this browser.');
    }
  };

  return (
    <button className={className} disabled={disabled}
    onClick={handleShare}>
        {children}
    </button>
  )
}
