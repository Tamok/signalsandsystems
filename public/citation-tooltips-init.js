// This file is placed in public/ so it can be loaded by a <script src="..."> tag.
import('/src/components/ui/citation-tooltips.js').then(mod => {
  if (mod && typeof mod.default === 'function') {
    mod.default();
  }
});
