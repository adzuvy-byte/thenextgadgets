import type {Metadata, Viewport} from 'next'
import {Inter, Fraunces} from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import {Footer} from '@/components/Footer'
import {Header} from '@/components/Header'
import {getSettings} from '@/lib/settings'
import {siteUrl} from '@/lib/seo'
import {integrations as I} from '@/integrations'

const sans = Inter({subsets: ['latin'], variable: '--font-sans', display: 'swap'})
const serif = Fraunces({subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['normal', 'italic'], axes: ['opsz', 'SOFT']})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // No suffix: each page's SEO title is used exactly as stored (keeps existing titles).
  title: {default: 'TheNextGadgets', template: '%s'},
  applicationName: 'TheNextGadgets',
  alternates: {types: {'application/rss+xml': `${siteUrl}/feed/`}},
  icons: {
    icon: [
      {url: '/favicon/favicon.ico', sizes: 'any'},
      {url: '/favicon/icon.svg', type: 'image/svg+xml'},
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  verification: {
    google: I.verification.google || undefined,
    yandex: I.verification.yandex || undefined,
    other: {
      ...(I.verification.bing ? {'msvalidate.01': I.verification.bing} : {}),
      ...(I.verification.pinterest ? {'p:domain_verify': I.verification.pinterest} : {}),
      ...(I.verification.facebookDomain ? {'facebook-domain-verification': I.verification.facebookDomain} : {}),
      ...(I.adsenseClient ? {'google-adsense-account': I.adsenseClient} : {}),
      ...Object.fromEntries(I.extraMeta.map((m) => [m.name, m.content])),
    },
  },
}

export const viewport: Viewport = {width: 'device-width', initialScale: 1, themeColor: '#0D47A1'}

export default function RootLayout({children}: {children: React.ReactNode}) {
  const settings = getSettings()
  const adClient = I.adsenseClient
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="content">{children}</main>
        <Footer settings={settings} />
        {I.googleAnalyticsId ? (
          <>
            <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${I.googleAnalyticsId}`} />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${I.googleAnalyticsId}');`}
            </Script>
          </>
        ) : null}
        {I.microsoftClarityId ? (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${I.microsoftClarityId}");`}
          </Script>
        ) : null}
        {I.facebookPixelId ? (
          <Script id="fbpixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${I.facebookPixelId}');fbq('track','PageView');`}
          </Script>
        ) : null}
        {adClient ? (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </body>
    </html>
  )
}
