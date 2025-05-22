import ProjectCard from "./ProjectCard";
import projects from "@/util/data/projects";
import { useSearchParams } from "next/navigation";

export default function Projects({ showAll = false }) {
  const searchParams = useSearchParams();
  const filterTech = searchParams.get("technology");

  const visibleProjects = projects.filter((project) => {
    if (!filterTech) return true;
    return project.tags.includes(filterTech);
  });

  return (
    <div id="projects">
      <div id="cards">
        {visibleProjects
          .filter((project) => project.pinned !== 0)
          .sort((a, b) => a.pinned - b.pinned)
          .map((project, index) => (
            <ProjectCard project={project} index={index} key={index} />
          ))}
        {showAll
          ? visibleProjects
            .filter((project) => project.pinned === 0)
            .map((project, index) => (
              <ProjectCard project={project} index={index} key={index} />
            ))
          : null}
      </div>
    </div>
  );
}
