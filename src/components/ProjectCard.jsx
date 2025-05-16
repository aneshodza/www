import Image from "next/image";
const icon_size = 25;

export default function ProjectCard({ project, index }) {
  return (
    <a
      class="project-card tinted"
      id={`project-card-${index}`}
      key={index}
      href={project.repo || project.website}
      target="_blank"
      rel={project.repo}
      title={project.repo === undefined ? "View in the Web" : "View on GitHub"}
    >
      <div class="project-card-header">
        <h3>{project.name}</h3>
        <div class="project-card-footer">
          {
            // if repo is undefined show web.svg
            project.repo === undefined ? (
              <Image
                src="assets/web.svg"
                width={icon_size}
                height={icon_size}
                alt="web icon"
              />
            ) : (
              <Image
                src="assets/github.svg"
                width={icon_size}
                height={icon_size}
                alt="github icon"
              />
            )
          }
        </div>
      </div>

      <div class="project-card-body">
        <p>{project.description}</p>
      </div>

      <span class={`status-badge ${project.status.replace(" ", "-")}`}>
        {project.status}
      </span>
    </a>
  );
}
