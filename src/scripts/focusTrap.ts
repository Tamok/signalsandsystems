// Minimal focus-trap utility for modal dialogs.
// Scopes Tab/Shift-Tab inside `root`, handles ESC, restores focus on release.

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface FocusTrapOptions {
  onEscape?: () => void;
  initialFocus?: HTMLElement;
}

export function createFocusTrap(root: HTMLElement, options: FocusTrapOptions = {}) {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const getFocusable = () =>
    Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
    );

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && options.onEscape) {
      event.preventDefault();
      options.onEscape();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (active === first || !root.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !root.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKeydown);

  const toFocus = options.initialFocus ?? getFocusable()[0] ?? root;
  toFocus.focus();

  return () => {
    document.removeEventListener('keydown', handleKeydown);
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
}
