# Signals & Systems

A personal, self-hosted publishing platform designed for long-form, markdown-native articles enriched with interactive elements. Built with the latest web technologies, it emphasizes performance, accessibility, and developer experience.

## 📝 Project Overview

**Signals & Systems** is more than a blog - it's a platform for exploring ideas at the intersection of technology, education, and ethics. With a focus on long-form content that can include interactive elements, the platform aims to provide a rich reading and learning experience.

### Key Features

- **Content-First Design**: Clean typography and layout optimized for reading
- **Interactive Elements**: MDX support for embedding custom components
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Performance Focused**: Fast load times with minimal JavaScript
- **Series Support**: Group related articles with automatic navigation

## 🚀 Technology Stack

- **Framework**: [Astro](https://astro.build/) – A modern static site generator optimized for content-driven websites
- **Markdown Extension**: [MDX](https://mdxjs.com/) – Allows embedding JSX components within Markdown content
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- **Graphics**: SVG-based images for crisp visuals and optimal performance
- **Charts**: Interactive data visualization with Chart.js
- **Analytics**: Google Tag Manager integrated with GA4
- **Hosting**: GitHub Pages with automated deployment via GitHub Actions

## 🧱 Project Structure

```
/
├── public/               # Static assets
│   └── images/           # Images and media files
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── AuthorBio.astro
│   │   ├── CalloutBox.astro
│   │   ├── ChartComponent.astro
│   │   ├── Footer.astro
│   │   ├── Nav.astro
│   │   ├── SeriesNav.astro
│   │   └── SGEO.astro    # Search and Generative Engine Optimization
│   ├── layouts/          # Page layout templates
│   │   ├── ArticleLayout.astro
│   │   ├── BaseLayout.astro
│   │   └── SeriesLayout.astro
│   ├── pages/            # Route definitions and page content
│   │   ├── about.astro
│   │   ├── articles.astro
│   │   ├── index.astro
│   │   ├── series.astro
│   │   ├── devlog/
│   │   └── series/
│   └── styles/           # Global styles
│       └── global.css    # Import for Tailwind CSS
├── CHANGELOG.md          # Detailed changelog with timestamps
├── COMPONENTS.md         # Component index and documentation
├── copilot-instructions.md # Development guidelines for GitHub Copilot
├── NEXT-STEPS.md         # Development roadmap and future plans
├── astro.config.mjs      # Astro configuration
└── package.json          # Project dependencies
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |

## 📚 Content Strategy

The blog hosts articles that can either be part of a series or standalone pieces. Series automatically generate navigation links between articles as they are published. The platform is designed to be modular, fluid, information-driven, and high quality, while minimalist on both the front and back end.

## 📝 Devlog and Changelog

The [Devlog Series](/series/devlog) documents the creation and evolution of this platform, providing insights into technical decisions, challenges, and ethical considerations. The [CHANGELOG.md](./CHANGELOG.md) maintains a detailed record of all significant features and actions with timestamps. 

For future development plans and upcoming features, see [NEXT-STEPS.md](./NEXT-STEPS.md).

## 👤 Author

**Jonathan Engeln (JELL)** is an innovator, educator, and technologist exploring the confluence of AI, higher education, and ethical technology. Through _Signals & Systems_, JELL shares insights, experiments, and reflections on building meaningful digital experiences, and other random things.

- GitHub: [github.com/Tamok](https://github.com/Tamok)
- LinkedIn: [linkedin.com/in/jonathan-engeln](https://www.linkedin.com/in/jonathan-engeln/)
