import React from 'react'
import AdminHeader from '@/components/shared/AdminHeader'

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <main>
      <AdminHeader />
        {children}
    </main>
  )
}

export default Layout