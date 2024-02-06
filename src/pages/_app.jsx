import Head from "next/head";
import { useEffect, useState } from "react";
import '/public/styles/global.css'
import localFont from 'next/font/local'

const nunito = localFont({ src: '../fonts/Nunito-Light.woff2' })

console.log(`
██╗  ██╗███████╗██╗   ██╗██╗
██║  ██║██╔════╝╚██╗ ██╔╝██║
███████║█████╗   ╚████╔╝ ██║
██╔══██║██╔══╝    ╚██╔╝  ╚═╝
██║  ██║███████╗   ██║   ██╗
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝

Nice to see another programmer.
The source code of this website
and all its cool features are on
my GitHub account.
https://github.com/aneshodza/www
`)

export default function App({ Component, pageProps }) {
  return (
    <main className={nunito.className}>
      <Component {...pageProps} />
    </main>
  )
}
