import '/public/styles/global.css'
import localFont from 'next/font/local'

const nunito = localFont({ src: '../fonts/Nunito-Light.woff2' })

export default function App({ Component, pageProps }) {
  return (
    <main className={nunito.className}>
      <title>Anes Hodza</title>
      <meta
        name="description"
        content="Anes Hodza - Your friendly neighborhood developer."
      />
      <Component {...pageProps} />
    </main>
  )
}
