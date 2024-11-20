'use client';
import Image from 'next/image';
import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import Link from 'next/link';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';


const ImageSlider = ({ categoryies }: { categoryies: categoriesView[] }) => {
    return (
        <div className='w-full h-auto aspect-[7/4] bg-gray-200'>
            <Slide duration={3000}
                nextArrow={<button className='sm:bg-white p-1 rounded-full'>
                    <ChevronsRight className='md:w-6' />
                </button>}
                prevArrow={<button className='sm:bg-white p-1 rounded-full'>
                    <ChevronsLeft className='md:w-6' />
                </button>}
                pauseOnHover={true}
                transitionDuration={500}
            >
                {
                    categoryies.map((category, index) => (
                        <div className="each-slide-effect w-full" key={category._id}>
                            <Link href={`#${category._id}`} className='block w-full'  >
                                <Image src={category.banner!} alt="banner" width={1200} height={400} className='aspect-[7/4] w-full object-cover' />
                            </Link>
                        </div>
                    ))
                }
            </Slide>
        </div>
    );
};

export default ImageSlider;
