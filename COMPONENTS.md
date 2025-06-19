# Signals & Systems Component Index

This document serves as a reference guide for all components and layouts in the Signals & Systems platform.

## Layouts

### BaseLayout
- **File:** `/src/layouts/BaseLayout.astro`
- **Description:** The primary layout that includes global head elements, navigation, and footer.
- **Props:**
  - `title`: Page title
  - `description`: Meta description
  - `ogImage`: Open Graph image URL
  - `canonicalURL`: Canonical URL for SEO

### ArticleLayout
- **File:** `/src/layouts/ArticleLayout.astro`
- **Description:** Layout for standalone articles with author bio.
- **Props:**
  - `title`: Article title
  - `description`: Article description
  - `publishDate`: Publication date
  - `updatedDate`: Last update date (optional)
  - `coverImage`: Article cover image URL (optional)
  - `ogImage`: Open Graph image URL (optional)
  - `canonicalURL`: Canonical URL (optional)

### SeriesLayout
- **File:** `/src/layouts/SeriesLayout.astro`
- **Description:** Layout for articles that are part of a series, with navigation between articles.
- **Props:**
  - Standard article props (see ArticleLayout)
  - `seriesTitle`: Title of the series
  - `seriesSlug`: URL slug for the series
  - `seriesArticles`: Array of articles in the series
  - `currentArticleSlug`: Slug of the current article

## Components

### Nav
- **File:** `/src/components/Nav.astro`
- **Description:** Main navigation bar with responsive mobile menu.

### Footer
- **File:** `/src/components/Footer.astro`
- **Description:** Site footer with navigation and social links.

### SGEO (Search and Generative Engine Optimization)
- **File:** `/src/components/SGEO.astro`
- **Description:** Handles meta tags for SEO, social sharing, and LinkedIn integration.

## Citation System Components

### CitationItem
- **File:** `/src/components/ui/CitationItem.astro`
- **Description:** Shared citation item component with smooth drawer animations and accessibility features.
- **Props:**
  - `citation`: Citation object with title, author, year, source, URL, tags, and usage information
  - `containerClass`: CSS class for styling context (optional)
- **Features:**
  - Precise height-based drawer animations (60fps)
  - Full WCAG 2.1 AA accessibility compliance
  - Keyboard navigation (Enter/Space to toggle, Escape to close)
  - Screen reader support with ARIA attributes
  - Hover interactions with intelligent delays

### GlobalCitationListNew
- **File:** `/src/components/ui/GlobalCitationListNew.astro`
- **Description:** Displays all citations from consolidated data source with tag filtering and sorting.
- **Features:**
  - Uses consolidated-citations.json data source
  - Tag-based filtering with dynamic updates
  - Multiple sorting options (author, title, year)
  - Shared CitationItem component for consistency
  - Enhanced drawer functionality with smooth animations

### SeriesCitationListNew
- **File:** `/src/components/ui/SeriesCitationListNew.astro`
- **Description:** Displays citations specific to a series with usage tracking.
- **Props:**
  - `seriesSlug`: The slug identifier for the series
- **Features:**
  - Filters citations used in specific series
  - Same tag filtering and sorting as global list
  - Consistent UX with global citation list
  - Shows usage across both series and individual articles

### CitationTagFilter
- **File:** `/src/components/ui/CitationTagFilter.astro`
- **Description:** Interactive tag filter component for citation lists.
- **Props:**
  - `tags`: Array of available tags
  - `selectedTag`: Currently selected tag (optional)
  - `filterKey`: Unique identifier for filter state
- **Features:**
  - Client-side filtering with immediate updates
  - Accessible button design with clear active states
  - Integrated with citation list components

### CitationList (Auto-Generation)
- **File:** `/src/components/ui/CitationList.astro`
- **Description:** Auto-generates citation lists from CitedText components in articles.
- **Features:**
  - Scans page for CitedText elements
  - Automatically builds formatted reference list
  - Demure styling consistent with platform design
  - Used in article layouts for in-content citations

### CitedText
- **File:** `/src/components/CitedText.astro`
- **Description:** Inline citation component for referencing sources within article content.
- **Props:**
  - `title`: Source title
  - `author`: Source author (optional)
  - `year`: Publication year (optional)
  - `url`: Source URL (optional)
- **Features:**
  - Automatic citation list integration
  - Accessible link styling
  - Hover effects and focus indicators

### ChartComponent
- **File:** `/src/components/ChartComponent.astro`
- **Description:** Renders interactive charts using Chart.js.
- **Props:**
  - `type`: Chart type ('line', 'bar', 'pie', 'doughnut')
  - `data`: Chart data object with labels and datasets
  - `title`: Chart title (optional)
  - `description`: Chart description (optional)
  - `height`: Chart height in pixels (default: 400)
  - `width`: Chart maximum width in pixels (default: 600)
  - `options`: Additional Chart.js options
- **Props:**
  - `type`: Chart type ('line', 'bar', 'pie', 'doughnut')
  - `data`: Chart data object
  - `title`: Chart title (optional)
  - `description`: Chart description (optional)
  - `height`: Chart height in pixels (default: 400)
  - `width`: Chart width in pixels (default: 600)
  - `id`: Unique ID for the chart (auto-generated if not provided)
  - `options`: Additional Chart.js options

### CalloutBox
- **File:** `/src/components/CalloutBox.astro`
- **Description:** Styled box for highlighting important information.
- **Props:**
  - `type`: Box type ('info', 'warning', 'error', 'tip')
  - `title`: Box title (optional)

### SeriesNav
- **File:** `/src/components/SeriesNav.astro`
- **Description:** Navigation between articles in a series.
- **Props:**
  - `seriesTitle`: Title of the series
  - `seriesSlug`: URL slug for the series
  - `prevArticle`: Previous article object (null if first article)
  - `nextArticle`: Next article object (null if last article)
  - `allArticles`: Array of all articles in the series
  - `currentSlug`: Slug of the current article

### AuthorBio
- **File:** `/src/components/AuthorBio.astro`
- **Description:** Displays author information at the end of articles with social links to GitHub and LinkedIn.

### CodeBlock
- **File:** `/src/components/CodeBlock.astro`
- **Description:** Enhanced code block with syntax highlighting and copy-to-clipboard functionality.
- **Props:**
  - `code`: The code string to be displayed and highlighted
  - `lang`: Programming language for syntax highlighting
  - `filename`: Optional filename to display above the code (optional)
  - `theme`: Color theme for highlighting (github-light or github-dark) (optional)
  - `showLineNumbers`: Whether to display line numbers (optional)

### CodeExample
- **File:** `/src/components/CodeExample.astro`
- **Description:** Demo component that displays example code in various languages.
- **Props:**
  - `language`: Programming language for the example (javascript, typescript, python, astro) (optional)
  - `showLineNumbers`: Whether to display line numbers (optional)
  - `theme`: Color theme for highlighting (github-light or github-dark) (optional)
  - `filename`: Optional filename to display above the code (optional)

### WiringSchematic
- **File:** `/src/components/WiringSchematic.astro`
- **Description:** Renders interactive SVG wiring schematics for electronics projects.
- **Props:**
  - `title`: Schematic title (optional, default: "Wiring Schematic")
  - `description`: Schematic description (optional)
  - `width`: SVG width in pixels (default: 800)
  - `height`: SVG height in pixels (default: 600)
  - `id`: Unique ID for the SVG element (auto-generated if not provided)
- **Features:**
  - Color-coded wiring (power, ground, signal, I2C)
  - Component representations with labels
  - Connection dots and pin labels
  - Built-in legend and notes
  - Responsive SVG scaling
- **Usage:** Ideal for documenting hardware connections in technical articles

## SVG Assets

### Favicon
- **File:** `/public/favicon.svg`
- **Description:** Responsive site favicon with dark/light mode support

### Author Image
- **File:** `/public/images/author-jell.svg`
- **Description:** Author avatar with gradient background and social icons

### Author Placeholder
- **File:** `/public/images/author-placeholder.svg`
- **Description:** Fallback author image with enhanced styling

### OG Default Image
- **File:** `/public/images/og-default.svg`
- **Description:** Default Open Graph image for social sharing

### Devlog Cover
- **File:** `/public/images/devlog-1-cover.svg`
- **Description:** Cover image for the first devlog article with code-themed design

## Pages

### Home
- **File:** `/src/pages/index.astro`
- **Description:** Landing page with featured content.

### Articles
- **File:** `/src/pages/articles.astro`
- **Description:** Lists all articles.

### Series
- **File:** `/src/pages/series.astro`
- **Description:** Lists all article series.

### Series Detail
- **File:** `/src/pages/series/[seriesSlug].astro`
- **Description:** Shows articles in a specific series.

### About
- **File:** `/src/pages/about.astro`
- **Description:** Information about the author and platform.

## Utilities

### getAllArticles
- **File:** `/src/utils/content.ts`
- **Description:** Returns all articles as an array of Article objects. Replace with Astro content collections for production.

### getAllSeries
- **File:** `/src/utils/content.ts`
- **Description:** Returns all series as an array of Series objects. Replace with Astro content collections for production.

### getSeriesArticles
- **File:** `/src/utils/content.ts`
- **Description:** Returns all articles in a given series. Replace with Astro content collections for production.
