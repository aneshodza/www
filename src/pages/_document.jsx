import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Ran on my machine</title>
        <meta
          name="description"
          content="Does anyone read these? Anyways, gotta have this for SEO: Artifical Intelligence, Crypto, Blockchain, [insert more buzzwords]"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
