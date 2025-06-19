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

## Voice and Content Profile

**PRIMARY PERSONA REFERENCE**: All content creation and writing assistance must reference the comprehensive voice training profile in `persona.json` (excluded from version control).

### Article Writing Guidelines

When assisting with article creation, blog posts, or any written content:

1. **Voice Consistency**: Use `persona.json` as the primary reference for:
   - Writing style and tone
   - Technical expertise and knowledge areas
   - Communication preferences and patterns
   - Professional background and experience
   - Personal interests and perspectives

2. **Content Standards**: 
   - Maintain the author's authentic voice while ensuring clarity and engagement
   - Reference the detailed background in signals processing, electrical engineering, and software development
   - Incorporate insights from the author's entrepreneurial experience and project leadership
   - Draw from the comprehensive online presence and community involvement documented in the persona

3. **Technical Writing**: 
   - Leverage the detailed technical expertise areas documented in the persona
   - Maintain consistency with the author's demonstrated knowledge across platforms (Stack Overflow, GitHub, Reddit)
   - Reference specific certifications and professional experience when relevant

4. **Content Adaptation**:
   - Adapt content complexity based on the target audience while maintaining the author's analytical approach
   - Incorporate the author's demonstrated passion for education and knowledge sharing
   - Reflect the creative and technical balance shown across various platforms and projects

### Usage Instructions for AI Assistants

- **ALWAYS** reference `persona.json` before writing any article content
- Use the detailed background information to inform technical depth and accuracy
- Maintain consistency with the documented communication style and preferences
- Draw from the comprehensive platform activity patterns to understand audience engagement approaches
- Reference specific experiences, projects, and expertise areas as documented in the persona file
- **For detailed article writing guidance**, refer to the comprehensive `article-writing-guide.md` in this instructions directory

### Content Creation Resources

- **Primary Persona Reference**: `persona.json` (comprehensive voice training profile)
- **Article Writing Workflow**: `.github/instructions/article-writing-guide.md`
- **Technical Guidelines**: This document's development principles and code style sections

## Content Management System Guidelines

Based on successful implementation of multi-collection content management, follow these patterns when working with Astro content collections:

### Multi-Collection Support
- Design utility functions to work across multiple collections (`devlog`, `isomon`, etc.)
- Include collection prefixes in article slugs for proper routing (`devlog/slug`, `isomon/slug`)
- Use TypeScript union types for collection names to ensure type safety

```typescript
export async function getAllArticles(): Promise<Article[]> {
  const allArticles: Article[] = [];
  
  // Fetch from multiple collections
  const devlogEntries = await getCollection('devlog');
  const isomonEntries = await getCollection('isomon');
  
  // Transform and combine with collection prefixes
  const devlogArticles = devlogEntries.map(entry => ({
    // ...existing properties...
    slug: `devlog/${entry.slug}`, // Include collection prefix
  }));
  
  allArticles.push(...devlogArticles, ...isomonArticles);
  return allArticles;
}
```

### Dynamic Link Patterns
- Avoid hardcoded collection-specific links (`/devlog/`, `/isomon/`)
- Use dynamic article slugs that include collection information: `/${article.slug}`
- This pattern enables easy addition of new collections without code changes

```astro
<!-- Preferred: Dynamic routing -->
<a href={`/${article.slug}`}>Read article</a>

<!-- Avoid: Hardcoded collection paths -->
<a href={`/devlog/${article.slug}`}>Read article</a>
```

### Dynamic Routing Best Practices
- **Always prefer dynamic routes over static files** when content follows a pattern
- Use dynamic routes (`[slug].astro`) instead of creating individual files for each series/collection
- Dynamic routes provide consistency, maintainability, and single source of truth for data
- Static files take precedence over dynamic routes in Astro - avoid conflicts by using one approach consistently

```astro
<!-- Preferred: Dynamic route that handles all series -->
// src/pages/series/[slug].astro
---
import { getSeriesBySlug } from '../../utils/content';
const { slug } = Astro.params;
const series = await getSeriesBySlug(slug);
---
<BaseLayout title={`${series.title} | Site Name`} description={series.description}>
  <!-- Dynamic content based on series data -->
</BaseLayout>

<!-- Avoid: Individual static files for each series -->
// src/pages/series/devlog.astro (DELETE THIS APPROACH)
// src/pages/series/geo.astro (DELETE THIS APPROACH)
```

#### Dynamic Route Benefits
- **Single source of truth**: Content data lives in JSON/content collections, not scattered across files
- **Maintainable**: Add new series by creating content files, not new page files
- **Consistent**: All series follow the same layout and behavior patterns
- **Flexible**: Easy to add conditional logic based on series properties
- **DRY principle**: Write once, use for all series

#### Implementation Guidelines
- Store series metadata in content collections (JSON files)
- Use `getStaticPaths()` to generate routes at build time
- Handle missing series gracefully with 404 redirects
- Pass series data through props for type safety
- Implement conditional rendering based on series properties (e.g., citation systems, special styling)

### Collection-Agnostic Components
- Build components that work with any content collection
- Pass collection information through props rather than hardcoding
- Use conditional logic based on slug patterns when collection-specific behavior is needed

```astro
---
// Determine collection from slug
const collection = article.slug.split('/')[0];
const isDevlog = collection === 'devlog';
const isIsomon = collection === 'isomon';
---

<article class={`article ${collection}-article`}>
  {isDevlog && <DevlogSpecificComponent />}
  {isIsomon && <IsomonSpecificComponent />}
</article>
```

### Content Utility Best Practices
- Handle missing collections gracefully with try-catch blocks
- Sort articles consistently across collections (by date, order, etc.)
- Filter out draft content uniformly across all collections
- Provide meaningful error messages and fallbacks

## Interactive Component Guidelines

When creating interactive components for technical documentation, follow these established patterns:

### SVG-Based Interactive Elements
- Use SVG for scalable, interactive technical diagrams
- Implement zoom and pan functionality with mouse and touch support
- Provide reset controls for returning to default view
- Layer content logically (background, components, connections, annotations)

```astro
---
interface Props {
  zoomable?: boolean;
  width?: number;
  height?: number;
}

const { zoomable = true, width = 800, height = 600 } = Astro.props;
---

<div class={`diagram-container ${zoomable ? 'zoomable' : ''}`}>
  <svg viewBox={`0 0 ${width} ${height}`} class="interactive-svg">
    <!-- Content structured in logical layers -->
  </svg>
</div>

{zoomable && (
  <script>
    // Progressive enhancement - add interactivity
    // Include touch support for mobile devices
    // Implement smooth zoom and pan with transform matrices
  </script>
)}
```

### Technical Diagram Standards
- Use consistent color coding across diagrams:
  - **Power (Red #dc2626)**: Voltage/power connections
  - **Ground (Black #000000)**: Ground connections  
  - **Signal (Blue #2563eb)**: Data/analog signals
  - **Communication (Green #059669)**: I2C, SPI, serial protocols
- Route connections to avoid overlaps using layered paths
- Label components clearly with readable typography
- Include legends and annotations for clarity

### Progressive Enhancement Patterns
- Ensure functionality without JavaScript (static fallback)
- Add interactivity as enhancement rather than requirement
- Provide clear visual feedback for interactive elements
- Test thoroughly on mobile and desktop devices

```astro
<!-- Base functionality works without JavaScript -->
<svg viewBox="0 0 800 600" class="technical-diagram">
  <!-- Static content that's always accessible -->
</svg>

<!-- Enhanced interactivity added progressively -->
{interactive && (
  <script>
    // Enhancement code that improves but doesn't break experience
  </script>
)}
```

### Accessibility in Interactive Components
- Ensure keyboard navigation for interactive elements
- Provide ARIA labels for complex SVG content
- Maintain sufficient color contrast for all visual elements
- Include text alternatives for purely visual information
- Test with screen readers and assistive technologies
