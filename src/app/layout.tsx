
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from "@/components/ui/toaster";
import {SidebarProvider} from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/SidebarNavigation";

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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SidebarProvider>
        <div className="flex">
          <SidebarNavigation/>
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
      <Toaster/>
      </body>
    </html>
  );
}

