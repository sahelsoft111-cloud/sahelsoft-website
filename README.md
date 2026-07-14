# SahelSoft Site

Site vitrine SahelSoft prêt pour Netlify.

## Prérequis

- Node.js 20 ou plus
- npm

## Installation

```bash
npm install
```

## Développement local

Le script de développement sert le dossier `dist` généré. Il évite un blocage Windows `spawn EPERM` observé avec l'exécutable local `esbuild` au démarrage de Vite.

```bash
npm run build
npm run dev
```

URL locale :

```text
http://127.0.0.1:5173
```

## Build production

```bash
npm run build
```

Le dossier généré est :

```text
dist
```

## Déploiement Netlify

Configuration incluse dans `netlify.toml` :

- Build command : `npm run build`
- Publish directory : `dist`
- SPA redirects et routes légales configurés

## Pages légales

- Confidentialité SuguCash : `/privacy.html`
- Confidentialité AgriSuivi Pro : `/privacy/agrisuivi-pro/`
- Suppression de compte SuguCash : `/delete-account.html`
- Suppression de compte AgriSuivi Pro : `/delete-account/agrisuivi-pro/`

## Images

Les captures utilisées sont dans :

- `public/images/sugucash/`
- `public/images/agrisuivi-pro/`

Les anciennes références `sugucash-screenshots` ont été supprimées.
