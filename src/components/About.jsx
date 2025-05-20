import Projects from "./Projects";
import UnderConstruction from "./UnderConstruction";
import IconLink from "./IconLink";
import Whoami from "./Whoami";
import localFont from 'next/font/local'

const jbMono = localFont({ src: '../fonts/JetBrainsMono-Regular.ttf' })

export default function About() {
  return (
    <div id="about">
      <h2 className={`chapter-title ${jbMono.className}`} id="whoami-header">
        ~/web $&gt; whoami
        <br />
        anes-hodza
      </h2>
      <Whoami />
      <h2 className="chapter-title" id="projects-header">
        Projects
      </h2>
      <Projects />
      <IconLink text='Other projects' src='assets/arrow.svg' href='/projects' classes="more-projects-link"/>

      <UnderConstruction />
    </div>
  )
}
