# Plan de refonte UI/UX — SahelSoft

*Audit basé sur le code source réel du dépôt (`Sahelsoflt/`) : React 19 + Vite 7 + Tailwind CSS 3, un seul composant `src/App.jsx` (545 lignes) piloté par les données de `src/config.json`, styles globaux dans `src/styles.css` (24 lignes), tokens dans `tailwind.config.js`.*

---

## 0. Ce que le code dit de l'existant

Avant l'audit, quelques faits vérifiés dans les fichiers, parce qu'ils conditionnent tout le reste :

- **Aucune librairie d'animation n'est installée.** `package.json` ne contient que `react`, `react-dom`, `lucide-react`, `vite`. Pas de Framer Motion / Motion, pas de GSAP, pas de `react-intersection-observer`.
- **Zéro `@keyframes` custom et zéro `IntersectionObserver`** dans le projet. Le seul mouvement CSS écrit à la main est le `.skip-link` (accessibilité) et la classe `scroll-behavior: smooth` sur `html`.
- **La police "Inter" est déclarée dans `tailwind.config.js` mais jamais chargée.** `index.html` ne contient aucun `<link>` Google Fonts ni `@font-face`. Le site tourne donc actuellement sur la police système par défaut (Segoe UI sous Windows), pas sur Inter — un écart direct entre l'intention de design et le rendu réel.
- **`config.json.screenshotGallery` est un tableau vide (`[]`)**, et le composant `Gallery()` fait `if (!screenshotGallery.length) return null;` → la section "Galerie" n'existe tout simplement pas en production actuellement, malgré le code prêt.
- **Les trois `demoLinks` (Stock Flow, AgriSuivi Pro, Mali Paie Pro) sont des chaînes vides** → le bouton "Télécharger la démo" ne s'affiche jamais, remplacé par un texte de repli invitant à contacter WhatsApp. C'est un vrai manque fonctionnel, pas seulement visuel.
- Plusieurs captures d'écran PNG dans `public/images/agrisuivi-pro/` et `public/images/sugucash/` pèsent **1,5 à 1,8 Mo chacune**, et `sahelsoft-logo-source.png` pèse **1,3 Mo**. Ce sont des images statiques (pas de `srcset`, pas de format WebP pour celles-ci) qui pèsent sur la fluidité perçue au chargement et au scroll.

Ces constats servent de base factuelle aux quatre parties demandées.

---

## 1. Diagnostic du code actuel & UX-Audit

### 1.1 Ce qui bride le dynamisme et la modernité visuelle

**a) Un site "statique" au sens propre.** Toutes les sections (`Hero`, `Applications`, `SuguCashGallery`, `AgriSuiviGallery`, `Software`, `About`, `Contact`) sont montées d'un bloc au chargement. Rien n'apparaît progressivement au scroll : le visiteur voit tout, tout de suite, sans mise en scène. C'est la cause principale de l'impression "plate" que vous décrivez — pas un problème de composants, un problème d'absence totale de choré­graphie temporelle.

**b) Les seules interactions existantes sont des `hover` Tailwind génériques.** `hover:-translate-y-1`, `hover:-translate-y-0.5`, `hover:shadow-premium` : ce sont de bons réflexes (transform + shadow, donc performants), mais elles ne se déclenchent qu'à la souris — **sur mobile, où l'essentiel du trafic africain se fait, ces micro-interactions n'existent tout simplement pas.**

**c) Le carrousel `HeroScreenshots` change d'image par un simple changement d'état React, sans transition.** Cliquer sur les flèches fait "sauter" l'image instantanément (`active` change, le DOM se remplace) — aucun fondu, aucun slide, aucune indication de position (pas de dots), ce qui casse l'effet "app premium" que les captures elles-mêmes véhiculent.

**d) Palette et système de tokens minimalistes.** `tailwind.config.js` ne définit que 4 couleurs plates (`ink`, `ocean`, `field`, `mist`) sans échelle (50 → 900), ce qui empêche de construire des dégradés, des états ou des surfaces superposées cohérentes sans sortir des valeurs arbitraires `rgba(...)` inline (ce que le code fait déjà ponctuellement dans le `Hero`, signe que la palette actuelle est déjà trop courte).

**e) Le header a *déjà* un début de glassmorphism** (`bg-white/95 backdrop-blur-xl`) mais c'est un cas isolé : le reste du site est en aplats blancs/gris (`bg-white`, `bg-mist`) sans profondeur ni superposition, donc cet effet ne "résonne" avec rien ailleurs sur la page.

**f) Poids des images.** Plusieurs captures dépassent 1,5 Mo en PNG brut alors que les visuels équivalents en WebP du dossier (`sahelsoft-logo.webp` = 7,9 Ko pour un rendu comparable) montrent que l'optimisation existe déjà en partie mais n'a pas été appliquée partout. Sur un site qui veut se sentir "fluide", des images lourdes créent du jank au scroll et un LCP dégradé, ce qui contredit directement l'objectif.

### 1.2 Points faibles UX

- **Hiérarchie de la preuve sociale absente.** Aucun chiffre, logo client, avis ou statistique d'usage n'appuie les affirmations ("Simples", "Efficaces", "Sécurisées") de la Hero — ce sont des promesses non étayées visuellement.
- **Incohérence des call-to-action de la section Tarifs.** Chaque carte affiche "Démo gratuite — 0 FCFA" à côté du prix réel, mais le bouton de téléchargement de démo ne s'affiche jamais (liens vides en config) : l'utilisateur qui clique tombe systématiquement sur un message "contactez-nous", ce qui crée une attente déçue.
- **Répétition non hiérarchisée du CTA WhatsApp** : bouton flottant + header + Hero + chaque carte logiciel + section Contact. Le canal de conversion est le bon choix pour le marché, mais sans hiérarchie visuelle (même vert, même poids partout), il perd en impact plutôt que d'en gagner.
- **Navigation sans retour d'état.** Le menu desktop ne marque jamais la section active pendant le scroll ; le menu mobile s'ouvre/se ferme sans transition (`open ? <div> : null`), ce qui est correct fonctionnellement mais abrupt perceptuellement.
- **Carrousel hero peu découvrable au tactile.** Seules deux flèches de 40px permettent de naviguer ; pas de swipe, pas de dots cliquables, pas d'auto-play discret — sur mobile l'utilisateur risque de ne jamais voir les 4 captures SuguCash.
- **Zéro affordance de chargement.** Les images `loading="lazy"` peuvent apparaître brutalement pendant le scroll (pas de placeholder, pas de skeleton, pas de blur-up), ce qui, combiné au poids constaté en 1.1, peut donner une impression de site qui "rame".
- **Une section entière est morte en production** (`Gallery`, à cause du tableau vide) : soit il faut la peupler, soit la retirer du DOM proprement — actuellement c'est un angle mort silencieux.

---

## 2. Concept visuel moderne (UI) & identité tech

### 2.1 Direction artistique proposée

L'objectif n'est pas de renier l'identité actuelle (bleu "ocean" `#2563EB`, vert "field" `#16A34A`, encre `#0F172A`) — elle est cohérente et déjà bien choisie pour une marque tech africaine sérieuse. L'objectif est de lui donner de la **profondeur** et du **rythme**.

**Typographie.** Réparer d'abord le bug identifié (Inter non chargée), puis différencier corps de texte et titres :
- Corps de texte : **Inter** (déjà prévue), chargée correctement.
- Titres (`h1`/`h2` de section) : une police "display" resserrée et technique — **Space Grotesk** ou **General Sans** (Fontshare, gratuite) — pour donner aux titres une signature "produit logiciel" distincte du texte courant, sans sortir de l'univers Inter côté lisibilité.

**Couleur & profondeur.** Étendre `ink`/`ocean`/`field` en véritables échelles (50 à 900) dans `tailwind.config.js` pour pouvoir construire :
- des **dégradés de marque** cohérents (au lieu des `rgba()` arbitraires actuels dans le Hero),
- des **surfaces sombres nuancées** dans le footer/contact (déjà en `bg-ink` plat aujourd'hui) avec un mesh gradient discret ocean → ink,
- un vrai système de **glassmorphism ciblé** : cartes flottantes du carrousel Hero, header (déjà amorcé), et cartes "en vedette" (SuguCash, AgriSuivi Pro) avec `backdrop-blur`, bordure 1px semi-transparente et ombre douce colorée plutôt que grise neutre.

**Rythme des sections.** Actuellement le site alterne seulement `bg-white` / `bg-mist` / `bg-ink` (footer). Proposition : garder cette alternance (elle est saine, ne pas la complexifier inutilement) mais marquer chaque transition de section par un léger dégradé de raccord (quelques pixels de fondu en haut/bas de section) plutôt qu'une ligne dure, pour casser l'effet "blocs empilés".

### 2.2 Composants UI tendance et fonctionnels

- **Bento Grid pour "Nos solutions".** La grille actuelle (`Applications`) traite les 5 logiciels à égalité stricte (`xl:grid-cols-5`), ce qui aplatit visuellement SuguCash (le seul produit réellement disponible) au même niveau que les 4 "en développement". Un Bento Grid — SuguCash en grande tuile (2 colonnes), les 4 autres en tuiles égales dessous — refléterait mieux la réalité produit *et* casserait la monotonie de la grille uniforme.
- **Skeleton loaders sur les captures d'écran**, en particulier pour les galeries SuguCash/AgriSuivi Pro dont les images pèsent 1,5 Mo+ : un shimmer gris pendant le chargement évite l'effet de "pop" brutal identifié en 1.2.
- **Indicateur de progression dans le carrousel Hero** : remplacer les flèches seules par des dots cliquables + une micro-barre de progression façon "story" entre chaque capture, qui comble aussi le manque de découvrabilité tactile relevé plus haut.
- **Barre de progression de lecture globale** (fine ligne en haut de page, largeur = avancement du scroll) : élément très utilisé sur les sites SaaS modernes, discret, à coût de performance nul.
- **Cartes "spotlight"** (glow qui suit le curseur + léger tilt 3D) pour les cartes `Applications` et `Software` : effet tendance 2024-2025 (popularisé par Linear, Vercel, Stripe) qui rend les cartes "vivantes" au survol sans dépendance lourde.
- **Navigation active au scroll** : mettre en surbrillance le lien correspondant à la section visible (`Intersection Observer`), au lieu du menu statique actuel.

---

## 3. Interactions, micro-animations & dynamisme

### 3.1 Micro-interactions (boutons, cartes, menus)

| Élément | Aujourd'hui | Proposition |
|---|---|---|
| Boutons CTA (`bg-ocean`, `bg-field`) | `hover:-translate-y-0.5` + changement de teinte | Ajouter un `active:scale-[0.97]` pour le retour tactile au clic, et un halo (`box-shadow` coloré qui s'intensifie au hover) plutôt qu'une ombre neutre |
| Cartes `Applications` / `Software` | `hover:-translate-y-1 hover:shadow-premium` | Ajouter l'effet spotlight/tilt (voir §4) : le mouvement de la carte suit le curseur, pas seulement un décalage vertical uniforme |
| Menu mobile | Apparition instantanée (`{open ? <div> : null}`) | Slide + fade avec stagger : chaque lien apparaît avec 40-60ms de décalage successif |
| Icônes `lucide-react` dans les cartes | Statiques | Micro-rotation ou léger scale au hover du carte parent (`group-hover:scale-110`) — Tailwind gère déjà le pattern `group` ailleurs dans le code, cohérent à généraliser |
| Carrousel Hero | Changement d'image instantané | Cross-fade 300-400ms entre les captures + dots de progression |

Toutes ces propositions reposent uniquement sur `transform` et `opacity` (jamais `width`, `top`, `margin`) pour rester sur le compositeur GPU et ne pas dégrader les performances — cohérent avec les bonnes pratiques déjà suivies dans le code existant (`hover:-translate-y-1`).

### 3.2 Animations au défilement (scroll)

- **Reveal on scroll** : chaque section et chaque carte de grille (`Applications`, `Software`, futur `Gallery`) apparaît en fondu + léger déplacement vertical (24px) au passage dans le viewport, avec un stagger de 60-80ms entre les cartes d'une même grille. C'est l'ajout à plus fort impact perçu pour le coût d'implémentation le plus faible.
- **Parallax discret sur les blobs de gradient du Hero** (`radial-gradient` déjà présent en arrière-plan) : léger décalage de position selon le scroll, pour donner de la profondeur sans distraire du contenu.
- **Entrée initiale "cinématique" du H1** : au premier chargement (pas au scroll), le titre, le sous-texte et les CTA du Hero apparaissent en cascade (stagger léger), donnant un effet d'ouverture professionnel sans surcharge.
- **Compteurs animés** si des statistiques chiffrées sont ajoutées à la section "Pourquoi choisir SahelSoft" (actuellement seulement des libellés qualitatifs) — à considérer comme extension future plutôt que prioritaire immédiat.

**Impératif transverse : respecter `prefers-reduced-motion`.** Le code actuel n'a aucune règle pour les utilisateurs qui désactivent les animations système — c'est à corriger dès la première implémentation, pas en fin de projet.

---

## 4. Plan d'action technique & exemples de code

### 4.1 Quel outil pour cette architecture ?

Le projet est un **React 19 fonctionnel avec Vite**, sans aucune dépendance d'animation actuellement — c'est un point de départ propre. Trois options réalistes :

1. **CSS natif + `IntersectionObserver` vanilla (recommandé en priorité).** Zéro dépendance, zéro poids de bundle supplémentaire, s'intègre directement dans le style d'écriture actuel du code (composants fonctionnels courts, classes Tailwind). Couvre 90% du besoin exprimé (reveal on scroll, hover effects, transitions de carrousel).
2. **Motion (ex-Framer Motion, package npm `motion`)** pour les cas où l'orchestration devient complexe (stagger avancé sur les grilles, `AnimatePresence` pour le carrousel Hero, drag). API déclarative qui colle bien au style JSX déjà utilisé (`whileInView`, `initial`/`animate`).
3. **GSAP + ScrollTrigger**, seulement si vous voulez un traitement plus "cinématique" du Hero (scrub de parallax lié précisément à la position de scroll) — plus lourd et plus impératif, à réserver à une seule section plutôt qu'à tout le site.

**Recommandation concrète : commencer par l'option 1 partout**, puis n'ajouter `motion` (`npm install motion`, ~13 Ko gzip) que pour le carrousel Hero et les grilles où le stagger devient difficile à gérer proprement en CSS pur. Cela évite d'alourdir un bundle actuellement très léger (React + lucide-react uniquement) pour un site vitrine.

### 4.2 Fondations à poser en premier

**Corriger le chargement de la police** (`index.html`, dans `<head>`) :

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Étendre `tailwind.config.js`** pour ajouter la police display et des échelles de couleur exploitables :

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        ocean: { DEFAULT: "#2563EB", 50: "#EFF6FF", 100: "#DBEAFE", 600: "#2563EB", 700: "#1D4ED8" },
        field: { DEFAULT: "#16A34A", 50: "#F0FDF4", 100: "#DCFCE7", 600: "#16A34A", 700: "#15803D" },
        mist: "#f5f8fb",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 24px 80px rgba(6, 35, 63, 0.16)",
        soft: "0 16px 48px rgba(6, 35, 63, 0.10)",
        glow: "0 0 0 1px rgba(37,99,235,0.08), 0 20px 60px -12px rgba(37,99,235,0.35)",
      },
    },
  },
  plugins: [],
};
```

**Un hook de détection au scroll, sans dépendance** (nouveau fichier `src/hooks/useReveal.js`) :

```jsx
// src/hooks/useReveal.js
import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
```

**Classes utilitaires de reveal** (à ajouter dans `src/styles.css`) :

```css
/* src/styles.css — après les règles existantes */

@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--reveal-delay, 0ms);
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes floatSlow {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(0, -14px, 0); }
  }
  .ambient-blob {
    animation: floatSlow 9s ease-in-out infinite;
  }
}
```

### 4.3 Code — Animation majeure de la Hero Section

Adaptation directe de `Hero()` dans `src/App.jsx` : entrée en cascade au premier chargement + fond animé.

```jsx
// src/App.jsx — remplacer la fonction Hero()
import { useReveal } from "./hooks/useReveal";

function Hero() {
  const [ref, inView] = useReveal(0.1);

  return (
    <section id="accueil" ref={ref} className="relative isolate overflow-hidden bg-white">
      <div className="ambient-blob absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_18%,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(14,165,233,0.12),transparent_26%)]" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <p
            className={`reveal inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-ocean ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "0ms" }}
          >
            <BadgeCheck size={16} /> Des logiciels professionnels
          </p>

          <h1
            className={`reveal mt-4 font-display text-4xl font-black leading-[1.02] text-ink sm:text-5xl lg:text-6xl ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "90ms" }}
          >
            Des solutions numériques pour faire grandir <span className="text-ocean">votre activité</span>
          </h1>

          <p
            className={`reveal mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700 ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "180ms" }}
          >
            SahelSoft développe des logiciels modernes, simples et accessibles pour aider les entreprises et
            organisations africaines à gérer, suivre et développer leur activité au quotidien.
          </p>

          <div
            className={`reveal mt-7 flex flex-col gap-3 sm:flex-row ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "270ms" }}
          >
            <a href="#solutions" className="inline-flex items-center justify-center gap-2 rounded-md bg-ocean px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow active:scale-[0.97]">
              Découvrir nos solutions <ArrowRight size={19} />
            </a>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-4 font-black text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-mist active:scale-[0.97]">
              Nous contacter <MessageCircle size={19} />
            </a>
          </div>

          <div
            className={`reveal mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "360ms" }}
          >
            {heroPillars.map(([title, text, Icon]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-premium">
                <Icon className="text-ocean" size={22} />
                <p className="mt-3 font-black text-ink">{title}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <HeroScreenshots />
      </div>
    </section>
  );
}
```

*Note : `font-display` suppose l'ajout de `fontFamily.display` dans `tailwind.config.js` (§4.2). Le stagger est géré ici par une variable CSS `--reveal-delay` par bloc plutôt que par un enfant par enfant, ce qui reste lisible dans le JSX existant sans complexifier la structure.*

### 4.4 Code — Effet interactif sur les cartes Services (spotlight + tilt)

Un composant `SpotlightCard` réutilisable pour `Applications()` et `Software()`, sans dépendance externe :

```jsx
// src/components/SpotlightCard.jsx
import { useRef } from "react";

export function SpotlightCard({ as: Tag = "article", className = "", children, ...rest }) {
  const cardRef = useRef(null);

  const handlePointerMove = (event) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
    card.style.setProperty("--tilt-x", `${((y - rect.height / 2) / rect.height) * -6}deg`);
    card.style.setProperty("--tilt-y", `${((x - rect.width / 2) / rect.width) * 6}deg`);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <Tag
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className={`spotlight-card ${className}`}
      {...rest}
    >
      <span className="spotlight-glow" aria-hidden="true" />
      {children}
    </Tag>
  );
}
```

```css
/* src/styles.css — ajout */

.spotlight-card {
  position: relative;
  overflow: hidden;
  transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
  transition: transform 200ms ease;
}

.spotlight-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(37, 99, 235, 0.14), transparent 70%);
  transition: opacity 250ms ease;
}

.spotlight-card:hover .spotlight-glow {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .spotlight-card { transform: none !important; }
}

/* désactive l'effet sur les écrans tactiles, où il n'a pas de sens */
@media (hover: none) {
  .spotlight-glow { display: none; }
}
```

Intégration dans `Applications()` (remplace le `<article>` existant) :

```jsx
// src/App.jsx — dans Applications(), remplacer <article ...> par :
<SpotlightCard
  key={app.id}
  className="group rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-premium"
>
  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-soft transition group-hover:scale-110 ${app.id === "mali-paie-pro" ? "bg-orange-500" : app.id === "agrisuivi-pro" ? "bg-field" : "bg-ocean"}`}>
    <Icon size={25} />
  </div>
  {/* … reste du contenu inchangé … */}
</SpotlightCard>
```

### 4.5 Compléments utiles (faible effort, fort effet)

**Barre de progression de lecture** (à monter dans `App()`, juste après `<Header />`) :

```jsx
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setProgress(scrollTop / Math.max(scrollHeight - clientHeight, 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[60] h-1 w-full">
      <div
        className="h-full bg-gradient-to-r from-ocean to-field transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
```

**Dots de progression pour `HeroScreenshots`** — ajouter sous le composant existant :

```jsx
<div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
  {sugucash.screenshots.map((_, index) => (
    <button
      key={index}
      type="button"
      onClick={() => setActive(index)}
      aria-label={`Aller à la capture ${index + 1}`}
      className={`h-2 rounded-full transition-all ${index === active ? "w-6 bg-ocean" : "w-2 bg-slate-300"}`}
    />
  ))}
</div>
```

*(Pour le cross-fade entre images, le plus simple ici reste `motion` (§4.1) avec `AnimatePresence mode="wait"` autour de `<ScreenshotCard>` — en CSS pur, cela demande de gérer deux images superposées avec des classes `opacity`, faisable mais plus verbeux pour ce cas précis.)*

---

## 5. Analyse pièce par pièce

**Hero.** Le fond dégradé existe déjà et est un bon point de départ — il manque juste de mouvement (blob animé, §4.3) et d'une entrée en cascade. Le carrousel de captures est fonctionnellement correct mais visuellement muet : dots + cross-fade + swipe tactile sont les trois ajouts prioritaires.

**Services (`Applications`).** Passer d'une grille à 5 colonnes égales à un Bento Grid qui met SuguCash en avant (seul produit disponible) résout à la fois un problème visuel (monotonie) et un problème de message (hiérarchie produit floue). Ajouter l'effet spotlight (§4.4) sur chaque tuile.

**Projets/Réalisations (`SuguCashGallery`, `AgriSuiviGallery`, `Software`, `Gallery`).** Priorité fonctionnelle avant esthétique : soit peupler `screenshotGallery` dans `config.json` pour activer la section Galerie (actuellement morte), soit retirer proprement le composant. Pour `Software`, résoudre l'incohérence des `demoLinks` vides avant d'investir dans l'animation des cartes — une belle carte qui mène à une déception fonctionnelle n'améliore pas la conversion. Une fois cela réglé : reveal on scroll avec stagger sur les 3 cartes tarifs.

**Contact.** Section déjà solide structurellement (bloc sombre + bloc paiement). Le gain principal ici est plus subtil : un léger mesh gradient sur le bloc `bg-ink` (au lieu de l'aplat actuel) pour faire écho au traitement du footer, et une micro-animation d'icône au clic sur les moyens de paiement pour confirmer l'action.

---

## 6. Priorisation suggérée

1. **Corrections sans risque, fort impact** : chargement réel de la police Inter, résolution des `demoLinks`/`screenshotGallery` vides, compression des images PNG lourdes en WebP.
2. **Fondations d'animation** : hook `useReveal`, classes `.reveal`, respect de `prefers-reduced-motion`, application au Hero et aux grilles `Applications`/`Software`.
3. **Composants signature** : Bento Grid Services, `SpotlightCard`, dots + cross-fade du carrousel Hero, barre de progression.
4. **Finitions** : glassmorphism étendu (cartes en vedette), mesh gradients sur les blocs sombres, micro-interactions du menu mobile.

Cet ordre garantit que chaque étape est livrable indépendamment et testable en production sans dépendre des suivantes.
