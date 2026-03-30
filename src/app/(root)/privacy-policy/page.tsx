import Image from 'next/image'
import React from 'react'
import { phone, email, address } from '@/constants/index'
import Footer from '@/components/shared/Footer'

export default function PrivcyPolicyPage() {
  return (
    <>
      <div className='flex flex-col justify-center items-center text-left px-4 sm:px-8 pb-10 md:px-12'>
        <div>
          <Image src="/Purple Orange Camera Photography Logo1.png" alt="our logo" height={350} width={350}
            className=' w-[200px]  sm:w-[250px] md:w-[300px] lg:w-[350px]' />
        </div>
        <h1 className='m-0 p-0 text-lg font-[800] sm:text-2xl md:text-4xl mb-20'>
          Our Privacy Policy.
        </h1>


        <p>
          Effective Date: 1st October 2024
        </p>
        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>
          Introduction :
        </h2>
        <p className='pl-6 sm:pl-12 mb-3'>
          {"Welcome to Photoin.in, where we specialize in transforming your cherished memories into beautifully edited and framed photographs. At Photoin.in, we believe that every image tells a story, and our mission is to enhance those stories through our expert editing services and high-quality framing. We recognize that in order to deliver exceptional products and services, we must also prioritize the privacy and security of our customers’ personal information. "}<br /><br />

          {`In today's digital age, your privacy is of utmost importance. As a business that collects, processes, and stores personal information, we are committed to adhering to the highest standards of data protection. This Privacy Policy serves as a comprehensive guide to how we handle your information, ensuring transparency and trust in our relationship with you.`}
        </p>

        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>1. Information We Collect</h2>
        <p className='pl-6 sm:pl-12 mb-3'>At Photoin.in, we are committed to providing you with exceptional service, and to do so, we need to gather certain information from you. This information helps us understand your needs, process your orders, and improve our services. Below, we provide a detailed overview of the types of information we collect.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>1.1 Personal Information</h3>
        <p className='pl-6 sm:pl-12 mb-3'><strong>Definition</strong>: Personal information refers to any data that can be used to identify an individual. We collect personal information in various ways during your interaction with our website and services. This includes:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Account Registration</strong>: When you create an account on Photoin.in, we ask for essential details such as your name, email address, phone number, and postal address. This information helps us set up your account and communicate with you regarding your orders.</p>
          </li><br />
          <li>
            <p><strong>Order Placement</strong>: To fulfill your orders for customized photo editing and framing, we require additional information. This includes your shipping address for delivery, payment information (which is securely processed through our payment gateways), and any specific instructions regarding the editing of your photos. We may also request your preferences for framing and presentation, which enhances your overall experience.</p>
          </li><br />
          <li>
            <p><strong>Customer Communication</strong>{`: If you reach out to us via email, phone, or through our website's contact forms, we collect the details you provide. This may include your name, email address, and any other information relevant to your inquiry. We use this information to respond to your questions and provide assistance.`}</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>1.2 Non-Personal Information</h3>
        <p className='pl-6 sm:pl-12 mb-3'>In addition to personal information, we collect non-personal information that does not directly identify you. This data is invaluable for understanding user behavior and improving our services. Non-personal information we may collect includes:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Technical Data</strong>: We gather information about your device and internet connection, such as your IP address, browser type, operating system, and device type. This information helps us ensure that our website functions smoothly across different platforms and devices.</p>
          </li><br />
          <li>
            <p><strong>Usage Data</strong>: We may collect data about how you use our website, including the pages you visit, the time and date of your visits, and how long you spend on our site. This information helps us identify trends, assess the effectiveness of our services, and make improvements.</p>
          </li><br />
          <li>
            <p><strong>Cookies and Tracking Technologies</strong>: Our website uses cookies and similar technologies to enhance your experience. Cookies are small files that are placed on your device to collect information about your browsing habits. This allows us to personalize your experience, remember your preferences, and analyze site traffic. You can manage your cookie preferences through your browser settings.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>1.3 Images and Content</h3>
        <p className='pl-6 sm:pl-12 mb-3'>As part of our core services, we require you to send us the photos that you want edited and framed. This is a significant aspect of our business, and we treat your images with the utmost care. Here&rsquo;s how we handle this sensitive information:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Photo Submission</strong>: When you upload photos to our platform, you may be sharing personal images that could contain identifiable information. We ensure that all images are transmitted securely and stored with restricted access to maintain confidentiality.</p>
          </li><br />
          <li>
            <p><strong>Editing Instructions</strong>: Along with your photos, you may provide specific instructions on how you would like your images to be edited. This information is crucial for us to meet your expectations and deliver the customized product you envision.</p>
          </li><br />
          <li>
            <p><strong>Temporary Storage</strong>: We retain your photos only for the duration necessary to fulfill your order and provide our services. Once your order is completed, and you have received your framed image, we may delete your photos from our servers, unless you have opted to retain them for future orders or requests.</p>
          </li><br />
        </ul>


        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>2. How We Use Your Information</h2>
        <p className='pl-6 sm:pl-12 mb-3'>At Photoin.in, the information we collect from you serves several vital functions that enhance your experience and enable us to deliver high-quality services. We prioritize transparency in how we utilize your data, ensuring that you understand the purposes for which we collect and process your information. Below are the main ways we use your information:</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>2.1 To Process Transactions</h3>
        <p className='pl-6 sm:pl-12 mb-3'>One of the primary reasons we collect personal information is to process your orders efficiently. When you submit a photo for editing or purchase a framed image, we need your details to:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Confirm Your Order</strong>: We use your name, email address, and payment information to confirm and process your order. This helps us ensure that we have accurately captured your request and that payment has been successfully processed.</p>
          </li><br />
          <li>
            <p><strong>Fulfill Your Order</strong>: Your shipping address is crucial for delivering the finished product to you. We coordinate with our fulfillment partners to ensure your framed image arrives at the correct location and in a timely manner.</p>
          </li><br />
          <li>
            <p><strong>Communicate Order Status</strong>{`: We keep you informed about your order's status through email notifications. This includes confirmation of your order, updates on the editing process, and shipping details once your product is on its way.`}</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>2.2 To Improve Customer Service</h3>
        <p className='pl-6 sm:pl-12 mb-3'>We aim to provide exceptional customer service, and the information we collect plays a significant role in achieving this goal. We utilize your data in the following ways:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Responding to Inquiries</strong>: When you contact us with questions or concerns, we use the information you provide to address your inquiries promptly. This could include providing assistance with orders, answering questions about our services, or resolving any issues you may encounter.</p>
          </li><br />
          <li>
            <p><strong>Tailoring Support</strong>: Understanding your preferences and past interactions allows us to offer more personalized support. For instance, if you have specific requests or preferences regarding photo editing, we can keep that in mind for future communications and orders.</p>
          </li><br />
          <li>
            <p><strong>Gathering Feedback</strong>: We may reach out to you after your purchase to solicit feedback on your experience with our services. This feedback is invaluable in helping us identify areas for improvement and ensuring we continually meet and exceed your expectations.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>2.3 To Personalize User Experience</h3>
        <p className='pl-6 sm:pl-12 mb-3'>At Photoin.in, we believe that a personalized experience enhances customer satisfaction. We utilize your information to:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Customize Recommendations</strong>: Based on your past orders and preferences, we may provide tailored recommendations for products or services that align with your interests. This could include suggesting specific framing styles or editing options that may appeal to you.</p>
          </li><br />
          <li>
            <p><strong>Enhance User Interface</strong>: Understanding how you interact with our website allows us to optimize the user interface and experience. We analyze usage data to identify which features are most popular and how we can make navigation easier for you.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>2.4 To Send Periodic Emails</h3>
        <p className='pl-6 sm:pl-12 mb-3'>Communication is key to maintaining a strong relationship with our customers. We use your email address for various purposes:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Order Confirmations and Updates</strong>: We send you emails confirming your order and providing updates throughout the process, including editing status and shipping information.</p>
          </li><br />
          <li>
            <p><strong>Promotional Offers and News</strong>: With your consent, we may send you newsletters, promotional offers, and updates about new products or services. You can opt out of these communications at any time.</p>
          </li><br />
          <li>
            <p><strong>Surveys and Feedback Requests</strong>: Occasionally, we may reach out to request your feedback on our services or to conduct surveys that help us improve our offerings.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>2.5 To Analyze and Improve Our Services</h3>
        <p className='pl-6 sm:pl-12 mb-3'>Data analysis is crucial for understanding our business performance and customer satisfaction. We may use your information in the following ways:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Performance Metrics</strong>: By analyzing usage data, we can track the effectiveness of our website, marketing campaigns, and overall business performance. This analysis helps us make informed decisions about improvements and new features.</p>
          </li><br />
          <li>
            <p><strong>Market Research</strong>: We may aggregate non-personal information to gain insights into market trends and customer preferences. This helps us stay competitive and responsive to customer needs.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>2.6 To Comply with Legal Obligations</h3>
        <p className='pl-6 sm:pl-12 mb-3'>In some cases, we may be required to use your information to comply with legal requirements or to protect our rights and those of others:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Legal Compliance</strong>: We may use your information to comply with applicable laws, regulations, or legal requests. This ensures that we operate within the legal framework and fulfill our obligations to regulatory authorities.</p>
          </li><br />
          <li>
            <p><strong>Protection of Rights</strong>: If necessary, we may use your information to investigate potential violations of our terms of service, protect our intellectual property, or respond to claims of third-party infringement.</p>
          </li><br />
        </ul>


        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>3. Sharing Your Information</h2>
        <p className='pl-6 sm:pl-12 mb-3'>At Photoin.in, we recognize that the protection of your personal information is critical. We are committed to maintaining the confidentiality of your data and only share it in specific circumstances that align with our privacy practices. Below, we outline the various situations in which we may share your information, ensuring that you understand how and why we do so.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>3.1 Service Providers</h3>
        <p className='pl-6 sm:pl-12 mb-3'>To deliver our services effectively, we work with various third-party service providers who assist us in processing your orders and managing our business operations. This includes:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Payment Processors</strong>: We partner with trusted payment gateways to securely process your financial transactions. Your payment information is shared only with these providers to facilitate transactions, and they are required to adhere to strict security standards.</p>
          </li><br />
          <li>
            <p><strong>Shipping and Fulfillment Partners</strong>: Once your order is ready, we share your shipping address and contact information with our logistics partners. This enables them to deliver your framed images directly to you. We ensure that these partners also maintain confidentiality regarding your personal information.</p>
          </li><br />
          <li>
            <p><strong>Customer Service Platforms</strong>: If you contact us for support, we may use third-party customer service tools to manage your inquiries. These platforms help us provide timely responses while ensuring that your information remains secure.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>3.2 Legal Compliance</h3>
        <p className='pl-6 sm:pl-12 mb-3'>We may disclose your information in response to legal obligations or requests from law enforcement. This includes:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Compliance with Laws</strong>: We may share your information if required to comply with applicable laws, regulations, or legal processes. This ensures that we operate within legal boundaries and uphold our responsibilities as a business.</p>
          </li><br />
          <li>
            <p><strong>Protection of Rights</strong>: We may also disclose your information to protect our rights, property, or safety, as well as that of our customers or others. This includes investigating potential violations of our terms of service or addressing fraudulent activity.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>3.3 Business Transfers</h3>
        <p className='pl-6 sm:pl-12 mb-3'>In the event that Photoin.in undergoes a business transition, such as a merger, acquisition, or sale of assets, your information may be part of the transferred assets. In such cases:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Notification</strong>: We will notify you via email and/or a prominent notice on our website prior to your personal information being transferred and becoming subject to a different privacy policy.</p>
          </li><br />
          <li>
            <p><strong>Continuity of Privacy Protections</strong>: We will ensure that any successor entity that receives your information continues to protect your personal data in a manner consistent with this Privacy Policy.</p>
          </li><br />
        </ul>



        <h2 className='text-xl sm:text-2xl font-bold text-left w-full mb-4'>4. Data Protection</h2>
        <p className='pl-6 sm:pl-12 mb-3'>At Photoin.in, we take the protection of your personal information very seriously. We understand that in the digital age, safeguarding your data is crucial not only for compliance with regulations but also for maintaining your trust. Below, we elaborate on the various measures and practices we employ to ensure the security and confidentiality of your information.</p>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>4.1 Security Measures</h3>
        <p className='pl-6 sm:pl-12 mb-3'>To protect your personal information from unauthorized access, disclosure, alteration, or destruction, we implement a comprehensive set of security measures. These include:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Encryption</strong>: We use advanced encryption technologies to secure sensitive information, such as payment details and personal data, during transmission. This ensures that any data exchanged between your device and our servers is rendered unreadable to unauthorized parties.</p>
          </li><br />
          <li>
            <p><strong>Firewalls</strong>: Our systems are protected by robust firewall technologies that act as a barrier between our secure internal network and any potential external threats. This helps prevent unauthorized access to our servers and databases.</p>
          </li><br />
          <li>
            <p><strong>Access Controls</strong>: We restrict access to your personal information to only those employees and contractors who need it to perform their job functions. This includes our customer service team and fulfillment partners. We employ strict authentication measures to ensure that only authorized personnel have access to sensitive data.</p>
          </li><br />
          <li>
            <p><strong>Regular Security Audits</strong>: We conduct regular security audits and assessments to identify potential vulnerabilities in our systems. This proactive approach allows us to implement necessary updates and enhancements to our security protocols.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>4.2 Retention of Data</h3>
        <p className='pl-6 sm:pl-12 mb-3'>We understand that not all information needs to be retained indefinitely. Our data retention policies are designed to ensure that we only keep your personal information for as long as necessary:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Duration of Retention</strong>: We retain your personal information for as long as it is required to fulfill the purposes for which it was collected, including processing orders, providing customer support, and complying with legal obligations.</p>
          </li><br />
          <li>
            <p><strong>Data Deletion Procedures</strong>: Once your data is no longer needed, we have established procedures for securely deleting or anonymizing your information. This ensures that it cannot be accessed or reconstructed in the future.</p>
          </li><br />
          <li>
            <p><strong>Ongoing Review</strong>: We regularly review the data we hold to determine whether it remains necessary to keep. If any information is deemed no longer necessary, we will take appropriate action to delete it securely.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>4.3 Data Breach Response</h3>
        <p className='pl-6 sm:pl-12 mb-3'>In the unlikely event of a data breach, we have established a response plan to mitigate potential risks:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Incident Detection</strong>: We continuously monitor our systems for unusual activity and potential security breaches. This enables us to respond swiftly to any incidents that may arise.</p>
          </li><br />
          <li>
            <p><strong>Immediate Response</strong>: If a data breach occurs, our response team will act promptly to contain the breach, assess the impact, and determine the nature of the compromised data.</p>
          </li><br />
          <li>
            <p><strong>Notification</strong>: In accordance with applicable laws, we will notify affected individuals if their personal information is compromised in a breach. This notification will provide details about the breach and the steps we are taking to mitigate its impact.</p>
          </li><br />
          <li>
            <p><strong>Review and Improve</strong>: Following any incident, we conduct a thorough review to identify what went wrong and implement measures to prevent similar incidents in the future.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>4.4 User Responsibilities</h3>
        <p className='pl-6 sm:pl-12 mb-3'>While we take significant measures to protect your data, we also encourage our users to play an active role in safeguarding their own information:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Password Security</strong>: Choose strong, unique passwords for your accounts and change them regularly. Do not share your passwords with others, and consider using a password manager for added security.</p>
          </li><br />
          <li>
            <p><strong>Secure Access</strong>: When accessing your account or making transactions, ensure that you are using a secure internet connection. Avoid using public Wi-Fi networks for sensitive activities whenever possible.</p>
          </li><br />
          <li>
            <p><strong>Report Suspicious Activity</strong>: If you notice any unauthorized activity on your account or suspect that your personal information has been compromised, please contact us immediately. Prompt reporting helps us take necessary actions to protect your data.</p>
          </li><br />
        </ul>
        <h3 className='text-lg sm:text-xl font-bold text-left w-full my-4'>4.5 Data Transfer and Storage</h3>
        <p className='pl-6 sm:pl-12 mb-3'>As a digital platform, we may store and process your information in data centers that may be located in different regions or countries. Here&rsquo;s how we ensure secure data transfer and storage:</p>
        <ul className='pl-6 sm:pl-12 mb-3'>
          <li>
            <p><strong>Secure Hosting Services</strong>: We utilize reputable cloud service providers that comply with industry-standard security practices. This includes physical security measures, such as surveillance and controlled access to data centers.</p>
          </li><br />
          <li>
            <p><strong>Cross-Border Data Transfers</strong>: If your data is transferred to countries outside your jurisdiction, we ensure that such transfers comply with applicable data protection laws. We implement appropriate safeguards, such as standard contractual clauses, to ensure your data remains protected.</p>
          </li><br />
        </ul>


        <h2 className='text-xl sm:text-2xl font-bold text-left w-full my-4'>
          Conclusion :
        </h2>
        <p className='pl-6 sm:pl-12 mb-3'>
          At Photoin.in, your privacy and security are at the forefront of everything we do. As a platform dedicated to transforming your cherished memories into beautifully edited and framed photographs, we understand that the information you share with us is personal and sensitive. This Privacy Policy outlines our commitment to safeguarding your data while providing you with an exceptional user experience. <br />

          Throughout this document, we have detailed the types of information we collect, the purposes for which we use it, and the measures we take to protect it. We value transparency and aim to keep you informed about how your information is handled. By implementing advanced security measures, rigorous data retention practices, and a clear sharing policy, we work diligently to maintain your trust and confidence. <br />

          We also recognize that privacy is a shared responsibility. We encourage you to take proactive steps to protect your information while engaging with our services. Your involvement is crucial in helping us create a safe and secure environment for all users. <br />

          As we move forward, we remain committed to continually reviewing and enhancing our privacy practices in response to new challenges and evolving regulatory standards. We will keep you informed of any changes to this policy, ensuring that you always know how we are protecting your personal information. <br />

          Thank you for choosing Photoin.in. We look forward to helping you preserve your memories while prioritizing your privacy and security every step of the way. Your trust is our greatest asset, and we are dedicated to upholding it as we grow and evolve. <br />
        </p>

        <h2 className='text-xl sm:text-2xl font-bold text-center w-full my-4'>Contact Us</h2>
        <p className='pl-6 sm:pl-12 mb-3'>If you have any questions about these Terms, please contact us at:</p>
        <p className='pl-6 sm:pl-12 mb-3'><strong>Email</strong>:
          <a className='text-blue-600 hover:underline' href={`mailto:${email}`}>{email}</a> <br />
          <strong>Phone</strong>: <a className='text-blue-600 hover:underline' href={`"tel:+91${phone}`}>+91 {phone}</a><br />
          <strong>Address</strong>: {address}</p>
        <p className='pl-6 sm:pl-12 mb-3'>Thank you for choosing Photoin.in! We look forward to helping you preserve your memories.</p>

      </div>
      <Footer />
    </>
  )
}
