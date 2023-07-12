import '/public/styles/global.css'
import localFont from 'next/font/local'

const nunito = localFont({ src: '../fonts/Nunito-Regular.woff2' })

export default function App({ Component, pageProps }) {
  return (
    <main className={nunito.className}>
      <Component {...pageProps} />
    </main>
  )
}
