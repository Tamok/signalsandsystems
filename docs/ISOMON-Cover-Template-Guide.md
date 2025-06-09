# ISOMON Cover Template Usage Guide

## Overview
This template provides a consistent design framework for all ISOMON episode covers, featuring:
- Isometric 8-bit/Zelda/Pokemon style village background
- Four customizable content quadrants 
- Professional title area with proper contrast
- Consistent branding and visual style

## Template Structure

### Background Elements
- **Vichy pattern base**: Light green checkered background
- **Diagonal grid overlay**: Subtle grid pattern for texture
- **Isometric town pattern**: Village-style buildings and roads
- **Scattered buildings & isopods**: Non-intrusive decorative elements

### Content Areas (All Customizable)

#### Top-Left Quadrant (60, 60) - 520x130px
- Primary technical content
- Component specifications
- Hardware details

#### Top-Right Quadrant (620, 60) - 520x130px  
- Secondary technical content
- System specifications
- Performance metrics

#### Bottom-Left Quadrant (60, 220) - 520x140px
- Implementation details
- Architecture diagrams
- Process flows

#### Bottom-Right Quadrant (620, 220) - 520x140px
- Status & results
- System integration
- Future considerations

#### Title Area (0, 420) - 1200x210px
- Episode number and title
- Subtitle and description
- Status indicator

## Usage Instructions

1. **Copy the template**: Start with `isomon-cover-template.svg`
2. **Replace placeholders**: Update all `[PLACEHOLDER]` text
3. **Customize content**: Replace placeholder content in each quadrant
4. **Update title info**: Modify episode number, title, subtitle, description
5. **Set status**: Update the status indicator
6. **Remove template notice**: Delete the red template instructions box
7. **Save with episode number**: Name as `isomon-X-cover.svg`

## Customization Guidelines

### Colors Used
- **Primary green**: `#22c55e` (interactive elements)
- **Text colors**: White, `#93c5fd`, `#60a5fa` (title area)
- **Quadrant backgrounds**: Dark gradient with transparency
- **Accent colors**: Blue (`#3b82f6`), Purple (`#a855f7`), Orange (`#f59e0b`), Red (`#ef4444`)

### Typography
- **Main title**: 48px bold white
- **Subtitle**: 24px `#93c5fd`
- **Description**: 18px `#60a5fa`
- **Quadrant titles**: 16px bold white
- **Body text**: 10-12px with appropriate contrast

### Positioning Rules
- **Quadrants**: Must stay within boundaries (no overlap with title at y=420)
- **Title area**: Fixed at bottom (y=420-630)
- **Background elements**: Keep opacity low (0.3-0.4) to not interfere

## Technical Details
- **Canvas size**: 1200x630px (standard social media cover)
- **Safe zones**: 60px margins on sides, quadrants end at y=360
- **Title area**: Starts at y=420 with strong background for contrast
- **All elements**: Properly positioned to avoid overlaps

## Examples
- **ISOMON #1**: Building the First Monitoring Node
- Uses ESP32-C6, sensor specifications, terrarium monitoring, and system architecture

## Files
- `isomon-cover-template.svg` - Clean template for new episodes
- `isomon-1-cover.svg` - Completed ISOMON #1 cover (reference example)
- `isomon-1-cover-old.svg` - Archived original version
