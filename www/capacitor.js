/**
 * Capacitor bridge stub — remplacé automatiquement par le vrai capacitor.js
 * lors du build natif (npx cap sync).
 * Ce fichier permet à l'app de fonctionner aussi dans un navigateur classique.
 */
if (typeof window !== 'undefined' && !window.Capacitor) {
  window.Capacitor = {
    isNative: false,
    isNativePlatform: () => false,
    getPlatform: () => 'web',
    Plugins: {},
  };
}
