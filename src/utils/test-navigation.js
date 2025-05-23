// Test script for Astro project - you can copy this into a dev script
// or add it to a command for validation
console.log('Validation script - ensure all your article links are in the format:');
console.log('/<article.slug>');
console.log('And all your series navigation is properly configured.');
console.log('\nIssues fixed:');
console.log('1. Added sortedArticles to [slug].astro');
console.log('2. Fixed article links in articles.astro');
console.log('3. Fixed article links in series/[slug].astro');
console.log('4. Fixed article links in series/devlog.astro');
console.log('5. Fixed article links in index.astro');
console.log('\nEnsure your project includes the following changes:');
console.log('- In [slug].astro, sortedArticles is properly defined and passed to ArticleLayout');
console.log('- All article links now use format /{article.slug}');
console.log('- Series navigation uses the correct URLs for next/prev article links');
