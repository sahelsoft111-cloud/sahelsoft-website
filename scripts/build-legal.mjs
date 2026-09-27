// Generates the legal pages in public/ (privacy, account deletion, terms) from one
// shared layout, so contact details and the update date stay consistent.
// Run: npm run legal   (then commit the generated HTML files)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(root, "src/config.json"), "utf8"));
const { email, whatsappDisplay, whatsappNumber } = config.contact;

const UPDATED = "27 septembre 2026";
const SITE = "https://sahelsoft.tech";
const mail = `<a href="mailto:${email}">${email}</a>`;
const whatsapp = `<a href="https://wa.me/${whatsappNumber}">${whatsappDisplay}</a>`;
const googlePermissions = `<a href="https://myaccount.google.com/permissions" rel="noopener">myaccount.google.com/permissions</a>`;

const section = (id, title, body) => ({ id, title, body });

function page({ file, canonical, title, description, eyebrow, heading, lead, nav, chips = [], sections }) {
  const toc = sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join("");
  const body = sections
    .map((s, i) => `<section class="section" id="${s.id}"><h2><span class="num">${i + 1}</span>${s.title}</h2>${s.body}</section>`)
    .join("\n");
  const navLinks = [
    ["/", "Accueil"],
    ["/privacy.html", "Confidentialité"],
    ["/delete-account.html", "Suppression de compte"],
    ["/terms.html", "Conditions d'utilisation"],
  ]
    .map(([href, label]) => `<a href="${href}"${label === nav ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0F172A" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE}${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE}${canonical}" />
    <meta property="og:image" content="${SITE}/images/sahelsoft-og-banner.jpg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/legal/legal.css" />
  </head>
  <body>
    <header class="top">
      <div class="top-inner">
        <a class="brand" href="/" aria-label="Accueil SahelSoft"><img src="/images/sahelsoft-logo.webp" width="240" height="64" alt="SahelSoft" /></a>
        <nav class="top-nav" aria-label="Pages légales">${navLinks}</nav>
      </div>
    </header>
    <main>
      <div class="hero">
        <div class="hero-inner">
          <p class="eyebrow">${eyebrow}</p>
          <h1>${heading}</h1>
          <p class="lead">${lead}</p>
          <div class="meta">
            <span class="chip">Dernière mise à jour : ${UPDATED}</span>
            ${chips.map((c) => `<span class="chip">${c}</span>`).join("\n            ")}
          </div>
        </div>
      </div>
      <div class="layout">
        <nav class="toc" aria-label="Sommaire"><p>Sommaire</p><ol>${toc}</ol></nav>
        <article class="doc">
${body}
        </article>
      </div>
    </main>
    <footer class="footer">
      <div class="footer-inner">
        <span>© 2026 SahelSoft · Bamako, Mali · ${email}</span>
        <span><a href="/privacy.html">Confidentialité</a><a href="/delete-account.html">Suppression de compte</a><a href="/terms.html">Conditions d'utilisation</a></span>
      </div>
    </footer>
  </body>
</html>
`;
  const out = join(root, "public", file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log("écrit :", file);
}

// ---------------------------------------------------------------------------
// Shared blocks
// ---------------------------------------------------------------------------

const editor = `<p><strong>SahelSoft</strong> est un éditeur de logiciels de gestion basé à Bamako (Mali). SahelSoft est responsable du traitement des données personnelles décrit dans ce document, pour ce qui concerne ses propres traitements.</p>
<div class="table-wrap"><table><tbody>
<tr><th>Éditeur</th><td>SahelSoft</td></tr>
<tr><th>Adresse</th><td>Bamako, Mali</td></tr>
<tr><th>E-mail</th><td>${mail}</td></tr>
<tr><th>WhatsApp</th><td>${whatsapp}</td></tr>
<tr><th>Site</th><td><a href="${SITE}">sahelsoft.tech</a></td></tr>
</tbody></table></div>`;

const rights = `<p>Conformément à la loi malienne n° 2013-015 du 21 mai 2013 relative à la protection des données à caractère personnel, vous disposez des droits suivants sur les données que SahelSoft traite à votre sujet :</p>
<ul>
<li><strong>Droit d'accès</strong> : savoir quelles données nous détenons et en obtenir une copie ;</li>
<li><strong>Droit de rectification</strong> : faire corriger des données inexactes ;</li>
<li><strong>Droit de suppression</strong> : demander l'effacement de vos données ;</li>
<li><strong>Droit d'opposition</strong> : vous opposer à un traitement, pour un motif légitime ;</li>
<li><strong>Retrait du consentement</strong> : à tout moment, pour les traitements fondés sur votre accord (par exemple la connexion Google ou la sauvegarde Google Drive).</li>
</ul>
<p>Pour exercer ces droits, écrivez à ${mail} en précisant l'application concernée. Nous répondons dans un délai maximal de <strong>30 jours</strong>. Une preuve d'identité peut être demandée si elle est nécessaire pour protéger vos données.</p>
<p>Vous pouvez également adresser une réclamation à l'Autorité de Protection des Données à caractère Personnel (APDP) du Mali.</p>
<div class="note">La plupart des données de nos applications sont enregistrées <strong>uniquement sur votre appareil</strong> : SahelSoft n'y a pas accès. Vous pouvez les consulter, les modifier et les supprimer directement dans l'application.</div>`;

const security = `<p>SahelSoft applique des mesures adaptées pour protéger les données :</p>
<ul>
<li>stockage local sur l'appareil par défaut, sans envoi de vos données métier vers nos serveurs ;</li>
<li>connexions chiffrées (HTTPS) pour tous les échanges réseau (activation de licence, sauvegarde Google Drive, diagnostic IA) ;</li>
<li>clés techniques (clés d'API, clés secrètes) conservées uniquement côté serveur, jamais dans les applications ;</li>
<li>accès aux services Google limité au strict nécessaire (par exemple, accès Google Drive restreint aux seuls fichiers créés par l'application).</li>
</ul>
<p>La sécurité de votre appareil (code de verrouillage, mises à jour du système) et la réalisation de sauvegardes régulières restent sous votre responsabilité. Si vous perdez ou changez d'appareil sans sauvegarde, les données locales ne peuvent pas être récupérées par SahelSoft.</p>`;

const children = `<p>Les applications SahelSoft sont des outils de gestion destinés aux professionnels, aux commerçants et aux exploitants. Elles ne s'adressent pas aux enfants de moins de 13 ans et SahelSoft ne collecte pas sciemment de données les concernant.</p>`;

const changes = `<p>SahelSoft peut mettre à jour ce document, notamment lors de l'ajout d'une fonctionnalité. La date de dernière mise à jour figure en haut de la page. En cas de changement important, une information sera donnée dans l'application ou sur ce site.</p>`;

const contact = `<p>Pour toute question sur ce document ou sur vos données :</p>
<ul><li>E-mail : ${mail}</li><li>WhatsApp : ${whatsapp}</li><li>Adresse : SahelSoft, Bamako, Mali</li></ul>`;

// ---------------------------------------------------------------------------
// 1. Privacy centre + general policy (includes the SuguCash policy, #sugucash)
// ---------------------------------------------------------------------------

page({
  file: "privacy.html",
  canonical: "/privacy.html",
  title: "Politique de confidentialité | SahelSoft",
  description: "Politique de confidentialité de SahelSoft et de ses applications : SuguCash, AgriSuivi Pro, Devisio, Fisca+, SahelPaie, SahelImmo, Sahel Caisse, Stock Flow et FleetMaster.",
  eyebrow: "Centre de confidentialité",
  heading: "Politique de confidentialité",
  lead: "Ce document explique quelles données les applications et le site de SahelSoft traitent, pourquoi, avec qui elles peuvent être partagées et comment vous gardez le contrôle sur elles.",
  nav: "Confidentialité",
  chips: ["S'applique à toutes les applications SahelSoft"],
  sections: [
    section("editeur", "Qui sommes-nous", editor),
    section("champ", "Champ d'application", `<p>Cette politique s'applique au site <a href="${SITE}">sahelsoft.tech</a> et aux applications éditées par SahelSoft. Certaines applications disposent en plus d'une politique dédiée, qui prévaut pour les points qui leur sont propres.</p>
<div class="cards">
<a class="card" href="#sugucash"><strong>SuguCash</strong><span>Android · politique détaillée ci-dessous</span></a>
<a class="card" href="/privacy/agrisuivi-pro/"><strong>AgriSuivi Pro</strong><span>Android et Windows · politique dédiée</span></a>
<a class="card" href="#applications-web"><strong>Devisio, Fisca+, SahelPaie, SahelImmo, Sahel Caisse</strong><span>Applications web · section dédiée</span></a>
<a class="card" href="#logiciels-windows"><strong>Stock Flow, FleetMaster</strong><span>Logiciels Windows · section dédiée</span></a>
</div>`),
    section("principes", "Nos principes", `<ul>
<li><strong>Vos données vous appartiennent.</strong> Les informations que vous saisissez (ventes, dépenses, employés, immobilisations, exploitation…) restent votre propriété.</li>
<li><strong>Stockage local par défaut.</strong> Nos applications enregistrent vos données sur votre appareil. Elles fonctionnent hors ligne et n'envoient pas vos données de gestion à SahelSoft.</li>
<li><strong>Aucune vente de données.</strong> SahelSoft ne vend, ne loue et n'échange pas vos données personnelles.</li>
<li><strong>Minimum nécessaire.</strong> Les rares données qui quittent votre appareil (activation de licence, sauvegarde en ligne choisie par vous, diagnostic photo) servent uniquement à la fonctionnalité demandée.</li>
</ul>`),
    section("donnees", "Données traitées et finalités", `<div class="table-wrap"><table>
<thead><tr><th>Données</th><th>Où elles se trouvent</th><th>Finalité</th></tr></thead>
<tbody>
<tr><td>Données de gestion saisies dans les applications (ventes, dépenses, dettes, stocks, bulletins, immobilisations, exploitation…)</td><td>Sur votre appareil uniquement</td><td>Faire fonctionner l'application</td></tr>
<tr><td>Comptes utilisateurs locaux (nom, identifiant, mot de passe protégé)</td><td>Sur votre appareil uniquement</td><td>Sécuriser l'accès à l'application</td></tr>
<tr><td>Clé de licence et identifiant technique de l'appareil</td><td>Transmis lors de l'activation (applications web)</td><td>Vérifier la validité de la licence et le nombre d'appareils</td></tr>
<tr><td>Nom, e-mail et informations de paiement lors d'un achat</td><td>Chez la plateforme de vente (Chariow) ou Google Play</td><td>Traiter la commande et délivrer la licence</td></tr>
<tr><td>Nom et adresse e-mail du compte Google (si vous choisissez « Se connecter avec Google »)</td><td>Sur votre appareil</td><td>Créer ou ouvrir votre compte dans l'application</td></tr>
<tr><td>Fichier de sauvegarde (si vous activez la sauvegarde Google Drive)</td><td>Dans votre propre Google Drive</td><td>Sauvegarder et restaurer vos données</td></tr>
<tr><td>Messages et coordonnées envoyés au support</td><td>Messagerie de SahelSoft (e-mail, WhatsApp)</td><td>Répondre à vos demandes</td></tr>
</tbody></table></div>`),
    section("sugucash", "SuguCash", `<p>SuguCash est une application Android de gestion des recettes, dépenses, dettes et paiements.</p>
<h3>Données enregistrées sur votre téléphone</h3>
<p>Recettes, dépenses, dettes clients, paiements, historique, rapports, paramètres et comptes locaux. Ces données restent sur votre appareil et SahelSoft n'y a pas accès.</p>
<h3>Services utilisés par l'application</h3>
<ul>
<li><strong>Publicité (Google AdMob).</strong> SuguCash peut afficher des annonces fournies par Google AdMob. Pour cela, Google peut collecter l'identifiant publicitaire de l'appareil, des informations techniques (modèle, système, adresse IP) et des données d'interaction avec les annonces, conformément à ses propres règles de confidentialité. Vous pouvez réinitialiser ou supprimer l'identifiant publicitaire dans les paramètres Android (Google › Annonces).</li>
<li><strong>Connexion avec Google (facultative).</strong> Si vous la choisissez, l'application reçoit votre nom et votre adresse e-mail pour créer ou ouvrir votre compte.</li>
<li><strong>Sauvegarde Google Drive (facultative, Premium).</strong> Si vous l'activez, une sauvegarde chiffrée de vos données est enregistrée dans votre propre Google Drive. L'application n'a accès qu'aux fichiers qu'elle a créés.</li>
<li><strong>Google Play (achats et intégrité).</strong> Les abonnements et achats sont traités par Google Play Billing. Google Play Integrity peut être utilisé pour vérifier que l'application est authentique.</li>
</ul>
<p>La suppression de vos données SuguCash est expliquée sur la page <a href="/delete-account.html#sugucash">Suppression de compte SuguCash</a>.</p>`),
    section("agrisuivi-pro", "AgriSuivi Pro", `<p>AgriSuivi Pro dispose d'une politique de confidentialité dédiée, qui détaille notamment la connexion Google, la sauvegarde Google Drive et le diagnostic photo par intelligence artificielle.</p>
<div class="actions"><a class="btn btn-primary" href="/privacy/agrisuivi-pro/">Lire la politique AgriSuivi Pro</a></div>`),
    section("applications-web", "Applications web : Devisio, Fisca+, SahelPaie, SahelImmo, Sahel Caisse", `<p>Ces applications s'utilisent dans le navigateur, sur ordinateur comme sur téléphone, et peuvent être installées comme une application.</p>
<ul>
<li><strong>Données enregistrées dans votre navigateur</strong> (stockage local) : devis et factures, profil fiscal, employés et bulletins, immobilisations, ventes et stock selon l'application. Elles ne sont pas envoyées à SahelSoft.</li>
<li><strong>Activation de la licence</strong> : lors de l'activation puis lors de vérifications périodiques, la clé de licence et un identifiant technique généré aléatoirement pour l'appareil sont transmis à notre serveur (hébergé par Netlify), qui interroge la plateforme de vente Chariow. Aucune donnée de gestion n'est transmise.</li>
<li><strong>Achat</strong> : le paiement et vos coordonnées d'achat sont traités par Chariow, selon ses propres conditions.</li>
<li><strong>Sauvegarde</strong> : l'export de sauvegarde crée un fichier sur votre appareil ; vous choisissez où le conserver.</li>
</ul>
<div class="note amber">Vider les données du navigateur ou désinstaller l'application supprime définitivement les données non sauvegardées. Pensez à exporter une sauvegarde régulièrement.</div>`),
    section("logiciels-windows", "Logiciels Windows : Stock Flow, FleetMaster", `<p>Ces logiciels s'installent sur votre ordinateur. Les données (produits, stocks, factures, véhicules, entretiens…) et la licence sont enregistrées localement sur l'ordinateur et ne sont pas transmises à SahelSoft. Leur version Android, lorsqu'elle existe, fonctionne selon les mêmes principes.</p>`),
    section("site-web", "Site sahelsoft.tech", `<p>Le site ne dépose pas de cookie publicitaire et n'utilise pas d'outil de mesure d'audience. Il est hébergé par Netlify, qui enregistre des journaux techniques (adresse IP, navigateur, pages demandées) pour assurer la sécurité et le bon fonctionnement du service. Les polices d'écriture sont chargées depuis Google Fonts. Les boutons « WhatsApp » ouvrent l'application WhatsApp, soumise à ses propres conditions.</p>`),
    section("partage", "Partage avec des tiers", `<p>SahelSoft ne partage vos données qu'avec les prestataires nécessaires au fonctionnement des services, et uniquement pour les fonctionnalités que vous utilisez :</p>
<div class="table-wrap"><table>
<thead><tr><th>Prestataire</th><th>Rôle</th></tr></thead>
<tbody>
<tr><td>Google (Play, AdMob, connexion Google, Drive, Gemini)</td><td>Distribution et paiement Android, publicité (SuguCash), connexion, sauvegarde, diagnostic photo (AgriSuivi Pro)</td></tr>
<tr><td>Supabase</td><td>Hébergement du service de diagnostic photo d'AgriSuivi Pro</td></tr>
<tr><td>Chariow</td><td>Vente en ligne et gestion des licences des applications web</td></tr>
<tr><td>Netlify</td><td>Hébergement du site et des applications web</td></tr>
</tbody></table></div>
<p>Vos données peuvent également être communiquées si la loi l'exige, sur demande d'une autorité compétente. Certains de ces prestataires peuvent traiter des données hors du Mali ; ils appliquent leurs propres garanties de sécurité et de confidentialité.</p>`),
    section("conservation", "Durée de conservation", `<ul>
<li><strong>Données locales</strong> : conservées sur votre appareil jusqu'à ce que vous les supprimiez ou désinstalliez l'application.</li>
<li><strong>Sauvegardes Google Drive</strong> : conservées dans votre Drive jusqu'à ce que vous les supprimiez.</li>
<li><strong>Données de licence</strong> : conservées pendant la durée de la licence, puis le temps nécessaire aux obligations comptables.</li>
<li><strong>Échanges avec le support</strong> : conservés le temps de traiter la demande, puis au maximum 3 ans après le dernier contact.</li>
</ul>`),
    section("droits", "Vos droits", rights),
    section("securite", "Sécurité", security),
    section("enfants", "Protection des mineurs", children),
    section("modifications", "Modifications", changes),
    section("contact", "Contact", contact),
  ],
});

// ---------------------------------------------------------------------------
// 2. AgriSuivi Pro privacy policy
// ---------------------------------------------------------------------------

page({
  file: "privacy/agrisuivi-pro/index.html",
  canonical: "/privacy/agrisuivi-pro",
  title: "Politique de confidentialité AgriSuivi Pro | SahelSoft",
  description: "Politique de confidentialité de l'application AgriSuivi Pro (Android et Windows) éditée par SahelSoft.",
  eyebrow: "AgriSuivi Pro",
  heading: "Politique de confidentialité d'AgriSuivi Pro",
  lead: "AgriSuivi Pro est une application de gestion d'exploitation agricole, d'élevage et de pisciculture, éditée par SahelSoft, disponible sur Android et Windows. Cette politique décrit les données qu'elle traite.",
  nav: "Confidentialité",
  chips: ["Android et Windows", "Éditeur : SahelSoft"],
  sections: [
    section("editeur", "Éditeur de l'application", editor),
    section("resume", "En résumé", `<div class="note green">AgriSuivi Pro fonctionne <strong>principalement hors ligne</strong> : vos données d'exploitation sont enregistrées sur votre téléphone ou votre ordinateur. Elles ne quittent votre appareil que si vous utilisez une fonctionnalité en ligne facultative (connexion Google, sauvegarde Google Drive, diagnostic photo).</div>
<p>SahelSoft ne vend pas vos données et ne les utilise pas à des fins publicitaires.</p>`),
    section("donnees-locales", "Données enregistrées sur votre appareil", `<p>Selon les modules que vous utilisez, l'application enregistre localement :</p>
<ul>
<li>les informations de l'exploitation et du propriétaire ;</li>
<li>les lots d'élevage, les cultures et parcelles, les bassins de pisciculture ;</li>
<li>les données sanitaires, pertes, traitements et vaccinations ;</li>
<li>les dépenses, recettes, ventes et factures ;</li>
<li>le calendrier, les tâches, les alertes et les rapports ;</li>
<li>les comptes utilisateurs locaux, les paramètres et les sauvegardes locales.</li>
</ul>
<p>Sur Windows, ces données se trouvent dans le dossier <strong>Documents/AgriSuiviPro</strong> de votre ordinateur.</p>`),
    section("fonctions-en-ligne", "Fonctionnalités en ligne facultatives", `<h3>Connexion avec Google</h3>
<p>Si vous choisissez « Se connecter avec Google », l'application reçoit votre <strong>nom</strong> et votre <strong>adresse e-mail</strong> Google afin de créer ou d'ouvrir votre compte sur l'appareil. Aucun mot de passe Google n'est transmis à l'application.</p>
<h3>Sauvegarde Google Drive</h3>
<p>Si vous activez la sauvegarde Google Drive, une copie de vos données est enregistrée dans <strong>votre propre Google Drive</strong>. L'application utilise l'autorisation limitée « drive.file » : elle n'a accès qu'aux fichiers qu'elle a elle-même créés, jamais au reste de votre Drive. SahelSoft n'a pas accès à ces sauvegardes.</p>
<h3>Diagnostic photo par intelligence artificielle</h3>
<p>Si vous utilisez le diagnostic d'une maladie par photo (cultures, élevage, pisciculture), la photo et le type de culture ou d'animal que vous indiquez sont envoyés, via une connexion chiffrée, au service de SahelSoft hébergé par Supabase, puis au service d'intelligence artificielle Gemini de Google pour analyse. Le résultat vous est renvoyé immédiatement.</p>
<ul>
<li>SahelSoft <strong>n'enregistre pas vos photos</strong> ;</li>
<li>seul un compteur du nombre de diagnostics effectués par jour est conservé, associé à un identifiant anonyme, afin d'appliquer la limite quotidienne d'utilisation ;</li>
<li>le traitement de la photo par Google est soumis aux conditions et à la politique de confidentialité de Google.</li>
</ul>
<p>Le diagnostic est une aide : il ne remplace pas l'avis d'un vétérinaire, d'un agronome ou d'un technicien.</p>
<h3>Abonnement Premium</h3>
<p>Sur Android, l'abonnement Premium est souscrit et géré par Google Play. SahelSoft ne reçoit pas vos informations de paiement ; l'application vérifie uniquement si l'abonnement est actif.</p>`),
    section("permissions", "Autorisations de l'appareil", `<div class="table-wrap"><table>
<thead><tr><th>Autorisation</th><th>Utilisation</th></tr></thead>
<tbody>
<tr><td>Appareil photo</td><td>Prendre une photo pour le diagnostic IA, uniquement lorsque vous le demandez</td></tr>
<tr><td>Internet</td><td>Connexion Google, sauvegarde Drive, diagnostic photo et vérification de l'abonnement</td></tr>
<tr><td>Fichiers / partage</td><td>Enregistrer et partager vos rapports PDF, Excel et vos sauvegardes</td></tr>
</tbody></table></div>`),
    section("utilisation", "Utilisation des données", `<p>Les données servent uniquement à :</p>
<ul><li>gérer votre exploitation et calculer vos statistiques et votre rentabilité ;</li><li>afficher les tableaux de bord, le calendrier et les alertes ;</li><li>produire vos rapports PDF, Excel et vos factures ;</li><li>sauvegarder et restaurer vos données lorsque vous le demandez ;</li><li>fournir les fonctionnalités en ligne que vous choisissez d'utiliser.</li></ul>`),
    section("partage", "Partage avec des tiers", `<p>SahelSoft ne partage pas vos données d'exploitation. Seuls interviennent, et uniquement si vous utilisez la fonctionnalité correspondante : <strong>Google</strong> (connexion, Google Drive, Gemini, Google Play) et <strong>Supabase</strong> (hébergement du service de diagnostic photo). Vos données peuvent aussi être communiquées si la loi l'exige.</p>`),
    section("conservation", "Conservation et suppression", `<ul>
<li>Les données locales sont conservées sur votre appareil jusqu'à leur suppression par vous (réinitialisation dans l'application ou désinstallation).</li>
<li>Les sauvegardes Google Drive restent dans votre Drive jusqu'à ce que vous les supprimiez.</li>
<li>Le compteur de diagnostics ne contient ni photo ni information d'identification personnelle.</li>
</ul>
<p>La procédure complète est détaillée sur la page <a href="/delete-account/agrisuivi-pro/">Suppression de compte AgriSuivi Pro</a>.</p>`),
    section("droits", "Vos droits", rights),
    section("securite", "Sécurité", security),
    section("enfants", "Protection des mineurs", children),
    section("modifications", "Modifications", changes),
    section("contact", "Contact", contact),
  ],
});

// ---------------------------------------------------------------------------
// 3. Account deletion centre (includes SuguCash, #sugucash)
// ---------------------------------------------------------------------------

const requestTemplate = (app) => `<div class="template">Objet : Demande de suppression de données — ${app}

Bonjour,
Je souhaite la suppression de mes données liées à ${app}.
Adresse e-mail utilisée dans l'application (si applicable) : …
Clé de licence (applications web, si applicable) : …
Merci.</div>`;

page({
  file: "delete-account.html",
  canonical: "/delete-account.html",
  title: "Suppression de compte et de données | SahelSoft",
  description: "Comment supprimer votre compte et vos données dans les applications SahelSoft : SuguCash, AgriSuivi Pro et applications web.",
  eyebrow: "Centre de suppression de compte",
  heading: "Suppression de compte et de données",
  lead: "Cette page explique comment supprimer votre compte et vos données dans chaque application SahelSoft, quelles données sont concernées et dans quels délais.",
  nav: "Suppression de compte",
  chips: ["Délai de traitement : 30 jours maximum"],
  sections: [
    section("choisir", "Choisissez votre application", `<div class="cards">
<a class="card" href="#sugucash"><strong>SuguCash</strong><span>Procédure détaillée ci-dessous</span></a>
<a class="card" href="/delete-account/agrisuivi-pro/"><strong>AgriSuivi Pro</strong><span>Page dédiée</span></a>
<a class="card" href="#applications-web"><strong>Devisio, Fisca+, SahelPaie, SahelImmo, Sahel Caisse</strong><span>Applications web</span></a>
<a class="card" href="#logiciels-windows"><strong>Stock Flow, FleetMaster</strong><span>Logiciels Windows</span></a>
</div>`),
    section("sugucash", "SuguCash", `<p>Application SuguCash, éditée par <strong>SahelSoft</strong>.</p>
<h3>Supprimer vos données vous-même</h3>
<ol class="steps">
<li><strong>Données sur le téléphone</strong> : désinstallez SuguCash, ou effacez ses données dans Android (Paramètres › Applications › SuguCash › Stockage › Effacer les données). Votre compte local et toutes vos données sont alors supprimés définitivement.</li>
<li><strong>Sauvegarde Google Drive</strong> (si vous l'aviez activée) : supprimez le fichier de sauvegarde SuguCash de votre Google Drive.</li>
<li><strong>Accès Google</strong> (si vous vous étiez connecté avec Google) : retirez l'accès de SuguCash sur ${googlePermissions}.</li>
</ol>
<h3>Demander la suppression à SahelSoft</h3>
<p>Pour toute demande, ou si vous avez besoin d'aide, écrivez à ${mail} :</p>
${requestTemplate("SuguCash")}
<h3>Données supprimées et conservées</h3>
<div class="table-wrap"><table>
<thead><tr><th>Données</th><th>Traitement</th></tr></thead>
<tbody>
<tr><td>Compte local, recettes, dépenses, dettes, paiements, historique, paramètres</td><td>Supprimés définitivement (ils ne sont stockés que sur votre téléphone)</td></tr>
<tr><td>Sauvegarde Google Drive</td><td>Supprimée lorsque vous effacez le fichier de votre Drive</td></tr>
<tr><td>Historique d'achat et d'abonnement Google Play</td><td>Conservé par Google selon ses propres règles et obligations légales</td></tr>
<tr><td>Échanges avec le support</td><td>Supprimés sur demande, sauf obligation légale de conservation</td></tr>
</tbody></table></div>`),
    section("agrisuivi-pro", "AgriSuivi Pro", `<p>La procédure complète de suppression pour AgriSuivi Pro (Android et Windows) est disponible sur sa page dédiée.</p>
<div class="actions"><a class="btn btn-primary" href="/delete-account/agrisuivi-pro/">Supprimer mon compte AgriSuivi Pro</a></div>`),
    section("applications-web", "Applications web", `<p>Devisio, Fisca+, SahelPaie, SahelImmo et Sahel Caisse enregistrent vos données dans votre navigateur.</p>
<ol class="steps">
<li>Utilisez l'option de suppression de l'application (par exemple « Tout effacer » ou « Données » dans les paramètres), ou effacez les données du site dans les réglages de votre navigateur.</li>
<li>Si l'application est installée sur votre appareil, désinstallez-la.</li>
<li>Pour supprimer les informations liées à votre achat ou à votre licence, écrivez à ${mail} en indiquant votre clé de licence.</li>
</ol>`),
    section("logiciels-windows", "Logiciels Windows", `<p>Pour Stock Flow et FleetMaster, les données sont enregistrées sur votre ordinateur. Désinstallez le logiciel puis supprimez son dossier de données pour tout effacer. SahelSoft ne détient pas de copie de ces données.</p>`),
    section("delais", "Délais et confirmation", `<p>Les demandes envoyées par e-mail sont traitées dans un délai maximal de <strong>30 jours</strong>. Vous recevez une confirmation une fois la suppression effectuée.</p>`),
    section("contact", "Contact", contact),
  ],
});

// ---------------------------------------------------------------------------
// 4. AgriSuivi Pro account deletion (also published at /delete-account/agrisuivi-pro.html)
// ---------------------------------------------------------------------------

const agriDeletion = {
  canonical: "/delete-account/agrisuivi-pro",
  title: "Suppression de compte AgriSuivi Pro | SahelSoft",
  description: "Comment supprimer votre compte et vos données AgriSuivi Pro (Android et Windows), édité par SahelSoft.",
  eyebrow: "AgriSuivi Pro",
  heading: "Suppression de compte AgriSuivi Pro",
  lead: "Application AgriSuivi Pro, éditée par SahelSoft. Cette page explique comment supprimer votre compte et vos données, sur Android comme sur Windows.",
  nav: "Suppression de compte",
  chips: ["Android et Windows", "Délai de traitement : 30 jours maximum"],
  sections: [
    section("android", "Sur Android", `<ol class="steps">
<li><strong>Dans l'application</strong> : ouvrez Paramètres, puis utilisez l'option de réinitialisation pour effacer les données de l'exploitation.</li>
<li><strong>Supprimer tout</strong> : désinstallez AgriSuivi Pro, ou effacez ses données dans Android (Paramètres › Applications › AgriSuivi Pro › Stockage › Effacer les données). Les comptes locaux et toutes les données sont supprimés définitivement.</li>
<li><strong>Sauvegarde Google Drive</strong> (si activée) : supprimez le fichier de sauvegarde AgriSuivi Pro de votre Google Drive.</li>
<li><strong>Accès Google</strong> (si vous vous êtes connecté avec Google) : retirez l'accès d'AgriSuivi Pro sur ${googlePermissions}.</li>
<li><strong>Abonnement Premium</strong> : résiliez-le dans Google Play › Paiements et abonnements. La désinstallation ne met pas fin à l'abonnement.</li>
</ol>`),
    section("windows", "Sur Windows", `<ol class="steps">
<li>Désinstallez AgriSuivi Pro depuis Paramètres › Applications de Windows.</li>
<li>Supprimez le dossier <strong>Documents/AgriSuiviPro</strong>, qui contient vos données, votre licence et vos sauvegardes. Tant que ce dossier existe, une réinstallation retrouve vos données.</li>
</ol>`),
    section("demande", "Demander la suppression à SahelSoft", `<p>Pour toute demande de suppression, ou si vous avez besoin d'assistance, écrivez à ${mail} :</p>
${requestTemplate("AgriSuivi Pro")}
<p>Les demandes sont traitées dans un délai maximal de <strong>30 jours</strong> et confirmées par e-mail.</p>`),
    section("donnees", "Données supprimées et conservées", `<div class="table-wrap"><table>
<thead><tr><th>Données</th><th>Traitement</th></tr></thead>
<tbody>
<tr><td>Comptes locaux, exploitation, élevage, cultures, pisciculture, santé animale, dépenses, recettes, factures, rapports, paramètres</td><td>Supprimés définitivement (stockés uniquement sur votre appareil)</td></tr>
<tr><td>Sauvegardes Google Drive</td><td>Supprimées lorsque vous effacez les fichiers de votre Drive</td></tr>
<tr><td>Photos de diagnostic IA</td><td>Non conservées par SahelSoft</td></tr>
<tr><td>Compteur anonyme de diagnostics</td><td>Supprimé sur demande</td></tr>
<tr><td>Historique d'abonnement Google Play</td><td>Conservé par Google selon ses propres règles et obligations légales</td></tr>
</tbody></table></div>`),
    section("contact", "Contact", contact),
  ],
};
page({ file: "delete-account/agrisuivi-pro/index.html", ...agriDeletion });
page({ file: "delete-account/agrisuivi-pro.html", ...agriDeletion });

// ---------------------------------------------------------------------------
// 5. Terms of use
// ---------------------------------------------------------------------------

page({
  file: "terms.html",
  canonical: "/terms.html",
  title: "Conditions générales d'utilisation | SahelSoft",
  description: "Conditions générales d'utilisation des applications et logiciels SahelSoft.",
  eyebrow: "Conditions d'utilisation",
  heading: "Conditions générales d'utilisation",
  lead: "Les présentes conditions encadrent l'utilisation des applications, logiciels et du site de SahelSoft. En utilisant nos services, vous les acceptez.",
  nav: "Conditions d'utilisation",
  chips: ["S'applique à toutes les applications SahelSoft"],
  sections: [
    section("editeur", "Éditeur", editor),
    section("objet", "Objet", `<p>Ces conditions définissent les règles d'utilisation des applications Android, logiciels Windows et applications web édités par SahelSoft (SuguCash, AgriSuivi Pro, Devisio, Fisca+, SahelPaie, SahelImmo, Sahel Caisse, Stock Flow, FleetMaster), ainsi que du site sahelsoft.tech.</p>`),
    section("acces", "Accès aux services", `<ul>
<li>Les applications Android sont distribuées via Google Play ; les applications web sont accessibles depuis un navigateur ; les logiciels Windows s'installent sur ordinateur.</li>
<li>Certaines applications fonctionnent en version de démonstration ou gratuite, avec des fonctionnalités limitées.</li>
<li>L'utilisateur est responsable de son équipement, de sa connexion Internet et de la confidentialité de ses identifiants.</li>
</ul>`),
    section("licences", "Licences, prix et paiement", `<ul>
<li>Selon l'application, l'accès complet est accordé par une <strong>licence à paiement unique</strong> ou par un <strong>abonnement</strong> (Premium sur Android).</li>
<li>Les licences des applications web sont vendues via la plateforme Chariow et limitées à un nombre d'appareils indiqué lors de l'achat. Les abonnements Android sont gérés par Google Play.</li>
<li>Pour un achat direct auprès de SahelSoft, le moyen de paiement (Mobile Money ou autre) vous est communiqué par WhatsApp ou par e-mail.</li>
<li>La licence est personnelle : elle ne peut être revendue, partagée ou publiée.</li>
<li>Les demandes de remboursement sont étudiées au cas par cas en contactant le support ; pour les achats Google Play, les règles de remboursement de Google s'appliquent.</li>
</ul>`),
    section("utilisation", "Utilisation autorisée", `<p>L'utilisateur s'engage à utiliser les services de manière légale et à ne pas :</p>
<ul><li>copier, décompiler, modifier ou redistribuer les logiciels ;</li><li>contourner le système de licence ou de protection ;</li><li>utiliser les services pour une activité frauduleuse ou illégale.</li></ul>`),
    section("donnees", "Données et sauvegardes", `<p>Les données saisies appartiennent à l'utilisateur. La plupart des applications enregistrent ces données <strong>localement</strong> sur l'appareil : l'utilisateur est responsable de leur exactitude et de la réalisation de sauvegardes régulières. SahelSoft ne peut pas récupérer des données perdues suite à une panne, une perte d'appareil, une désinstallation ou un effacement du navigateur.</p>
<p>Le traitement des données personnelles est décrit dans la <a href="/privacy.html">Politique de confidentialité</a>.</p>`),
    section("calculs", "Calculs fiscaux, sociaux et comptables", `<p>Fisca+, SahelPaie, SahelImmo et les autres outils de SahelSoft calculent des montants (impôts, cotisations, bulletins de paie, amortissements, écritures) à partir des règles en vigueur connues au moment de leur conception et des informations saisies par l'utilisateur.</p>
<div class="note amber">Ces résultats sont une <strong>aide à la gestion</strong>. Ils ne constituent pas un conseil fiscal, juridique ou comptable et ne remplacent pas les formulaires officiels. L'utilisateur doit vérifier les montants avant toute déclaration ou paiement et, en cas de doute, consulter un professionnel ou l'administration compétente.</div>`),
    section("ia", "Diagnostic par intelligence artificielle", `<p>Le diagnostic photo d'AgriSuivi Pro fournit une indication générée automatiquement. Il peut être incomplet ou inexact et ne remplace pas l'avis d'un vétérinaire, d'un agronome ou d'un technicien qualifié.</p>`),
    section("propriete", "Propriété intellectuelle", `<p>Les logiciels, marques (SahelSoft, SuguCash, AgriSuivi Pro, Devisio, Fisca+, SahelPaie, SahelImmo, Sahel Caisse, Stock Flow, FleetMaster), logos, textes et visuels sont la propriété de SahelSoft. Toute reproduction sans autorisation écrite est interdite.</p>`),
    section("responsabilite", "Responsabilité", `<p>SahelSoft met tout en œuvre pour fournir des logiciels fiables et les améliorer régulièrement, sans pouvoir garantir l'absence totale d'erreurs ou d'interruptions. SahelSoft ne pourra être tenu responsable des dommages indirects résultant de l'utilisation des logiciels, d'une erreur de saisie, d'une perte de données non sauvegardées ou d'une décision prise sur la base des résultats affichés.</p>`),
    section("support", "Assistance et mises à jour", `<p>Le support est assuré par e-mail (${mail}) et par WhatsApp (${whatsapp}). Les mises à jour des applications web sont appliquées automatiquement ; celles des applications Android via Google Play ; celles des logiciels Windows par un nouvel installateur fourni par SahelSoft.</p>`),
    section("modifications", "Modification des conditions", `<p>SahelSoft peut modifier ces conditions. La version en vigueur est celle publiée sur cette page, avec sa date de mise à jour.</p>`),
    section("droit", "Droit applicable", `<p>Ces conditions sont régies par le droit malien. En cas de litige, une solution amiable sera recherchée en priorité ; à défaut, les juridictions compétentes de Bamako seront saisies.</p>`),
    section("contact", "Contact", contact),
  ],
});
