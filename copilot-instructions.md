# GitHub Copilot Instructions for Signals & Systems

This document provides guidance for GitHub Copilot when assisting with the Signals & Systems blog platform project. These instructions help ensure that suggestions align with the project's architecture, design principles, and development practices.

## Project Overview

Signals & Systems is a personal, self-hosted publishing platform built with Astro, focusing on:

- Content-first design with clean typography
- Interactive elements via MDX components
- Performance optimization with minimal JavaScript
- Responsive design across all devices
- Accessibility as a core principle
- Series-based content organization

## Technology Stack

- **Framework**: Astro v5.7+
- **Styling**: Tailwind CSS v4.1+
- **Markdown Extension**: MDX
- **Date Handling**: date-fns v4.1+
- **Package Manager**: pnpm v10.6+

## Development Principles

When suggesting code for this project, adhere to these core principles:

1. **Content-First Approach**: Prioritize readability and content accessibility over flashy design elements.

2. **Progressive Enhancement**: Build with a baseline of semantic HTML, enhance with CSS, and only add JavaScript where it meaningfully improves the user experience.

3. **Performance Budget**: Keep page load times minimal. Lazy load images and defer non-critical scripts.

4. **Accessibility**: Maintain WCAG 2.1 AA compliance or better. Ensure proper contrast ratios, semantic HTML, keyboard navigation, and screen reader support.

5. **Minimalist Design**: Follow a clean, distraction-free aesthetic that emphasizes content while maintaining visual hierarchy.

6. **Component-Based Architecture**: Create reusable, well-documented components with clear responsibilities.

7. **Vibe Coding**: Balance technical excellence with intuitive, human-centered design while leveraging AI automation for repetitive tasks.

## Code Style Guidelines

### General

- Use TypeScript for type safety when applicable
- Prefer const over let when variables won't be reassigned
- Use descriptive variable and function names
- Add meaningful comments for complex logic only
- Keep functions small and focused on a single responsibility

### Astro Components

- Follow Astro's component structure with frontmatter at the top
- Keep component props well-typed and documented
- Use client directives (client:load, client:idle) judiciously
- Leverage Astro's partial hydration model

```astro
---
// Component frontmatter with imports and logic
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Default description' } = Astro.props;
---

<!-- Component template -->
<div class="component-wrapper">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  /* Component-specific styles (if not using Tailwind) */
</style>

<script>
  // Only include client-side JavaScript if absolutely necessary
</script>
```

### Tailwind CSS

- Use Tailwind utility classes directly in HTML for styling
- Follow the project's extended color palette and spacing scale
- For complex components, consider extracting common patterns using @apply in a CSS file
- Maintain responsive design using Tailwind's breakpoint prefixes

### MDX Content

- Keep MDX files clean and focused on content
- Import complex components at the top of the file
- Use frontmatter for metadata consistently

## Project Structure Guidelines

- Place new components in `src/components/`
- Add new pages in `src/pages/` with appropriate nesting
- Place layout templates in `src/layouts/`
- Store utility functions in `src/utils/`
- Add static assets to the `public/` directory

## Documentation Requirements

When developing new features or components:

1. Update CHANGELOG.md with detailed entries and proper timestamps
2. Document new components in COMPONENTS.md
3. Update README.md when adding significant features
4. Keep code well-commented for complex logic

## Performance Considerations

- Ensure images have the `loading="lazy"` attribute
- Keep JavaScript to a minimum
- Use appropriate image formats (WebP, SVG) based on content type
- Implement responsive images with srcset when needed

## Accessibility Guidelines

- Use semantic HTML elements appropriately
- Ensure all interactive elements are keyboard accessible
- Provide descriptive but concise alt text for images
- Maintain color contrast ratios of at least 4.5:1 for normal text
- Use ARIA attributes only when necessary and correctly

## Next Development Tasks

Reference the NEXT-STEPS.md file for upcoming features and improvements planned for the platform. Current priorities include:

1. Creating Devlog #2 about interactive components
2. Enhancing code syntax highlighting
3. Implementing dark mode
4. Adding comment system integration
5. Implementing search functionality
6. Adding newsletter integration
7. Adding RSS feed support

## Testing and Quality Assurance

Before suggesting code changes, consider:

- Does the code maintain or improve performance?
- Is the solution accessible to users with disabilities?
- Does it maintain consistent styling with the rest of the site?
- Is the implementation cross-browser compatible?
- Have edge cases been handled appropriately?

## Contact and Resources

For additional project context and guidance, refer to:

- GitHub: [github.com/Tamok](https://github.com/Tamok)
- LinkedIn: [linkedin.com/in/jonathan-engeln](https://www.linkedin.com/in/jonathan-engeln/)
- Astro Documentation: [astro.build/docs](https://astro.build/docs)
