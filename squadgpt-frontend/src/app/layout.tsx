import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PRDProvider } from '../contexts/PRDContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { ThemeToggle } from '../components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SquadGPT - AI-Powered Development Planning',
  description: 'Transform your project ideas into complete development plans with our AI squad',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <PRDProvider>
            <div className="min-h-screen bg-background">
              {/* Theme Toggle - Fixed Position */}
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
              {children}
            </div>
          </PRDProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}