import * as shiki from 'shiki';
console.log(Object.keys(shiki));
if (shiki.getHighlighter) {
  console.log('getHighlighter exists');
} else {
  console.log('getHighlighter does NOT exist');
}
if (shiki.Highlighter) {
  console.log('Highlighter exists');
} else {
  console.log('Highlighter does NOT exist');
}
