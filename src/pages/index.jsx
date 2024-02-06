import About from "@/components/About";
import React from "react";
import Landing from "@/components/Landing";
import Head from "next/head";

const titles = [
  'Ran on my machine',
  'Web developer? I think?',
  'Engineer is an overstatement',
  'I\'m testing this in prod',
  'Does anyone read these?',
  'I\'m not a robot',
  'http://localhost:3000',
  'I don\'t use arch, btw'
]

const isGooglebot = (userAgent) => {
  return /googlebot/i.test(userAgent);
}

export default function App({ title, index }) {
  const app = React.useRef(null);
  const [nameDone, setNameDone] = React.useState(false);
  return (
    <div ref={app} className="app contracted">
      <Head>
        <title>{title}</title>
        { index === 7 ? <link rel="icon" href="/arch.ico" /> : <link rel="icon" href="/favicon.ico" /> }
      </Head>
      <div id="top-of-page"></div>
      <Landing appRef={app} setNameDone={setNameDone} />
      { nameDone && <About /> }
    </div>
  );
}

export async function getServerSideProps(context) {
  const index = Math.floor(Math.random() * titles.length);
  let title = titles[index];

  let userAgent = context.req.headers['user-agent'] || '';

  if (isGooglebot(userAgent)) {
    title = "Anes Hodzas' personal website"
  }

  return {
    props: {
      index,
      title
    }
  }
}
