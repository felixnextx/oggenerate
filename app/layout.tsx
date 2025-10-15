import "./globals.css"

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { TemplateStoreProvider } from "@/providers/template-store-provider"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileNav } from "@/components/nav/mobile-nav"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  metadataBase: new URL("https://og.htryit.com/"),
  title: "OG 图片生成器 - Felix's Blog | 在线生成精美社交媒体分享图",
  description: "免费在线 Open Graph 图片生成工具，支持多种模板样式，轻松创建适用于 Twitter、Facebook、LinkedIn 等社交平台的精美分享图。零配置，即时预览，一键导出高质量 OG 图片。",
  keywords: [
    "OG图片生成",
    "Open Graph",
    "社交媒体图片",
    "Twitter Card",
    "Facebook分享图",
    "博客配图",
    "SEO优化",
    "图片生成器",
    "在线工具",
    "Felix Blog"
  ],
  openGraph: {
    title: "OG 图片生成器 - Felix's Blog",
    description: "免费在线 Open Graph 图片生成工具，支持多种模板样式，轻松创建精美社交媒体分享图",
    type: "website",
    url: "https://og.htryit.com/",
    siteName: "Felix's Blog - OG 图片生成器",
    images: [
      {
        url: "https://og.htryit.com/og.png",
        width: 1200,
        height: 630,
        alt: "OG 图片生成器 - 在线生成精美 Open Graph 社交分享图",
      },
    ],
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "OG 图片生成器 - Felix's Blog",
    description: "免费在线 Open Graph 图片生成工具，支持多种模板样式",
    images: ["https://og.htryit.com/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <div>
                <Link href="/">
                  <Image
                    className="block dark:hidden"
                    src="/logo.svg"
                    alt="imgsrc Logo"
                    width={36}
                    height={36}
                  />
                </Link>

                <Link href="/">
                  <Image
                    className="hidden dark:block"
                    src="/logo_dark.svg"
                    alt="imgsrc Logo"
                    width={36}
                    height={36}
                  />
                </Link>
              </div>
            </div>

            <div className="hidden space-x-2 sm:flex">
              <Button variant="link">
                <Link href="#" target="_blank">
                  Support
                </Link>
              </Button>

              <ModeToggle />
            </div>

            {/* Mobile navigation */}
            <div className="flex space-x-2 sm:hidden">
              <ModeToggle />

              <MobileNav />
            </div>
          </nav>

          <main className="mx-auto min-h-[calc(100dvh-84px)] max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
            <TemplateStoreProvider>{children}</TemplateStoreProvider>
          </main>

          <Separator />

          <footer className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="font-mono font-semibold">
                  <Link href="https://imgsrc.io">.imgsrc</Link>
                </div>

                <div>
                  <Button variant="link" asChild>
                    <Link href="/">Home</Link>
                  </Button>

                  <Button variant="link" asChild>
                    <Link href="#" target="_blank">
                      Support
                    </Link>
                  </Button>
                </div>
              </div>

              {/* only shows on Desktop */}
              <div className="hidden items-center gap-x-2 md:inline-flex">
                <svg
                  className="h-2 w-2 fill-green-400"
                  viewBox="0 0 6 6"
                  aria-hidden="true"
                >
                  <circle cx={3} cy={3} r={3} />
                </svg>
                <span className="font-mono text-sm font-medium">
                  Operational
                </span>
              </div>
            </div>
          </footer>
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  )
}
