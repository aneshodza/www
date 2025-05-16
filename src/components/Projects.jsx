import ProjectCard from "./ProjectCard";
import projects from "@/util/data/projects";

export default function Projects({ showAll = false }) {
  return (
    <div id="projects">
      <div id="cards">
        {projects
          .filter((project) => project.pinned !== 0)
          .sort((a, b) => a.pinned - b.pinned)
          .map((project, index) => (
            <ProjectCard project={project} index={index} />
          ))}
        {showAll
          ? projects
            .filter((project) => project.pinned === 0)
            .map((project, index) => (
              <ProjectCard project={project} index={index} />
            ))
          : null}
      </div>
    </div>
  );
}
