# Newsletter System Documentation

## Overview
The newsletter subscription system integrates Buttondown's API into the Signals & Systems site as a dismissable popup that respects user privacy choices and follows GDPR compliance.

## Components

### SubscribePopup.astro
- **Location**: `src/components/SubscribePopup.astro`
- **Functionality**: 
  - Dismissable popup with minimize (-) and close (X) buttons
  - Buttondown form integration
  - Privacy tooltip with detailed tracking information
  - Responsive design for all screen sizes
  - localStorage state management

### State Management
- **Storage Key**: `ss-newsletter-popup`
- **States**:
  - `minimized: true` - Popup collapsed to mail icon
  - `closed: true, closedUntil: timestamp` - Hidden for 72 hours
  - No storage - Shows full popup

### Form Integration
- **Action**: `https://buttondown.com/api/emails/embed-subscribe/jell`
- **Method**: POST
- **Target**: `popupwindow` (opens Buttondown confirmation)
- **Required Field**: Email address

## Privacy Implementation

### No Tracking Features
Explicitly disabled in both popup tooltip and privacy policy:
- No email open tracking
- No click tracking 
- No tracking pixels
- No reply tracking
- No interaction metrics

### GDPR Compliance
- **Legal Basis**: Consent (Article 6(1)(a))
- **Data Processor**: Buttondown (with privacy policy link)
- **User Rights**: Unsubscribe anytime, data deletion on request
- **Data Retention**: Until unsubscribe or deletion request

## Technical Details

### Responsive Breakpoints
- **Desktop**: Fixed top-right, 320px width
- **Tablet**: Responsive width, max 320px
- **Mobile**: Full width minus margins, max 300px

### Accessibility Features
- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus management for tooltip
- Semantic HTML structure
- Screen reader friendly

### Browser Compatibility
- localStorage API (IE8+)
- CSS Grid/Flexbox (modern browsers)
- ES6+ JavaScript features

## Testing
Use `/newsletter-test` page to verify:
- Popup display and positioning
- Minimize/close functionality
- State persistence
- Form submission
- Privacy tooltip
- Responsive behavior

## Integration Points

### BaseLayout.astro
- Component imported and rendered site-wide
- Positioned after footer, before scripts
- No interference with existing consent popup

### Privacy Policy Updates
- Added newsletter data collection section
- Explicit no-tracking statements
- Buttondown as data processor
- User rights documentation

### Cookie Policy Updates
- Added `ss-newsletter-popup` localStorage entry
- Third-party services section
- Buttondown service documentation

## Future Enhancements
- A/B testing for popup timing
- Additional newsletter signup locations
- Integration with RSS automation
- Analytics for subscription conversion (privacy-compliant)
