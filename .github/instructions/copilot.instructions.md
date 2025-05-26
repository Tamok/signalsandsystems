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

## Development-Only Debug Information

When adding debug information for development purposes, follow these guidelines to ensure debug output doesn't interfere with production builds or layout:

### Environment-Based Conditional Rendering
- Always wrap debug output with `import.meta.env.DEV` to ensure it only appears during development
- Use this pattern for debug information that helps during development but should never appear in production

```astro
{import.meta.env.DEV && (
  <div class="debug-info">DEBUG: {someVariable}</div>
)}
```

### Overlay Debug Styles
- Use CSS positioning to overlay debug information without affecting document flow
- Prefer fixed or absolute positioning for debug elements
- Use distinctive styling (bright colors, borders) to clearly identify debug content

```astro
{import.meta.env.DEV && (
  <div class="fixed top-4 right-4 bg-red-500 text-white px-2 py-1 text-xs rounded z-50 pointer-events-none">
    DEBUG: {articles.length} articles loaded
  </div>
)}
```

### Debug Information Best Practices
- Keep debug messages concise and informative
- Include relevant context (component name, data counts, state information)
- Use consistent formatting across debug messages
- Position debug overlays in corners or edges to avoid content interference
- Add `pointer-events-none` to prevent debug elements from interfering with user interactions
- Use high z-index values (z-50, z-[9999]) to ensure debug info appears above other content

### Common Debug Patterns
```astro
<!-- Data count debug -->
{import.meta.env.DEV && (
  <div class="fixed bottom-4 left-4 bg-blue-600 text-white px-2 py-1 text-xs rounded">
    {componentName}: {dataArray.length} items
  </div>
)}

<!-- State debug -->
{import.meta.env.DEV && (
  <div class="absolute top-0 right-0 bg-yellow-500 text-black px-1 text-xs">
    State: {currentState}
  </div>
)}

<!-- Performance debug -->
{import.meta.env.DEV && (
  <div class="fixed top-4 left-4 bg-green-600 text-white px-2 py-1 text-xs rounded font-mono">
    Render: {Date.now()}ms
  </div>
)}
```

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
