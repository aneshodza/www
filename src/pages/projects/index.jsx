import Projects from "@/components/Projects";
import IconLink from "@/components/IconLink";

export default function ProjectIndex() {
  return (
    <div id="projects-index">
      <div class="header">
        <h2 class="chapter-title" id="projects-header">
          Projects
        </h2>
        <IconLink text='Back' src='assets/arrow.svg' href='/' classes="back"/>
      </div>
      <p>
        These are some of the projects I have worked on. To see more, you can click on the project itself, which should take you to its website or the repository.
      </p>
      <Projects showAll={true} />
    </div>
  );
}
