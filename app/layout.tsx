import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClientProviders } from '@/components/providers/client-providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Finance Visualizer',
  description: 'Track, visualize, and optimize your personal finances',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}