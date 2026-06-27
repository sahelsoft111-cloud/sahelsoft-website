import {
  BadgeCheck,
  CheckCircle2,
  Download,
  Headphones,
  Landmark,
  Mail,
  Menu,
  MessageCircle,
  MonitorCheck,
  ShieldCheck,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import config from "./config.json";

const { brand, contact, demoLinks, paymentMethods, purchaseSteps, screenshotGallery, softwareCatalog } = config;

const navItems = [
  ["Accueil", "#accueil"],
  ["Solutions", "#solutions"],
  ["Tarifs", "#tarifs"],
  ["Comment acheter", "#acheter"],
  ["Contact", "#contact"],
];

const benefits = ["Paiement unique", "Aucune mensualité", "Utilisation illimitée", "Support disponible"];
const heroStats = ["3 logiciels", "Démo gratuite", "Licence définitive", "Support WhatsApp"];

function whatsappUrl(message = "Bonjour SAHELSOFT, je souhaite commander un logiciel.") {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function SectionTitle({ eyebrow, title, text, light = false, align = "center" }) {
  return (
    <div className={`mb-8 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-field">{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-black leading-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {text ? <p className={`mt-4 leading-7 ${light ? "text-white/72" : "text-slate-600"}`}>{text}</p> : null}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <nav aria-label="Navigation principale" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <a href="#accueil" className="flex min-w-0 items-center gap-3" aria-label="Accueil SAHELSOFT">
          <img src="/images/sahelsoft-logo.webp" alt="SAHELSOFT" className="h-11 w-auto rounded-md bg-ink object-contain sm:h-12 lg:h-14" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-lg font-black text-ink">{brand.name}</span>
            <span className="block text-xs font-bold text-slate-500">Éditeur de logiciels</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-mist hover:text-ink">
              {label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="#demo" className="inline-flex items-center gap-2 rounded-md bg-ocean px-4 py-2.5 text-sm font-black text-white shadow-soft hover:bg-blue-700">
            <Download size={17} /> Télécharger une démo
          </a>
          <a href={whatsappUrl()} aria-label="Commander via WhatsApp" className="inline-flex items-center gap-2 rounded-md bg-field px-4 py-2.5 text-sm font-black text-white shadow-soft hover:bg-emerald-700">
            <MessageCircle size={17} /> WhatsApp
          </a>
        </div>

        <button className="rounded-md border border-slate-200 p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 font-bold text-slate-700">
              {label}
            </a>
          ))}
          <a href="#demo" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-md bg-ocean px-4 py-3 font-black text-white">
            <Download size={18} /> Télécharger une démo
          </a>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  return (
    <section id="accueil" className="relative isolate overflow-hidden bg-ink text-white">
      <img src="/images/sahelsoft-hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" loading="eager" decoding="async" fetchPriority="high" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.82)_52%,rgba(15,23,42,0.42)_100%)]" />
      <div className="relative mx-auto grid min-h-[590px] max-w-7xl content-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white/90">
            <BadgeCheck size={17} /> {brand.slogan}
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Digitalisez votre activité avec SAHELSOFT.</h1>
          <p className="mt-5 text-xl font-bold text-white/92">{brand.valueProposition}</p>
          <p className="mt-4 max-w-2xl leading-8 text-white/76">
            Des solutions adaptées aux réalités africaines pour les entreprises, commerces, exploitations agricoles et équipes RH.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-md bg-ocean px-6 py-4 font-black text-white shadow-premium hover:bg-blue-700">
              <Download size={19} /> Télécharger une démo
            </a>
            <a href={whatsappUrl()} aria-label="Commander via WhatsApp" className="inline-flex items-center justify-center gap-2 rounded-md bg-field px-6 py-4 font-black text-white shadow-premium hover:bg-emerald-700">
              <MessageCircle size={19} /> Commander via WhatsApp
            </a>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat} className="rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="font-black">{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section id="solutions" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow="Solutions"
          title="Des logiciels métiers clairs, prêts à vendre et faciles à prendre en main"
          text="Trois offres lisibles, des fonctionnalités essentielles, une démo gratuite et un achat simple par WhatsApp."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {softwareCatalog.map((item) => (
            <article key={item.id} id={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-premium">
              <div className="aspect-[16/10] overflow-hidden bg-mist">
                <img src={item.image} alt={`${item.name} - aperçu réaliste du logiciel`} className="h-full w-full object-cover" loading="lazy" decoding="async" width="1200" height="800" />
              </div>
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{item.tag}</p>
                <h3 className="mt-2 text-2xl font-black text-ink">{item.name}</h3>
                <p className="mt-3 min-h-16 leading-7 text-slate-600">{item.description}</p>
                <div className="mt-5 grid gap-2">
                  {item.features.slice(0, 6).map((feature) => (
                    <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <CheckCircle2 className="shrink-0 text-field" size={17} /> {feature}
                    </p>
                  ))}
                </div>
                <div className="mt-6 flex items-end justify-between gap-4 rounded-md bg-slate-50 p-4">
                  <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Version définitive</span>
                  <span className="text-2xl font-black text-ocean">{item.price}</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-md bg-ocean px-4 py-3 text-sm font-black text-white hover:bg-blue-700">
                    <Download size={17} /> Démo
                  </a>
                  <a href={whatsappUrl(`Bonjour SAHELSOFT, je souhaite commander ${item.name}.`)} className="inline-flex items-center justify-center gap-2 rounded-md bg-field px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">
                    <MessageCircle size={17} /> WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="bg-mist px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Télécharger une démo" title="Essayez avant d'acheter" text="Chaque démo est gratuite. Si le lien n'est pas encore disponible, WhatsApp reste le moyen le plus rapide pour la recevoir." />
        <div className="grid gap-5 md:grid-cols-3">
          {softwareCatalog.map((item) => {
            const demoUrl = demoLinks[item.demoUrlKey];
            return (
              <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
                <h3 className="text-xl font-black text-ink">{item.name}</h3>
                <div className="mt-5 space-y-3">
                  <p className="flex items-center gap-2 font-semibold text-slate-700"><CheckCircle2 className="text-field" size={18} /> Démo gratuite</p>
                  <p className="flex items-center gap-2 font-semibold text-slate-700"><MonitorCheck className="text-ocean" size={18} /> Windows 10 / Windows 11</p>
                </div>
                <a href={whatsappUrl(`Bonjour SAHELSOFT, je souhaite recevoir la démo de ${item.name}.`)} className="mt-6 flex items-center justify-center gap-2 rounded-md bg-field px-4 py-3 text-center font-black text-white hover:bg-emerald-700">
                  <MessageCircle size={18} /> Demander la démo sur WhatsApp
                </a>
                {demoUrl ? (
                  <a href={demoUrl} className="mt-3 flex items-center justify-center gap-2 rounded-md bg-ocean px-4 py-3 text-center font-black text-white hover:bg-blue-700">
                    <Download size={18} /> Télécharger la démo
                  </a>
                ) : (
                  <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">
                    Lien bientôt disponible. Contactez-nous sur WhatsApp pour recevoir la démo.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="tarifs" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Tarifs" title="Une démo gratuite. Une licence définitive." text="Pas d'abonnement, pas de mensualité. Vous payez une seule fois et vous utilisez le logiciel sans limitation." />
        <div className="grid gap-5 lg:grid-cols-3">
          {softwareCatalog.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
              <h3 className="text-xl font-black text-ink">{item.name}</h3>
              <div className="mt-5 grid gap-3 rounded-md bg-mist p-4">
                <div className="flex items-center justify-between gap-4"><span className="font-bold text-slate-600">Démo gratuite</span><span className="font-black text-field">0 FCFA</span></div>
                <div className="flex items-center justify-between gap-4"><span className="font-bold text-slate-600">Version définitive</span><span className="text-2xl font-black text-ocean">{item.price}</span></div>
              </div>
              <div className="mt-5 grid gap-3">
                {benefits.map((benefit) => (
                  <p key={benefit} className="flex items-center gap-2 font-semibold text-slate-700"><CheckCircle2 className="text-field" size={18} /> {benefit}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Purchase() {
  return (
    <section id="acheter" className="bg-ink px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Comment acheter" title="Un achat simple, clair et accompagné" text="Le parcours est pensé pour convertir vite : test, contact, paiement et licence définitive." light />
        <div className="grid gap-4 md:grid-cols-5">
          {purchaseSteps.map((step, index) => (
            <div key={step} className="rounded-lg border border-white/12 bg-white/8 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-field font-black text-white">{index + 1}</span>
              <p className="mt-5 font-black leading-6">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  if (!screenshotGallery.length) return null;

  return (
    <section className="bg-mist px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Galerie" title="Captures des logiciels" text="Aperçus réels des tableaux de bord, rapports et écrans de travail." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {screenshotGallery.map((shot) => (
            <a key={shot.src} href={shot.src} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
              <img src={shot.src} alt={shot.alt} className="aspect-[16/10] w-full object-cover" loading="lazy" decoding="async" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg bg-ink p-8 text-white shadow-premium">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">Contact</p>
          <h2 className="mt-3 text-3xl font-black">Parlez à SAHELSOFT sur WhatsApp</h2>
          <p className="mt-4 leading-7 text-white/76">Recevez une démo, posez vos questions ou commandez une licence définitive.</p>
          <div className="mt-7 grid gap-4">
            <p className="flex items-center gap-3"><MessageCircle className="text-emerald-300" /> <span><strong>WhatsApp</strong><br />{contact.whatsappDisplay}</span></p>
            <p className="flex items-center gap-3"><Mail className="text-emerald-300" /> <span><strong>Email</strong><br />{contact.email}</span></p>
          </div>
          <a href={whatsappUrl()} className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-field px-5 py-4 font-black text-white hover:bg-emerald-700">
            <MessageCircle size={19} /> Commander via WhatsApp
          </a>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-2xl font-black text-ink">Moyens de paiement</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {paymentMethods.map((method) => (
              <div key={method.name} className="rounded-md border border-slate-200 bg-slate-50 p-5">
                {method.name.includes("Orange") ? <Wallet className="text-field" /> : <Landmark className="text-ocean" />}
                <p className="mt-4 font-black text-ink">{method.name}</p>
                <p className="mt-2 font-semibold text-slate-600">{method.details}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md bg-mist p-5">
            <p className="flex items-start gap-3 font-semibold text-slate-700"><ShieldCheck className="mt-0.5 shrink-0 text-field" /> Licence définitive remise après validation du paiement.</p>
            <p className="mt-3 flex items-start gap-3 font-semibold text-slate-700"><Headphones className="mt-0.5 shrink-0 text-ocean" /> Support disponible pour l'installation et la prise en main.</p>
            <p className="mt-3 flex items-start gap-3 font-semibold text-slate-700"><Zap className="mt-0.5 shrink-0 text-field" /> Réponse rapide par WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <img src="/images/sahelsoft-logo.webp" alt="SAHELSOFT" className="h-14 w-auto rounded-md object-contain" />
          <p className="mt-3 text-sm text-white/64">© 2026 SAHELSOFT. Tous droits réservés.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="rounded-md bg-white/8 px-3 py-2 text-sm font-bold text-white/84">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a href={whatsappUrl()} className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center gap-2 rounded-md bg-field px-5 py-4 font-black text-white shadow-premium hover:bg-emerald-700" aria-label="Commander via WhatsApp">
      <MessageCircle size={20} /> <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

function App() {
  return (
    <>
      <a href="#accueil" className="skip-link">Aller au contenu</a>
      <Header />
      <main>
        <Hero />
        <Solutions />
        <DemoSection />
        <Pricing />
        <Purchase />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

export default App;




