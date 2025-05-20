import Image from "next/image";
const icon_size = 25;

export default function ProjectCard({ project, index }) {
  let image = null;
  let title = null;
  let alt = null;
  let href = null;
  if (project.website !== undefined) {
    image = "assets/web.svg";
    title = "View in the Web";
    alt = "web icon";
    href = project.website;
  } else if (project.repo !== undefined) {
    image = "assets/github.svg";
    title = "View on GitHub";
    alt = "github icon";
    href = project.repo;
  } else if (project.npm !== undefined) {
    image = "assets/npm.svg";
    title = "View on npm";
    alt = "npm icon";
    href = project.npm;
  }

  return (
    <a
      class="project-card tinted"
      id={`project-card-${index}`}
      key={index}
      href={href}
      target="_blank"
      rel={project.repo}
      title={title}
    >
      <div class="project-card-header">
        <h3>{project.name}</h3>
        <div class="project-card-footer">
          {
            <Image
              src={image}
              width={icon_size}
              height={icon_size}
              alt={alt}
            />
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
