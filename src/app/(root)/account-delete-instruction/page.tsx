import Footer from '@/components/shared/Footer'
import { email } from '@/constants'
import React from 'react'

export default function page() {
    return (
        <div>
            <div className='flex flex-col justify-center max-w-[800px] mx-auto items-center text-left px-4 sm:px-8 pb-10 md:px-12'>
                <p className='text-8xl text-center my-10'>
                    🥺
                </p>

                <p>
                    {"We're sorry to see you go! but we understand that sometimes things don't work out. Before you go, we'd love to hear your feedback on how we can improve our services. Please feel free to reach out to us at"} <a href={`mailto:${email}`} className='text-blue-600'>{email}</a>.
                </p>

                <p className='mt-8 text-left w-full'>
                    {"If you're sure you want to delete your account, please follow the instructions below:"}
                </p><br />

                <p>
                    <strong>1. </strong> {`Click on the "Profile Icon" button on the top right corner of the page if you use a desktop or bottom navbar if you use a mobile device.`}
                </p>

                <img src="WhatsApp Image 2024-09-28 at 12.29.24 AM.jpeg" alt="help" className='max-w-[300px] my-5' />

                <p>
                    <strong>2. </strong> {`After clicking on the profile icon, you will see a dropdown menu. then click on the "Manage Account" option.`}
                </p>

                <img src="WhatsApp Image 2024-09-28 at 12.29.59 AM.jpeg" alt="help" className='max-w-[300px] my-5' />

                <p>
                    <strong>3. </strong> {`After clicking on the "Manage Account" option, you will see a Menu button. Click on the button to to see all the options. then click on the "Security" option.`}
                </p>

                <img src="WhatsApp Image 2024-09-28 at 12.30.52 AM.jpeg" alt="help" className='max-w-[300px] my-5' />

                <p>
                    <strong>4. </strong> {`After clicking on the "Security" option, you will see a "Delete Account" button. Click on the button to delete your account.`}
                </p>

                <img src="WhatsApp Image 2024-09-28 at 12.31.19 AM.jpeg" alt="help" className='max-w-[300px] my-5' />

                <p className='mt-8'>
                    {"If you have any questions or need help with the process, please feel free to reach out to us at"} <a href={`mailto
                :${email}`} className='text-blue-600'>{email}</a>.
                </p>

                <p className='mt-8'>
                    {"We hope to see you back soon! Have a great day!"}
                </p>


            </div>
            <Footer />
        </div>
    )
}
