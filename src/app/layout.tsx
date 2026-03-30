import type { Metadata } from "next";
import { 
  // Merienda, 
  // Nunito_Sans, 
  // Nunito, 
  // Roboto, 
  // Afacad, 
  Merriweather, 
  // Playfair_Display
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from '@/components/ui/toaster'
import StoreProvider from "./StoreProvider";

// const merienda = Merienda({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   variable: '--font-merienda',
// })

// const nunitoSans = Nunito_Sans({
//   subsets: ["latin"],
//   weight: ["400", "600", "700", "800", '900'],
//   variable: '--font-nunito-sans',
// })

// const nunito = Nunito({
//   subsets: ["latin"],
//   weight: ["400", "600", "700", "800", '900'],
//   variable: '--font-nunito',
// })

// const roboto = Roboto({
//   subsets: ["latin"],
//   weight: ["400", "500", "700", "900"],
//   variable: '--font-roboto',
// })

// const afacad = Afacad({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: '--font-afacad',
// })

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: '--font-merriweather',
})

// const playfairDisplay = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800", '900'],
//   variable: '--font-playfair-display',
// })

export const metadata: Metadata = {
  title: "Photoin",
  description: "A simple photo gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"} appearance={{
      variables: { colorPrimary: "#b727c2" }
    }}>
      <StoreProvider>
        <html lang="en">
          <body className={cn("font-merriweather antialiased", merriweather.variable)}>
            {children}
            <Toaster />
          </body>
        </html>
      </StoreProvider>
    </ClerkProvider>
  );
}
