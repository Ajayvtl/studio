'use client';

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from "@/components/ui/toaster";
import {SidebarProvider} from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/SidebarNavigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DataLens',
  description: 'Data Analysis and Visualization Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
    const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }
    setLoading(false);
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (loading) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div>Loading...</div>
        </body>
      </html>
    );
  }
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <SessionProvider>
                <SidebarProvider>
                    <div className="flex flex-col min-h-screen">
                        <TopBar/>
                        <div className="flex flex-1">
                            <SidebarNavigation/>
                            <main className="flex-1 p-4">
                                {children}
                            </main>
                        </div>
                        <Footer/>
                    </div>
                </SidebarProvider>
                <Toaster/>
            </SessionProvider>
            </body>
        </html>
    );
}

