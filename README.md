# Pad'up

Application mobile de réservation et suivi de matchs de padel.

## Stack

- **HTML / CSS / JS** vanilla — design complet dans `www/index.html`
- **Capacitor** — bridge natif iOS & Android

## Lancer l'app

### 1. Installer les dépendances

```bash
npm install
```

### 2. Ajouter les plateformes natives

```bash
npx cap add ios
npx cap add android
```

### 3. Synchroniser les fichiers web

```bash
npx cap sync
```

### 4. Ouvrir dans Xcode / Android Studio

```bash
npm run ios       # ouvre Xcode
npm run android   # ouvre Android Studio
```

### 5. (Optionnel) Générer les icônes PNG

```bash
npm install sharp --save-dev
node generate-icons.js
```

## Structure

```
www/
  index.html      ← toute l'UI (HTML + CSS + JS)
  manifest.json   ← config PWA
  capacitor.js    ← stub navigateur (remplacé au build natif)
  icons/          ← icônes app
capacitor.config.json   ← config Capacitor
package.json
```

## Prérequis

- Node.js ≥ 18
- Pour iOS : macOS + Xcode ≥ 15
- Pour Android : Android Studio + SDK