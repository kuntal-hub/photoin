import { Facebook, GlobeLock, Handshake, House, Instagram, Truck, Twitter, Youtube } from "lucide-react"
import { phone, email, address, fbUrl, instaUrl, twitterUrl, youtubeUrl, aboutUs } from '@/constants/index'
import Link from "next/link"

function Footer() {
  return (
    <footer className="bg-pink-500 text-gray-100 pt-10 pb-20 sm:pb-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-white text-lg font-bold mb-4">About Us</h2>
          <p className="mb-4">
            {aboutUs}
          </p>
        </div>
        <div>
          <h2 className="text-white text-lg font-bold mb-4">Quick Links</h2>
          <ul className="grid grid-cols-1 gap-1">
            <li>
              <Link
                href="/"
                className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
              >
                <House /> <span className="ml-2"> Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
              >
                <GlobeLock /> <span className="ml-2"> Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link
                href="/termsAndServices"
                className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
              >
                <Handshake /> <span className="ml-2"> Terms of Service</span>
              </Link>
            </li>
            <li>
              <Link
                href="/shipping-policy"
                className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
              >
                <Truck /> <span className="ml-2">
                  Shipping Policy
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-white text-lg font-bold mb-4">Follow Us</h2>
          <div className="flex flex-col ">
            <a target="_blank" rel="noreferrer"
              href={fbUrl}
              className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
            >
              <Facebook /><span className="ml-2"> Facebook</span>
            </a>
            <a target="_blank" rel="noreferrer"
              href={instaUrl}
              className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
            >
              <Instagram /><span className="ml-2"> Instagram</span>
            </a>
            <a target="_blank" rel="noreferrer"
              href={youtubeUrl}
              className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
            >
              <Youtube /><span className="ml-2"> Youtube</span>
            </a>
            <a target="_blank" rel="noreferrer"
              href={twitterUrl}
              className="dark:hover:text-white hover:text-black hover:underline transition-colors duration-300 flex flex-nowrap justify-start my-1"
            >
              <Twitter /><span className="ml-2"> Twitter</span>
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-white text-lg font-bold mb-4">Contact Us</h2>
          <p>{address}</p>
          <p>Email: <a className="hover:underline" href={`mailto:${email}`}>{email}</a></p>
          <p>Phone: <a className='hover:underline' href={`"tel:+91${phone}`}>+91 {phone}</a></p>
        </div>
      </div>
      <p className="text-center text-xs pt-8">© 2024 Photoin.in All rights reserved.</p>
    </footer>
  )
}

export default Footer