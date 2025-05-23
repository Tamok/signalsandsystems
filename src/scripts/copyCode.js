// This script adds copy functionality to code blocks
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      const pre = button.parentElement.querySelector('pre');
      const code = pre.querySelector('code');
      const text = code.innerText;
      
      navigator.clipboard.writeText(text).then(() => {
        // Show success state
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      });
    });
  });
});
