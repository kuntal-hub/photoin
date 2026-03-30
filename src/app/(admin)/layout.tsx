import React from 'react'
import { redirect } from 'next/navigation'
import { getAdmin } from '@/lib/actions/user.action'
import { auth } from "@clerk/nextjs/server"
import SetAdminId from './SetAdminId'

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = auth();
    if (!userId) {
        redirect("/sign-in");
    }
    const admin = await getAdmin(userId);
    if (!admin) {
        redirect("/");
    }
  return (
    <main>
      {children}
      <SetAdminId adminId={userId} />
    </main>
  )
}

export default Layout;