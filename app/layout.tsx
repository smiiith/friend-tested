import type { Metadata } from "next"
import "./globals.css"
import { PostHogProvider } from "@/components/PostHogProvider"
import { ThemeProvider } from "@/components/ThemeProvider"

export const metadata: Metadata = {
  title: {
    default: "Vetted Local Cleaners | Find House Cleaners Near You",
    template: "%s | Friend Tested Cleaners",
  },
  description:
    "Find vetted local house cleaners and maid services in your area. Browse trusted cleaning services recommended by your neighbors.",
  metadataBase: new URL("https://friendtested.pro"),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Vetted Local Cleaners",
    images: [{ url: "/hero.png", width: 1200, height: 630 }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/hero.png"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script sets data-theme before React hydrates, preventing flash for returning theme B users */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=new URLSearchParams(location.search).get('theme'),s=p||localStorage.getItem('vc_theme');if(s==='b')document.documentElement.setAttribute('data-theme','b')}catch(e){}`,
          }}
        />
      </head>
      <body>
        <PostHogProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
