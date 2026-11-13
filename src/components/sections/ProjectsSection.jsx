import { useRef } from "react";
import { projects } from "../../data/projects.js";
import useProjectsMotion from "../../hooks/useProjectsMotion.js";
import "./Projects.css";

function ProjectAction({ label, href, projectTitle, repository = false }) {
  const content = (
    <span className="projects__action-label">
      {repository && <span className="projects__github-icon" aria-hidden="true" />}
      {label} <span aria-hidden="true">↗</span>
    </span>
  );
  if (href) {
    return <a className="projects__action" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} — ${projectTitle} (opens in a new tab)`}>{content}</a>;
  }
  // A plain label, not a disabled link/button: no href, role or tab stop.
  return <span className="projects__action projects__action--unavailable">{content}<span className="projects__action-status">UNAVAILABLE</span></span>;
}

function Project({ project }) {
  const liveUrl = project.liveUrl?.trim();
  const githubUrl = project.githubUrl?.trim();
  const artwork = (
    <div className="projects__art-reveal" data-project-reveal>
      <img src={project.artwork} alt={project.artworkAlt} width="1000" height="700" loading="eager" fetchPriority="low" decoding="async" data-project-image />
    </div>
  );
  return (
    <article className="projects__project" data-project={project.id} aria-labelledby={`project-${project.id}`}>
      <div className="projects__project-top">
        <p>{project.number} / {project.category}</p>
        {project.placeholder && <span>CONCEPT STUDY</span>}
      </div>
      <div className="projects__visual">
        {liveUrl ? (
          <a className="projects__media" href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} live demo (opens in a new tab)`} data-cursor="view" data-cursor-label="VIEW PROJECT">{artwork}<span className="projects__view">VIEW PROJECT ↗</span></a>
        ) : <div className="projects__media">{artwork}</div>}
        <span className="projects__figure" aria-hidden="true">FIG. {project.number} / {project.placeholder ? "FORM STUDY" : "PROJECT"}</span>
      </div>
      <div className="projects__identity">
        <span className="projects__number" data-project-number aria-hidden="true">{project.number}</span>
        <h3 id={`project-${project.id}`}><span data-project-title>{project.title}<span className="projects__period">.</span></span></h3>
      </div>
      <div className="projects__details">
        <p>{project.description}</p>
        <div>
          <ul className="projects__tags" aria-label={`${project.title} technologies`}>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
          <div className="projects__actions">
            <ProjectAction label="LIVE DEMO" href={liveUrl} projectTitle={project.title} />
            <ProjectAction label="GITHUB" href={githubUrl} projectTitle={project.title} repository />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection({ motionEnabled = true }) {
  const rootRef = useRef(null);
  useProjectsMotion(rootRef, motionEnabled);
  return (
    <section ref={rootRef} className="projects" id="projects" tabIndex={-1} aria-labelledby="projects-heading" data-projects-mode="flow">
      <div className="projects__inner">
        <header className="projects__introduction">
          <div className="projects__edition"><p><span aria-hidden="true" /> 04 / SELECTED WORK</p><span>CONCEPT EDITION — 2026</span></div>
          <div className="projects__intro-layout">
            <h2 id="projects-heading"><span className="projects__title-line"><span data-projects-intro>SELECTED</span></span><span className="projects__title-line"><span data-projects-intro>PROJECTS<span className="projects__period">.</span></span></span></h2>
            <div className="projects__intro-note"><span className="projects__intro-arrow" aria-hidden="true">↙</span><p>Systems, interfaces,<br />and the space between.</p><p className="projects__placeholder-note">Four fictional project placeholders.<br />Real work and details to follow.</p></div>
          </div>
          <div className="projects__intro-rule" data-projects-rule />
        </header>
        <div className="projects__gallery">
          <div className="projects__gallery-meta" aria-hidden="true">
            <span className="projects__direction">THE PROJECT INDEX <span>↘</span></span>
            <div className="projects__progress"><span data-projects-current>01</span><span className="projects__progress-rail"><span data-projects-progress /></span><span>/ {String(projects.length).padStart(2, "0")}</span></div>
          </div>
          <div className="projects__window">
            <div className="projects__track">{projects.map((project) => <Project key={project.id} project={project} />)}</div>
          </div>
        </div>
        <footer className="projects__end"><span>END OF INDEX / {String(projects.length).padStart(2, "0")} STUDIES</span><span>MORE TO COME <span aria-hidden="true">↗</span></span></footer>
      </div>
    </section>
  );
}
