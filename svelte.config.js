import sveltePreprocess from 'svelte-preprocess'
import importAssets from 'svelte-preprocess-import-assets'

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [sveltePreprocess(), importAssets()],
  onwarn: (warning, handler) => {
    switch (warning.code) {
      case 'a11y-missing-attribute':
      case 'a11y-click-events-have-key-events':
      case 'a11y-no-noninteractive-tabindex':
        return;
      default:
        //console.log(warning);
        handler(warning);
    }
  }
}
