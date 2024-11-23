<div align="center">
  <br />
      <img src="https://portfolio-v2-sigma-eight-85.vercel.app/Screenshot%20(109)-min.png" alt="Project Banner">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=47A248" alt="mongodb" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">Photoin</h3>

   <div align="center">
    A full stack E-commerce photo frame selling Web App <br>
    See the project in action <a href="https://photoin.in" target="_blank"><b>Here</b></a>
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Links](#links)

## <a name="introduction">🤖 Introduction</a>

Build an full stack e-commerce app with Next.js, MongoDB, Clerk, Cloudinary, Shadcn, and TailwindCSS. The app allows users to explore products, search products, customize product, add products to wishlist, add products to cart, Buy products and many more. This app also offer an admin panal whare admin can upload new product, update and delete existing product, create new product category, view orders, update order details and many more.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- TypeScript
- MongoDB
- Clerk
- Cloudinary
- Shadcn
- TailwindCSS

## <a name="features">🔋 Features</a>

👉 **Authentication and Authorization**: Secure user access with registration, login, and route protection.

👉 **Product Showcase**: Explore All products those are available for selling

👉 **Advanced Search**: Search sellable products quickly and accurately with search suggestions

👉 **Wishlist**: user can able to add product to there wishlist for farther use

👉 **Customize images**: user can customize there printable images seamlessly according to there need

👉 **Add to cart**: User can add products to a cart for buy multiple products at a time

👉 **Perches product**: Perches a single product or place order for all products added to user cart

👉 **Secure Payment**: Securely pay for products using phonepe payment getway or Cash on delivery

👉 **Profile Page**: Access orders, carts and wishlist information personally

👉 **Admin panel**: Admin can upload new product, update and delete existing product, create new product category, view orders, update order details and many more

👉 **SEO Optimized**: Optimized for search engines to improve visibility

👉 **Performance Optimized**: Fast loading times and smooth navigation

👉 **Responsive UI/UX**: A seamless experience across devices with a user-friendly interface

and many more, including code architecture and reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/kuntal-hub/photoin.git
cd photoin
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB
MONGO_URI=

# cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_TEMP=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ZOHO MAIL

ZOHO_APP_PASSWORD=
ZOHO_APP_USER=
ZOHO_SMTP_PORT=587
```

Replace the placeholder values with your actual respective account credentials. You can obtain these credentials by signing up on the [Clerk](https://clerk.com/), [MongoDB](https://www.mongodb.com/), [Cloudinary](https://cloudinary.com/) and [zoho](https://www.zoho.com/mail)

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="links">🔗 Links</a>

Finally, you can find me on: [photoin.in](https://photoin.in/)
