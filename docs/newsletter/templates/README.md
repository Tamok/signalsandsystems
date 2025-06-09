# Buttondown Email Templates (Markdown)

This directory contains Markdown-formatted email templates for the Signals & Systems newsletter system, designed for Buttondown's free plan.

## Template Files

### 📧 Email Templates (Markdown Format - Free Plan)
- `confirmation-email.md` - Double opt-in confirmation email
- `welcome-email.md` - Welcome email sent after subscription confirmation
- `newsletter-template.md` - Main newsletter content template  
- `reminder-email.md` - Subscription reminder email
- `web-archive-template.md` - Public newsletter archive page

### 📄 Legacy Templates (HTML Format - Paid Plan Only)
- `confirmation-email.html` - HTML confirmation email (requires paid plan)
- `newsletter-template.html` - HTML newsletter template (requires paid plan)
- `reminder-email.html` - HTML reminder email (requires paid plan)
- `web-archive-template.html` - HTML archive template (requires paid plan)

## Free Plan vs Paid Plan

### ✅ Free Plan (Current Setup)
- Uses Markdown templates with Buttondown's default styling
- Basic formatting: headers, bold, italic, links, lists
- Buttondown variables work normally
- No custom HTML/CSS styling
- Professional appearance with built-in responsive design

### 💰 Paid Plan Features
- Custom HTML templates with full CSS control
- Advanced responsive design customization
- Custom branding and colors
- Email client-specific optimizations
- Full design control over layout and styling

## Template Structure

### confirmation-email.md
Double opt-in confirmation email sent when someone subscribes to the newsletter.

### welcome-email.md
Welcome email sent after a subscriber confirms their email address, introducing them to the newsletter.

### newsletter-template.md  
Main newsletter template for sending articles and updates to confirmed subscribers.

### reminder-email.md
Reminder email for subscribers who haven't confirmed their subscription yet.

### web-archive-template.md
Template for Buttondown's public web archive view (if enabled).

## Buttondown Variables

Common variables available in all templates:

### Subscriber Variables
- `{{ subscriber.email }}` - Subscriber's email address
- `{{ subscriber.name }}` - Subscriber's name (if collected)
- `{{ subscriber.notes }}` - Any subscriber notes
- `{{ subscriber.tags }}` - Subscriber tags
- `{{ subscriber.metadata }}` - Custom metadata
- `{{ subscriber.referrer_url }}` - Where they signed up from

### Email Variables
- `{{ confirmation_url }}` - Confirmation link for new subscribers
- `{{ unsubscribe_url }}` - Unsubscribe link
- `{{ archive_url }}` - Link to email archive
- `{{ email.subject }}` - Email subject line
- `{{ email.content }}` - Email body content

### Newsletter Variables
- `{{ newsletter.name }}` - Newsletter name
- `{{ newsletter.description }}` - Newsletter description
- `{{ newsletter.url }}` - Newsletter website URL

### Platform Variables
- `{{ current_date }}` - Current date
- `{{ current_year }}` - Current year

## Using Markdown Templates with Buttondown

### Setup Instructions
1. **Log into Buttondown**: Go to your dashboard at buttondown.email
2. **Access Settings**: Navigate to Settings → Email Templates
3. **Select Template Type**: Choose the email type (confirmation, newsletter, etc.)
4. **Switch to Markdown**: If available, switch from HTML to Markdown mode
5. **Copy Content**: Copy the content from the `.md` files in this directory
6. **Paste and Save**: Paste into Buttondown's template editor and save

### Markdown Formatting
Buttondown supports standard Markdown syntax:
- `# Header 1`, `## Header 2`, etc.
- `**bold text**` and `*italic text*`
- `[link text](url)` for links
- `- item` for bullet lists
- `---` for horizontal dividers
- Emoji support: 🎯 📧 ✅ 🔒

### Template Variables
All Buttondown template variables work in Markdown format:
- `{{ confirmation_url }}` - Email confirmation link
- `{{ subscriber.email }}` - Subscriber's email address
- `{{ unsubscribe_url }}` - One-click unsubscribe link
- `{{ archive_url }}` - Newsletter archive link

## Design Considerations

1. **Email Clients**: Markdown renders consistently across email clients
2. **Mobile First**: Buttondown's default styling is mobile-responsive  
3. **Accessibility**: Clean Markdown structure improves screen reader compatibility
4. **Brand Consistency**: Use consistent messaging and emoji for brand recognition

## Brand Guidelines

- **Voice**: Professional but approachable, technical but accessible
- **Messaging**: Privacy-first, no-tracking emphasis
- **Structure**: Clear headings, short paragraphs, scannable content
- **Visual Elements**: Strategic use of emoji for visual interest
- **Call-to-Actions**: Clear, action-oriented button text

---

- For a full overview of the newsletter system, see [NEWSLETTER-SYSTEM.md](https://github.com/Tamok/sastro/blob/main/docs/newsletter/NEWSLETTER-SYSTEM.md)
- For setup instructions, see [BUTTONDOWN-SETUP.md](https://github.com/Tamok/sastro/blob/main/docs/newsletter/BUTTONDOWN-SETUP.md)
- For deployment steps, see [DEPLOYMENT-CHECKLIST.md](https://github.com/Tamok/sastro/blob/main/docs/newsletter/DEPLOYMENT-CHECKLIST.md)
- For a quick start, see [QUICK-START-NEWSLETTER.md](https://github.com/Tamok/sastro/blob/main/docs/newsletter/QUICK-START-NEWSLETTER.md)
