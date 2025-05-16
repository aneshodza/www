import Projects from "./Projects";
import UnderConstruction from "./UnderConstruction";
import IconLink from "./IconLink";

export default function About() {
  return (
    <div id="about">
      <h2 class="chapter-title" id="projects-header">
        Projects
      </h2>
      <Projects />
      <IconLink text='Other projects' src='assets/arrow.svg' href='/projects' classes="more-projects-link"/>
      <UnderConstruction />
    </div>
  )
}
