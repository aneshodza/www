import '/public/styles/global.css'
import localFont from 'next/font/local'

const jbMono = localFont({ src: '../fonts/JetBrainsMono-Regular.woff2' })

export default function App({ Component, pageProps }) {
  return (
    <main className={jbMono.className}>
      <Component {...pageProps} />
    </main>
  )
}
