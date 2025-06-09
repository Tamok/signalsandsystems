# Buttondown Dashboard Setup Guide (Free Plan)

## Overview
This guide walks through configuring your Buttondown free account to use the custom Markdown email templates and redirect pages created for the Signals & Systems newsletter system.

## Prerequisites
- Buttondown free account at https://buttondown.email
- Access to Buttondown dashboard
- Markdown templates from `buttondown-templates/` directory

## Step 1: Upload Markdown Email Templates

### 1.1 Access Template Settings
1. Log into your Buttondown dashboard
2. Navigate to **Settings** → **Emails**
3. You'll see template options for different email types

### 1.2 Upload Confirmation Email Template
1. Look for **Confirmation Email** or **Double Opt-in** settings
2. Find the template/content field (may be in Markdown mode by default)
3. Copy the entire contents of `buttondown-templates/confirmation-email.md`
4. Paste into the template editor
5. Click **Save**

### 1.3 Upload Newsletter Template (for compose reference)
*Note: On free plan, you'll typically compose each newsletter individually*
1. Keep `newsletter-template.md` as a reference for composing newsletters
2. Use the structure and formatting when writing your newsletters
3. Copy sections as needed when composing individual newsletters

### 1.4 Upload Reminder Email Template
1. Look for **Reminder Email** or **Follow-up** settings
2. Copy the entire contents of `buttondown-templates/reminder-email.md`
3. Paste into the template editor
4. Click **Save**

*Note: The web archive template is typically not customizable on the free plan*

## Step 2: Configure Custom Redirects

### 2.1 Access Embed Settings
1. Navigate to **Settings** → **Embeds** or **Forms**
2. Look for redirect URL configuration options

### 2.2 Set Custom Redirect URLs (If Available)
Some free plan features may be limited, but try to configure:

- **Thank You Redirect**: `https://your-domain.com/subscribe/thank-you`
- **Confirmation Redirect**: `https://your-domain.com/subscribe/confirmed`

For the Signals & Systems site:
- **Thank You Redirect**: `https://signals-and-systems.com/subscribe/thank-you`
- **Confirmation Redirect**: `https://signals-and-systems.com/subscribe/confirmed`

*Note: If custom redirects aren't available on free plan, Buttondown will use default confirmation pages*

### 2.3 Save Configuration
1. Click **Save Settings** if changes were possible
2. Test the URLs to ensure your pages are accessible

## Step 3: Privacy and Compliance Settings

### 3.1 Disable Tracking Features
Navigate to **Settings** → **Privacy** and disable:
- [ ] Email open tracking
- [ ] Click tracking
- [ ] Tracking pixels
- [ ] Reply tracking
- [ ] Interaction metrics

### 3.2 Enable GDPR Compliance
1. Navigate to **Settings** → **Compliance**
2. Enable **Double Opt-in** confirmation
3. Configure **Data Retention** policies
4. Enable **Data Export** for subscribers
5. Set up **Automatic Deletion** for unsubscribed users

### 3.3 Configure Subscription Process
1. Ensure **Double Opt-in** is enabled
2. Set confirmation email to send immediately
3. Configure unsubscribe process to be one-click
4. Enable subscriber data export options

## Step 4: Test the Complete Flow

### 4.1 Test Email Subscription
1. Visit your website and trigger the newsletter popup
2. Enter a test email address
3. Check for confirmation email delivery (may use Buttondown's default styling)
4. Verify the email content matches your Markdown template

### 4.2 Test Email Templates
1. Send test emails from Buttondown dashboard
2. Verify Markdown formatting renders correctly
3. Test on different email clients and devices
4. Check that variables populate correctly

### 4.3 Test Confirmation Process
1. Click confirmation link in test email
2. Verify redirect to confirmation page (if custom redirects are configured)
3. Check that subscriber is marked as confirmed in dashboard
4. Test unsubscribe functionality

## Step 5: Writing Newsletters with Markdown

### 5.1 Using the Newsletter Template
1. When composing a newsletter, reference `newsletter-template.md`
2. Copy and adapt the structure for your content
3. Use Markdown formatting for headers, links, lists
4. Include subscriber variables as needed

### 5.2 Markdown Best Practices
- Use `# Header` for main titles
- Use `## Subheader` for sections  
- Use `**bold**` for emphasis
- Use `[link text](url)` for links
- Use `---` to create visual separators
- Include emoji strategically: 📬 🎯 ✅ 🔒

## Step 6: Free Plan Limitations and Workarounds

### 6.1 Template Limitations
- **Limited customization**: Templates use Buttondown's default styling
- **No custom HTML**: Only Markdown formatting available
- **No custom CSS**: Cannot override Buttondown's styles

### 6.2 Workarounds for Brand Consistency
- **Consistent messaging**: Use the same voice and terminology
- **Emoji branding**: Strategic use of emoji for visual consistency
- **Content structure**: Maintain consistent layout and organization
- **Footer branding**: Include brand information in email footers

## Step 6: Monitoring and Maintenance

### 6.1 Regular Checks
- Monitor email deliverability rates
- Check template rendering across email clients
- Verify redirect pages are functioning
- Review subscriber feedback

### 6.2 Template Updates
When updating templates:
1. Edit files in `buttondown-templates/` directory
2. Copy updated HTML to Buttondown dashboard
3. Send test emails to verify changes
4. Update documentation if needed

## Troubleshooting

### Common Issues
1. **Templates not rendering**: Check HTML syntax, ensure variables are correct
2. **Redirects not working**: Verify URLs are accessible and correctly configured
3. **Emails not sending**: Check Buttondown service status and API limits
4. **Styling issues**: Test across different email clients, check CSS compatibility

### Getting Help
- Buttondown Documentation: https://docs.buttondown.email
- Buttondown Support: support@buttondown.email
- Template Documentation: See [templates/README.md](https://github.com/Tamok/sastro/blob/main/docs/newsletter/templates/README.md)

## Security Notes
- Never expose API keys in client-side code
- Regularly review subscriber data and privacy settings
- Keep templates updated with latest security practices
- Monitor for spam complaints and adjust accordingly

## Backup Recommendations
- Regularly export subscriber lists
- Keep local copies of custom templates
- Document all configuration changes
- Monitor email deliverability metrics
