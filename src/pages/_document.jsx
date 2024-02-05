import { Html, Head, Main, NextScript } from 'next/document'

const titles = [
  'Ran on my machine',
  'Web developer? I think?',
  'Engineer is an overstatement',
  '404: Not found. Just kidding',
  'I\'m testing this in prod',
  'Does anyone read these?',
  'I\'m not a robot',
  'http://localhost:3000',
  'I don\'t use arch, btw'
]

export default function Document() {
  const index = Math.floor(Math.random() * titles.length)
  return (
    <Html lang="en">
      <Head>
        <title>{titles[index]}</title>
        { index === 8 && <link rel="icon" href="/arch.ico" /> }
        <meta
          name="description"
          content="I need to make the computer overlord happy, so: Anes Hodza made this! This is Anes Hodzas' digital property!"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
