import RootNav from "@/components/shared/RootNav"
// import Footer from "@/components/shared/Footer"
import { auth } from "@clerk/nextjs/server"
import SetUserId from "./SetUserId"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  return (
    <main className="block fixed top-0 left-0 w-screen h-screen overflow-y-auto">
      <RootNav />
      {children}
      <SetUserId userId={userId} />
    </main>
  )
}

export default Layout