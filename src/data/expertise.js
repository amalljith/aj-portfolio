// Phase 05 stack, extended with approved deployment and AI development tools.
export const featuredTechnologies = [
  { id: "python", name: "Python", category: "LANGUAGE / BACKEND", description: "A versatile language for application logic, services, and the systems behind the interface." },
  { id: "django", name: "Django", category: "FRAMEWORK / BACKEND", description: "A structured Python framework for building web applications, from data models to request handling." },
  { id: "fastapi", name: "FastAPI", category: "FRAMEWORK / API", description: "Python APIs built around type hints, validation, and automatic API documentation." },
  { id: "react", name: "React", category: "LIBRARY / INTERFACE", description: "Component-based interfaces that connect application state with clear, responsive experiences." },
  { id: "postgresql", name: "PostgreSQL", category: "DATABASE / RELATIONAL", description: "An open-source relational database for structured data, queries, and application persistence." },
];

export const supportingTechnologies = [
  { id: "backend", category: "BACKEND", items: [
    { id: "djangorest", name: "Django REST Framework", href: "https://www.django-rest-framework.org/" },
  ] },
  { id: "deployment", category: "DEPLOYMENT PLATFORMS", items: [
    { id: "vercel", name: "Vercel", href: "https://vercel.com/docs" },
    { id: "render", name: "Render", href: "https://render.com/docs" },
  ] },
  { id: "frontend", category: "FRONTEND", items: [
    { id: "javascript", name: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { id: "typescript", name: "TypeScript", href: "https://www.typescriptlang.org/docs/" },
    { id: "html5", name: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { id: "css3", name: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { id: "tailwindcss", name: "Tailwind CSS", href: "https://tailwindcss.com/docs/installation/using-vite" },
    { id: "motion", name: "Motion (Framer Motion)", href: "https://motion.dev/docs/react" },
  ] },
  { id: "development", category: "DEVELOPMENT TOOLS", items: [
    { id: "docker", name: "Docker", href: "https://docs.docker.com/" },
    { id: "git", name: "Git", href: "https://git-scm.com/doc" },
    { id: "github", name: "GitHub", href: "https://docs.github.com/" },
    { id: "vscode", name: "Visual Studio Code", href: "https://code.visualstudio.com/docs" },
    { id: "vitejs", name: "Vite", href: "https://vite.dev/guide/" },
    { id: "postman", name: "Postman", href: "https://learning.postman.com/docs/getting-started/overview/" },
  ] },
  { id: "ai", category: "AI DEVELOPMENT TOOLS", items: [
    { id: "codex", name: "OpenAI Codex", href: "https://github.com/openai/codex#readme" },
    { id: "claudecode", name: "Claude Code", href: "https://code.claude.com/docs/en/overview" },
  ] },
];
