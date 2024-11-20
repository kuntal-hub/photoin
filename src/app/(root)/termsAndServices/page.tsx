import Image from 'next/image'
import React from 'react'
import { phone, email, address } from '@/constants/index'
import Footer from '@/components/shared/Footer'

export default function TermsPage() {
  return (
    <div>
      <div className='flex flex-col justify-center max-w-[600px] mx-auto items-center text-left px-4 sm:px-8 pb-10 md:px-12'>
        <div>
          <Image src="/Purple Orange Camera Photography Logo1.png" alt="our logo" height={350} width={350}
            className=' w-[200px]  sm:w-[250px] md:w-[300px] lg:w-[350px]' />
        </div>
        <h1 className='m-0 p-0 text-lg font-[800] sm:text-2xl md:text-4xl mb-20'>
          Our Terms and Services.
        </h1>



        <p className='pl-6 sm:pl-12 mb-3'>
          Effective Date: 1st October 2024
        </p>

        <p className='pl-6 sm:pl-12 mb-3'>{'Welcome to Photoin.in! These Terms and Services ("Terms") govern your use of our website and services. By accessing or using Photoin.in, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please do not use our services.'}</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>1. Acceptance of Terms</h2>
        <p className='pl-6 sm:pl-12 mb-3'>By using our website and services, you confirm that you are at least 18 years old or have the consent of a parent or guardian. If you are using our services on behalf of a business or entity, you represent that you have the authority to bind that entity to these Terms.</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>2. Services Offered</h2>
        <p className='pl-6 sm:pl-12 mb-3'>Photoin.in specializes in photo editing and framing services. You can send us your photos for editing, specify your customization preferences, and receive the final framed product delivered to your address.</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>3. User Accounts</h2>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>3.1 Account Registration</h3>
        <p className='pl-6 sm:pl-12 mb-3'>To use certain features of our services, you may need to create an account. When creating an account, you agree to provide accurate, current, and complete information and to update such information as necessary to keep it accurate, current, and complete.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>3.2 Account Security</h3>
        <p className='pl-6 sm:pl-12 mb-3'>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. If you suspect any unauthorized use of your account, you must notify us immediately.</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>4. User Responsibilities</h2>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>4.1 Content Submission</h3>
        <p className='pl-6 sm:pl-12 mb-3'>When you submit photos or any content to Photoin.in, you warrant that you own the rights to the submitted content or have obtained all necessary permissions. You grant us a non-exclusive, worldwide, royalty-free license to use, edit, and display the content solely for the purpose of providing our services.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>4.2 Prohibited Activities</h3>
        <p className='pl-6 sm:pl-12 mb-3'>You agree not to engage in any of the following prohibited activities:</p>
        <ul>
          <li>Submitting content that is unlawful, defamatory, obscene, or infringes on the rights of others.</li>
          <li>Using our services for any illegal or unauthorized purpose.</li>
          <li>Interfering with or disrupting the security or functionality of our website and services.</li>
        </ul>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>5. Payment and Pricing</h2>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>5.1 Pricing</h3>
        <p className='pl-6 sm:pl-12 mb-3'>The prices for our services are displayed on our website. We reserve the right to change our pricing at any time, but any price changes will not affect orders that have already been confirmed.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>5.2 Payment Methods</h3>
        <p className='pl-6 sm:pl-12 mb-3'>Payments are processed through secure third-party payment gateways. By providing your payment information, you authorize us to charge the total amount of your order.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>5.3 Refunds</h3>
        <p className='pl-6 sm:pl-12 mb-3'>Refunds are subject to our refund policy, which will be provided at the time of purchase. Please review our refund policy for details.</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>6. Intellectual Property</h2>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>6.1 Ownership</h3>
        <p className='pl-6 sm:pl-12 mb-3'>All content, trademarks, and other intellectual property associated with Photoin.in, including but not limited to logos, text, graphics, and software, are owned by us or our licensors. You may not use, reproduce, or distribute any of our intellectual property without our prior written consent.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>6.2 User Content</h3>
        <p className='pl-6 sm:pl-12 mb-3'>While you retain ownership of your submitted content, you grant us a license to use it as described in these Terms. We will not sell or distribute your content to third parties without your consent.</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>7. Limitation of Liability</h2>
        <p className='pl-6 sm:pl-12 mb-3'>To the fullest extent permitted by law, Photoin.in, its owners, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of our services, including but not limited to loss of profits, data, or other intangible losses.</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>8. Indemnification</h2>
        <p className='pl-6 sm:pl-12 mb-3'>You agree to indemnify, defend, and hold harmless Photoin.in and its affiliates from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorney&rsquo;s fees) arising out of or related to your use of our services, your violation of these Terms, or your infringement of any third-party rights.</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>9. Governing Law</h2>
        <p className='pl-6 sm:pl-12 mb-3'>These Terms shall be governed by and construed in accordance with the laws of [Your Country/State]. Any disputes arising out of or related to these Terms shall be resolved in the courts located in [Your Jurisdiction].</p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>10. Changes to Terms</h2>
        <p className='pl-6 sm:pl-12 mb-3'>We reserve the right to update or modify these Terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes your acceptance of the new Terms.</p>


        <h2 className='text-xl sm:text-2xl font-bold text-center w-full my-4'>Contact Us</h2>
        <p className='pl-6 sm:pl-12 mb-3'>If you have any questions about these Terms, please contact us at:</p>
        <p className='pl-6 sm:pl-12 mb-3'><strong>Email</strong>:
          <a className='text-blue-600 hover:underline' href={`mailto:${email}`}>{email}</a> <br />
          <strong>Phone</strong>: <a className='text-blue-600 hover:underline' href={`"tel:+91${phone}`}>+91 {phone}</a><br />
          <strong>Address</strong>: {address}</p>
        <p className='pl-6 sm:pl-12 mb-3'>Thank you for choosing Photoin.in! We look forward to helping you preserve your memories.</p>
      </div>
      <Footer />
    </div>
  )
}
