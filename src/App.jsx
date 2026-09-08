import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Download,
  Headphones,
  History,
  Landmark,
  Mail,
  Menu,
  MessageCircle,
  Package,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sprout,
  Store,
  Users,
  Wallet,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import config from "./config.json";
import { useReveal } from "./hooks/useReveal";
import { SpotlightCard } from "./components/SpotlightCard";

const {
  applications,
  agriSuiviPro,
  brand,
  contact,
  demoLinks,
  mission,
  paymentMethods,
  playStoreLinks,
  screenshotGallery,
  softwareCatalog,
  sugucash,
  whyChoose,
} = config;

const navItems = [
  ["Accueil", "#accueil"],
  ["Solutions", "#solutions"],
  ["Tarifs", "#tarifs"],
  ["À propos", "#apropos"],
  ["Contact", "#contact"],
];

const heroPillars = [
  ["Simples", "Faciles à utiliser au quotidien", Zap],
  ["Efficaces", "Gain de temps et de productivité", BarChart3],
  ["Sécurisées", "Vos données restent protégées", ShieldCheck],
  ["Support réactif", "Accompagnement personnalisé", Headphones],
];

const appIcons = {
  sugucash: ShoppingCart,
  "stock-flow": Store,
  "agrisuivi-pro": Sprout,
  fleetmaster: Car,
  "mali-paie-pro": Users,
};

const appDetailLinks = {
  sugucash: "/sugucash/",
  "agrisuivi-pro": "/agrisuivi-pro/",
};

const featureIcons = [ShoppingCart, Wallet, ReceiptText, CheckCircle2, History, BarChart3, CloudUpload, WifiOff, RefreshCcw, ShieldCheck];
const whyIcons = [Zap, Smartphone, ShieldCheck, Headphones, BarChart3, Smartphone];

function whatsappUrl(message = "Bonjour SahelSoft, je souhaite avoir plus d'informations.") {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function SectionTitle({ eyebrow, title, text, align = "center" }) {
  return (
    <div className={`mb-8 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 leading-7 text-slate-600">{text}</p> : null}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#accueil");

  useEffect(() => {
    const sections = navItems.map(([, href]) => document.querySelector(href)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) {
          setActiveHref(`#${mostVisible.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <nav aria-label="Navigation principale" className="mx-auto flex min-h-[70px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#accueil" className="flex min-w-0 items-center" aria-label="Accueil SahelSoft">
          <img src={brand.logo} alt="Logo officiel SahelSoft" className="h-12 w-auto object-contain sm:h-14 lg:h-16" />
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([label, href]) => {
            const isActive = activeHref === href;
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-md px-4 py-2 text-sm font-black transition ${isActive ? "text-ocean" : "text-ink hover:bg-mist hover:text-ocean"}`}
              >
                {label}
                <span
                  className={`absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-ocean transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <a href="#tarifs" className="inline-flex items-center gap-2 rounded-md bg-ocean px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700">
            <Download size={17} /> Demander une démo
          </a>
          <a href={whatsappUrl()} aria-label="Contacter SahelSoft sur WhatsApp" className="inline-flex items-center gap-2 rounded-md bg-field px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700">
            <MessageCircle size={17} /> WhatsApp
          </a>
        </div>
        <button className="rounded-md border border-slate-200 p-2 transition hover:bg-mist lg:hidden" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="mobile-menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open ? (
        <div id="mobile-menu" className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {navItems.map(([label, href], index) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`menu-item-in block rounded-md px-3 py-3 font-black hover:bg-mist ${activeHref === href ? "text-ocean" : "text-ink"}`}
              style={{ "--menu-delay": `${index * 40}ms` }}
            >
              {label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            onClick={() => setOpen(false)}
            className="menu-item-in mt-2 flex items-center justify-center gap-2 rounded-md bg-field px-4 py-3 font-black text-white"
            style={{ "--menu-delay": `${navItems.length * 40}ms` }}
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      ) : null}
    </header>
  );
}

function ScreenshotCard({ shot, featured = false }) {
  return (
    <a href={shot.src} target="_blank" rel="noopener noreferrer" className={`group block rounded-2xl border border-slate-200 bg-white p-2 shadow-premium transition duration-300 hover:-translate-y-2 ${featured ? "w-[248px] sm:w-[320px]" : "w-[190px] sm:w-[240px]"}`}>
      <img src={shot.src} alt={shot.alt} className="aspect-[2/3] w-full rounded-xl bg-white object-cover" loading={featured ? "eager" : "lazy"} decoding="async" />
      {shot.label ? <p className="mt-3 text-center text-sm font-black text-ink">{shot.label}</p> : null}
    </a>
  );
}

function HeroScreenshots() {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(true);
  const current = sugucash.screenshots[active];

  const goTo = (index) => {
    if (index === active) return;
    setEntered(false);
    requestAnimationFrame(() => {
      setActive(index);
      requestAnimationFrame(() => setEntered(true));
    });
  };

  const next = () => goTo((active + 1) % sugucash.screenshots.length);
  const previous = () => goTo((active - 1 + sugucash.screenshots.length) % sugucash.screenshots.length);

  return (
    <div className="relative mx-auto flex min-h-[430px] w-full max-w-[640px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-sky-50 px-6 py-8 shadow-soft">
      <div className="absolute left-8 top-8 hidden rotate-[-8deg] opacity-70 blur-[0.1px] md:block">
        <ScreenshotCard shot={sugucash.screenshots[(active + 1) % sugucash.screenshots.length]} />
      </div>
      <div className={`relative z-10 hero-fade ${entered ? "" : "is-leaving"}`}>
        <ScreenshotCard shot={current} featured />
      </div>
      <div className="absolute bottom-8 right-8 hidden rotate-[8deg] opacity-70 blur-[0.1px] md:block">
        <ScreenshotCard shot={sugucash.screenshots[(active + 2) % sugucash.screenshots.length]} />
      </div>
      <button type="button" onClick={previous} className="absolute left-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-soft transition hover:bg-ocean hover:text-white" aria-label="Capture précédente">
        <ChevronLeft size={22} />
      </button>
      <button type="button" onClick={next} className="absolute right-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-soft transition hover:bg-ocean hover:text-white" aria-label="Capture suivante">
        <ChevronRight size={22} />
      </button>
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/90 px-3 py-2 shadow-soft backdrop-blur">
        {sugucash.screenshots.map((shot, index) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Aller à la capture ${index + 1} sur ${sugucash.screenshots.length}`}
            aria-current={index === active}
            className={`h-2 rounded-full transition-all ${index === active ? "w-6 bg-ocean" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
          />
        ))}
      </div>
    </div>
  );
}

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
            className={`reveal mt-4 text-4xl font-black leading-[1.02] text-ink sm:text-5xl lg:text-6xl ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "90ms" }}
          >
            Des solutions numériques pour faire grandir <span className="text-ocean">votre activité</span>
          </h1>
          <p
            className={`reveal mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700 ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "180ms" }}
          >
            SahelSoft développe des logiciels modernes, simples et accessibles pour aider les entreprises et organisations africaines à gérer, suivre et développer leur activité au quotidien.
          </p>
          <div
            className={`reveal mt-7 flex flex-col gap-3 sm:flex-row ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "270ms" }}
          >
            <a href="#solutions" className="inline-flex items-center justify-center gap-2 rounded-md bg-ocean px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[0.97]">
              Découvrir nos solutions <ArrowRight size={19} />
            </a>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-4 font-black text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-mist active:scale-[0.97]">
              Nous contacter <MessageCircle size={19} />
            </a>
          </div>
          <div
            className={`reveal-group mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${inView ? "is-visible" : ""}`}
          >
            {heroPillars.map(([title, text, Icon], index) => (
              <div
                key={title}
                className="reveal rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-premium"
                style={{ "--reveal-delay": `${360 + index * 70}ms` }}
              >
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

function Applications() {
  const [ref, inView] = useReveal(0.15);

  return (
    <section id="solutions" className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Nos solutions" title="Des applications adaptées à vos besoins" text="SuguCash est la première solution publiée. Les autres avancent dans la même vision produit et arrivent progressivement." />
        <div ref={ref} className={`bento-grid reveal-group grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${inView ? "is-visible" : ""}`}>
          {applications.map((app, index) => {
            const Icon = appIcons[app.id] || Package;
            const isFeatured = app.id === "sugucash";

            if (isFeatured) {
              return (
                <SpotlightCard
                  key={app.id}
                  as="article"
                  className="reveal group flex flex-col justify-between overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6 shadow-soft transition hover:shadow-premium sm:col-span-2 lg:col-span-2 lg:row-span-2"
                  style={{ "--reveal-delay": `${index * 70}ms` }}
                >
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-field text-white shadow-soft transition group-hover:scale-110">
                      <Icon size={28} />
                    </div>
                    <h3 className="mt-5 text-2xl font-black text-ink lg:text-3xl">{app.name}</h3>
                    <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-slate-600 lg:text-base">{app.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {sugucash.features.slice(0, 4).map((feature, featureIndex) => {
                        const FeatureIcon = featureIcons[featureIndex] || CheckCircle2;
                        return (
                          <span key={feature} className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-ink shadow-sm">
                            <FeatureIcon size={13} className="text-ocean" /> {feature}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex rounded-md bg-green-50 px-3 py-2 text-xs font-black text-field">{app.status}</span>
                    <a href={appDetailLinks[app.id]} className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-md bg-ocean px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">
                      Découvrir {app.name} <ArrowRight size={16} />
                    </a>
                  </div>
                </SpotlightCard>
              );
            }

            return (
              <SpotlightCard
                key={app.id}
                as="article"
                className="reveal group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-premium"
                style={{ "--reveal-delay": `${index * 70}ms` }}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-soft transition group-hover:scale-110 ${app.id === "mali-paie-pro" ? "bg-orange-500" : app.id === "agrisuivi-pro" ? "bg-field" : "bg-ocean"}`}>
                  <Icon size={25} />
                </div>
                <h3 className="mt-4 text-xl font-black text-ink">{app.name}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{app.description}</p>
                <div className="mt-auto pt-4">
                  <span className="inline-flex rounded-md bg-blue-50 px-3 py-2 text-xs font-black text-ocean">
                    {app.status}
                  </span>
                  {appDetailLinks[app.id] ? (
                    <a href={appDetailLinks[app.id]} className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-ink transition hover:bg-mist hover:text-ocean">
                      Découvrir {app.name} <ArrowRight size={16} />
                    </a>
                  ) : null}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SuguCashGallery() {
  return (
    <section id="sugucash" className="bg-white px-4 pb-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-sky-50 p-5 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean">En vedette</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-ink">SuguCash, votre caisse dans la poche</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Gérez vos recettes, dépenses, finances personnelles, dettes et paiements simplement, même sans connexion Internet. Toutes les interfaces affichées ici sont de vraies captures Android de SuguCash.
              </p>
              {playStoreLinks.sugucash ? (
                <a
                  href={playStoreLinks.sugucash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-3 rounded-md bg-field px-5 py-4 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700 active:scale-[0.97]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded bg-white/80 text-field">▶</span>
                  Télécharger sur Google Play
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-3 rounded-md bg-field/50 px-5 py-4 text-sm font-black text-white shadow-soft"
                >
                  <span className="grid h-7 w-7 place-items-center rounded bg-white/80 text-field">▶</span>
                  Disponible prochainement sur Google Play
                </button>
              )}
              <a href="/sugucash/" className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-black text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-mist hover:text-ocean">
                Découvrir SuguCash <ArrowRight size={16} />
              </a>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 pt-3 snap-x snap-mandatory [scrollbar-width:thin]">
              {sugucash.screenshots.map((shot) => (
                <div key={shot.src} className="snap-center shrink-0">
                  <ScreenshotCard shot={shot} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-3 border-t border-slate-200 pt-5">
            {sugucash.features.map((feature, index) => {
              const Icon = featureIcons[index] || CheckCircle2;
              return (
                <span key={feature} className="inline-flex items-center gap-2 text-xs font-black text-ink">
                  <Icon size={15} className="text-ocean" /> {feature}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AgriSuiviGallery() {
  return (
    <section id="agrisuivi-pro" className="bg-white px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-5 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-[0.52fr_1.48fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-field">{agriSuiviPro.tag}</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-ink">AgriSuivi Pro, toute l'exploitation sous contrôle</h2>
              <p className="mt-4 leading-7 text-slate-600">{agriSuiviPro.description}</p>
              <a href="/agrisuivi-pro/" className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-field px-5 py-4 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700">
                Découvrir AgriSuivi Pro <ArrowRight size={17} />
              </a>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 pt-3 snap-x snap-mandatory [scrollbar-width:thin]">
              {agriSuiviPro.screenshots.map((shot) => (
                <div key={shot.src} className="snap-center shrink-0">
                  <ScreenshotCard shot={shot} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-3 border-t border-emerald-100 pt-5">
            {agriSuiviPro.screenshots.map((shot) => (
              <span key={shot.label} className="inline-flex items-center gap-2 text-xs font-black text-ink">
                <Sprout size={15} className="text-field" /> {shot.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Software() {
  const [ref, inView] = useReveal(0.15);

  return (
    <section id="tarifs" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Tarifs" title="Deux options simples : démo gratuite et version définitive" text="Les logiciels desktop SahelSoft sont prévus avec paiement unique, aucune mensualité, utilisation illimitée et support disponible." />
        <div ref={ref} className={`reveal-group grid gap-5 lg:grid-cols-3 ${inView ? "is-visible" : ""}`}>
          {softwareCatalog.map((item, index) => {
            const demoUrl = demoLinks[item.demoUrlKey];
            return (
              <SpotlightCard
                key={item.id}
                as="article"
                className="reveal overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition hover:shadow-premium"
                style={{ "--reveal-delay": `${index * 90}ms` }}
              >
                <div className="aspect-[16/10] overflow-hidden bg-mist">
                  <img src={item.image} alt={`${item.name} - aperçu réaliste du logiciel`} className="h-full w-full object-cover" loading="lazy" decoding="async" width="1200" height="800" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{item.tag}</p>
                  <h3 className="mt-2 text-2xl font-black text-ink">{item.name}</h3>
                  <p className="mt-3 min-h-16 leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-5 grid gap-2">
                    {item.features.map((feature) => (
                      <p key={feature} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <CheckCircle2 className="shrink-0 text-field" size={17} /> {feature}
                      </p>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-3 rounded-md bg-mist p-4">
                    <div className="flex items-center justify-between gap-4"><span className="font-bold text-slate-600">Démo gratuite</span><span className="font-black text-field">0 FCFA</span></div>
                    <div className="flex items-center justify-between gap-4"><span className="font-bold text-slate-600">Version définitive</span><span className="text-2xl font-black text-ocean">{item.price}</span></div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {demoUrl ? (
                      <a href={demoUrl} className="inline-flex items-center justify-center gap-2 rounded-md bg-ocean px-4 py-3 text-sm font-black text-white hover:bg-blue-700"><Download size={17} /> Télécharger la démo</a>
                    ) : (
                      <p className="rounded-md bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">Lien bientôt disponible. Contactez-nous sur WhatsApp pour recevoir la démo.</p>
                    )}
                    <a href={whatsappUrl(`Bonjour SahelSoft, je souhaite recevoir la démo de ${item.name}.`)} className="inline-flex items-center justify-center gap-2 rounded-md bg-field px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">
                      <MessageCircle size={17} /> Demander sur WhatsApp
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="apropos" className="bg-mist px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-black text-ocean">Pourquoi choisir SahelSoft ?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {whyChoose.map((item, index) => {
              const Icon = whyIcons[index] || BadgeCheck;
              return (
                <div key={item} className="text-center">
                  <Icon className={`mx-auto ${index === whyChoose.length - 1 ? "text-field" : "text-ocean"}`} size={29} />
                  <p className="mt-3 text-xs font-black leading-5 text-ink">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="grid h-full md:grid-cols-[1fr_170px]">
            <div className="p-6">
              <h2 className="text-2xl font-black text-ink">Notre mission</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">{mission.text}</p>
              <a href="#contact" className="mt-5 inline-flex items-center gap-2 rounded-md bg-ocean px-4 py-3 text-sm font-black text-white hover:bg-blue-700">
                En savoir plus sur nous <ArrowRight size={16} />
              </a>
            </div>
            <div className="hidden bg-[linear-gradient(135deg,#0f172a,#2563eb)] md:block" aria-hidden="true" />
          </div>
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
            <a key={shot.src} href={shot.src} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
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
    <section id="contact" className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative overflow-hidden rounded-lg bg-ink p-8 text-white shadow-premium">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(37,99,235,0.45),transparent_45%),radial-gradient(circle_at_88%_88%,rgba(22,163,74,0.3),transparent_45%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">Contact</p>
            <h2 className="mt-3 text-3xl font-black">Parlez à SahelSoft sur WhatsApp</h2>
            <p className="mt-4 leading-7 text-white/76">Recevez une démo, posez vos questions ou demandez une information sur une application.</p>
            <div className="mt-7 grid gap-3">
              <p className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <MessageCircle className="shrink-0 text-field" /> <span><strong>WhatsApp</strong><br />{contact.whatsappDisplay}</span>
              </p>
              <p className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <Mail className="shrink-0 text-sky-200" /> <span><strong>Email</strong><br /><a href={`mailto:${contact.email}`} className="hover:text-sky-200">{contact.email}</a></span>
              </p>
            </div>
            <a href={whatsappUrl()} className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-field px-5 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-700">
              <MessageCircle size={19} /> Nous contacter
            </a>
          </div>
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
            <p className="flex items-start gap-3 font-semibold text-slate-700"><ShieldCheck className="mt-0.5 shrink-0 text-field" /> Applications et logiciels conçus pour être simples, rapides et professionnels.</p>
            <p className="mt-3 flex items-start gap-3 font-semibold text-slate-700"><Headphones className="mt-0.5 shrink-0 text-ocean" /> Support disponible pour l'installation et la prise en main.</p>
            <p className="mt-3 flex items-start gap-3 font-semibold text-slate-700"><Zap className="mt-0.5 shrink-0 text-field" /> Réponse rapide par WhatsApp.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const legalLinks = [
    ["Centre confidentialité", "/privacy.html"],
    ["Centre suppression de compte", "/delete-account.html"],
    ["Conditions d'utilisation", "/terms.html"],
  ];
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_10%_100%,rgba(22,163,74,0.2),transparent_40%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <img src={brand.footerLogo || brand.logo} alt="Logo officiel SahelSoft" className="h-16 w-auto rounded-md bg-white object-contain p-2" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">{brand.slogan}</p>
        </div>
        <div>
          <h3 className="font-black">Liens rapides</h3>
          <div className="mt-3 grid gap-2">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="text-sm font-semibold text-white/72 hover:text-white">{label}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-black">Nos solutions</h3>
          <div className="mt-3 grid gap-2">
            {applications.map((app) => (
              <a key={app.id} href={appDetailLinks[app.id] || "#solutions"} className="text-sm font-semibold text-white/72 hover:text-white">{app.name}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-black">Contact</h3>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-white/72">
            <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
            <a href={whatsappUrl()} className="hover:text-white">WhatsApp {contact.whatsappDisplay}</a>
            <span>Bamako, Mali</span>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-semibold text-white/64 md:flex-row md:items-center md:justify-between">
          <p>© 2026 SahelSoft. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a href={whatsappUrl()} className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center gap-2 rounded-md bg-field px-5 py-4 font-black text-white shadow-premium transition hover:-translate-y-0.5 hover:bg-emerald-700" aria-label="Contacter SahelSoft sur WhatsApp">
      <MessageCircle size={20} /> <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.min(Math.max(scrollTop / max, 0), 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
      <div className="h-full bg-gradient-to-r from-ocean to-field transition-[width] duration-150 ease-out" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

function App() {
  return (
    <>
      <a href="#accueil" className="skip-link">Aller au contenu</a>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Applications />
        <SuguCashGallery />
        <AgriSuiviGallery />
        <Software />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

export default App;
