import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Headphones,
  Images,
  Landmark,
  Mail,
  Menu,
  MessageCircle,
  Monitor,
  Package,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Store,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import config from "./config.json";
import { useReveal } from "./hooks/useReveal";
import { SpotlightCard } from "./components/SpotlightCard";

const { about, brand, categories, contact, products } = config;

// Payment details are shared privately on WhatsApp rather than published on the site.
const purchaseSteps = [
  ["Choisissez votre application", "Parcourez nos logiciels et repérez celui qui correspond à votre activité."],
  ["Écrivez-nous sur WhatsApp", "Nous répondons à vos questions et vous proposons une démonstration si besoin."],
  ["Recevez votre licence", "Nous vous indiquons le moyen de paiement, puis vous envoyons votre licence et vous aidons à l'installer."],
];

const navItems = [
  ["Accueil", "#accueil"],
  ["Applications", "#applications"],
  ["En images", "#apercus"],
  ["À propos", "#apropos"],
  ["Contact", "#contact"],
];

const heroPillars = [
  ["Simples", "Faciles à utiliser au quotidien", Zap],
  ["Efficaces", "Gain de temps et de productivité", BarChart3],
  ["Sécurisées", "Vos données restent protégées", ShieldCheck],
  ["Support réactif", "Accompagnement personnalisé", Headphones],
];

// Used when a product has no logo file in config.json: [icon, tile colour].
const fallbackIcons = {
  sugucash: [ShoppingCart, "bg-field"],
  "stock-flow": [Store, "bg-ocean"],
};

const platformIcons = {
  Android: Smartphone,
  Mobile: Smartphone,
  Windows: Monitor,
  PC: Monitor,
  Web: Globe,
};


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
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
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
                className={`relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-black transition xl:px-4 ${isActive ? "text-ocean" : "text-ink hover:bg-mist hover:text-ocean"}`}
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
          <a href={whatsappUrl()} aria-label="Contacter SahelSoft sur WhatsApp" className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-field px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700">
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
    <div className={`block rounded-2xl border border-slate-200 bg-white p-2 shadow-premium ${featured ? "w-[248px] sm:w-[300px]" : "w-[190px] sm:w-[220px]"}`}>
      <img src={shot.src} alt={shot.alt} className="aspect-[2/3] w-full rounded-xl bg-white object-cover object-top" loading={featured ? "eager" : "lazy"} decoding="async" />
      {shot.label ? <p className="mt-3 text-center text-sm font-black text-ink">{shot.label}</p> : null}
    </div>
  );
}

// Hero: one phone capture per product (the companion phone screen for PC apps).
const heroSlides = products.flatMap((product) => {
  const shot = product.phoneShots?.[0] || (product.device === "phone" ? product.screenshots[0] : null);
  return shot ? [{ ...shot, label: product.name }] : [];
});

function HeroScreenshots() {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(true);
  const count = heroSlides.length;
  const current = heroSlides[active];

  const goTo = (index) => {
    if (index === active) return;
    setEntered(false);
    requestAnimationFrame(() => {
      setActive(index);
      requestAnimationFrame(() => setEntered(true));
    });
  };

  const next = () => goTo((active + 1) % count);
  const previous = () => goTo((active - 1 + count) % count);

  return (
    <div className="relative mx-auto flex min-h-[460px] w-full max-w-[640px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-6 py-8 shadow-soft">
      <div className="absolute left-8 top-8 hidden rotate-[-8deg] opacity-60 md:block">
        <ScreenshotCard shot={heroSlides[(active + 1) % count]} />
      </div>
      <div className={`relative z-10 hero-fade ${entered ? "" : "is-leaving"}`}>
        <ScreenshotCard shot={current} featured />
      </div>
      <div className="absolute bottom-8 right-8 hidden rotate-[8deg] opacity-60 md:block">
        <ScreenshotCard shot={heroSlides[(active + 2) % count]} />
      </div>
      <button type="button" onClick={previous} className="absolute left-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-soft transition hover:bg-ocean hover:text-white" aria-label="Application précédente">
        <ChevronLeft size={22} />
      </button>
      <button type="button" onClick={next} className="absolute right-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-soft transition hover:bg-ocean hover:text-white" aria-label="Application suivante">
        <ChevronRight size={22} />
      </button>
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/90 px-3 py-2 shadow-soft backdrop-blur">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Voir ${slide.label}`}
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
    <section id="accueil" ref={ref} className="relative isolate overflow-hidden">
      <div className="ambient-blob absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_18%,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(14,165,233,0.12),transparent_26%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <p
            className={`reveal inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-ocean ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "0ms" }}
          >
            <BadgeCheck size={16} /> {products.length} logiciels professionnels
          </p>
          <h1
            className={`reveal mt-4 text-4xl font-black leading-[1.05] text-ink sm:text-5xl xl:text-6xl ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "90ms" }}
          >
            Des solutions numériques pour faire grandir <span className="text-ocean">votre activité</span>
          </h1>
          <p
            className={`reveal mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700 ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "180ms" }}
          >
            Caisse, devis et factures, paie, fiscalité, immobilisations, stock, agriculture : SahelSoft développe des logiciels simples et accessibles pour gérer votre activité au quotidien.
          </p>
          <div
            className={`reveal mt-7 flex flex-col gap-3 sm:flex-row ${inView ? "is-visible" : ""}`}
            style={{ "--reveal-delay": "270ms" }}
          >
            <a href="#applications" className="inline-flex items-center justify-center gap-2 rounded-md bg-ocean px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[0.97]">
              Découvrir nos applications <ArrowRight size={19} />
            </a>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-4 font-black text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-mist active:scale-[0.97]">
              Nous contacter <MessageCircle size={19} />
            </a>
          </div>
          <div
            className={`reveal-group mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4 ${inView ? "is-visible" : ""}`}
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

const iconSizes = {
  sm: ["h-6 w-6 rounded-md", 14],
  md: ["h-12 w-12 rounded-xl shadow-soft", 24],
  lg: ["h-14 w-14 rounded-2xl shadow-soft", 28],
};

function ProductIcon({ product, size = "md" }) {
  const [box, glyph] = iconSizes[size];
  if (product.icon) {
    return <img src={product.icon} alt="" className={`${box} shrink-0 bg-white object-cover ring-1 ring-slate-200`} loading="lazy" decoding="async" />;
  }
  const [Icon, colour] = fallbackIcons[product.id] || [Package, "bg-ocean"];
  return (
    <span className={`${box} ${colour} flex shrink-0 items-center justify-center text-white`}>
      <Icon size={glyph} />
    </span>
  );
}

function StatusBadge({ product }) {
  const tone = {
    available: "bg-green-50 text-field ring-green-100",
    soon: "bg-blue-50 text-ocean ring-blue-100",
    dev: "bg-slate-100 text-slate-600 ring-slate-200",
  }[product.status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ring-1 ${tone}`}>{product.statusLabel}</span>;
}

function PlatformChips({ product }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.platforms.map((platform) => {
        const Icon = platformIcons[platform] || Monitor;
        return (
          <span key={platform} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">
            <Icon size={12} /> {platform}
          </span>
        );
      })}
    </div>
  );
}

// Every link is optional in config.json: a button only appears once its URL is filled in.
function ProductLinks({ product }) {
  const { links } = product;
  const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 active:scale-[0.97]";
  const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-mist hover:text-ocean";
  const hasDownload = links.playStore || links.windows || links.web || links.buy;

  return (
    <div className="flex flex-wrap gap-3">
      {links.web ? (
        <a href={links.web} target="_blank" rel="noopener noreferrer" className={`${primary} bg-ocean hover:bg-blue-700`}>
          <Globe size={17} /> Ouvrir l'application
        </a>
      ) : null}
      {links.playStore ? (
        <a href={links.playStore} target="_blank" rel="noopener noreferrer" className={`${primary} bg-field hover:bg-emerald-700`}>
          <Smartphone size={17} /> Google Play
        </a>
      ) : null}
      {links.windows ? (
        <a href={links.windows} target="_blank" rel="noopener noreferrer" className={`${primary} bg-ink hover:bg-slate-800`}>
          <Monitor size={17} /> Version Windows
        </a>
      ) : null}
      {links.buy ? (
        <a href={links.buy} target="_blank" rel="noopener noreferrer" className={links.web ? secondary : `${primary} bg-ocean hover:bg-blue-700`}>
          <ShoppingCart size={17} /> Acheter une licence
        </a>
      ) : null}
      {product.detailPage ? (
        <a href={product.detailPage} className={secondary}>
          Page détaillée <ArrowRight size={16} />
        </a>
      ) : null}
      {product.status === "available" ? (
        hasDownload ? null : (
          <a href={whatsappUrl(`Bonjour SahelSoft, je souhaite obtenir ${product.name}.`)} className={`${primary} bg-field hover:bg-emerald-700`}>
            <MessageCircle size={17} /> Obtenir {product.name}
          </a>
        )
      ) : (
        <a href={whatsappUrl(`Bonjour SahelSoft, je souhaite être prévenu de la sortie de ${product.name}.`)} className={`${primary} bg-field hover:bg-emerald-700`}>
          <MessageCircle size={17} /> Être prévenu de la sortie
        </a>
      )}
    </div>
  );
}

function Applications({ onShow }) {
  const [ref, inView] = useReveal(0.05);

  return (
    <section id="applications" className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Nos applications" title="Un logiciel pour chaque besoin" text="Choisissez une application pour voir ses écrans, ses fonctionnalités et comment l'obtenir." />
        <div ref={ref} className={`reveal-group grid gap-10 ${inView ? "is-visible" : ""}`}>
          {categories.map((category, categoryIndex) => {
            const items = products.filter((product) => product.category === category.id);
            return (
              <div key={category.id} className="reveal" style={{ "--reveal-delay": `${categoryIndex * 90}ms` }}>
                <div className="mb-4 flex flex-col gap-1 border-b border-slate-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
                  <h3 className="text-xl font-black text-ink">{category.label}</h3>
                  <p className="text-sm font-semibold text-slate-500">{category.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((product) => {
                    const hasShots = product.screenshots.length > 0;
                    return (
                      <SpotlightCard key={product.id} as="article" className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-premium">
                        <div className="flex items-start gap-4">
                          <ProductIcon product={product} />
                          <div className="min-w-0">
                            <h4 className="text-lg font-black text-ink">{product.name}</h4>
                            <p className="text-sm font-semibold leading-5 text-slate-500">{product.tagline}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <StatusBadge product={product} />
                          <PlatformChips product={product} />
                        </div>
                        <div className="mt-auto pt-5">
                          {hasShots ? (
                            <button type="button" onClick={() => onShow(product.id)} className="flex w-full min-h-11 items-center justify-center gap-2 rounded-md bg-mist px-4 py-3 text-sm font-black text-ink transition hover:bg-ocean hover:text-white">
                              <Images size={16} /> Voir l'application
                            </button>
                          ) : (
                            <a href={whatsappUrl(`Bonjour SahelSoft, je souhaite être prévenu de la sortie de ${product.name}.`)} className="flex w-full min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-black text-ink transition hover:bg-mist hover:text-ocean">
                              <MessageCircle size={16} /> Être prévenu de la sortie
                            </a>
                          )}
                        </div>
                      </SpotlightCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ shot, className = "" }) {
  return (
    <div className={`rounded-[1.6rem] bg-ink p-1.5 shadow-premium ring-1 ring-black/5 sm:rounded-[2rem] sm:p-2 ${className}`}>
      <img key={shot.src} src={shot.src} alt={shot.alt} className="showcase-fade h-auto w-full rounded-[1.2rem] bg-white sm:rounded-[1.6rem]" decoding="async" />
    </div>
  );
}

// PC apps show their desktop screen with the phone version standing in front of it,
// so visitors see at a glance that the same software also runs on a phone.
function ScreenshotViewer({ product }) {
  const [active, setActive] = useState(0);
  const phones = product.phoneShots || [];
  const isPhone = product.device === "phone";
  const count = Math.max(product.screenshots.length, phones.length);
  const shot = product.screenshots[Math.min(active, product.screenshots.length - 1)];
  const phone = phones.length ? phones[active % phones.length] : null;
  // Tabs follow whichever set has more screens (Sahel Caisse: one PC screen, three phone screens).
  const tabLabel = (index) => (phones.length > product.screenshots.length ? phones[index] : product.screenshots[index]).label;

  return (
    <div className="flex w-full flex-col items-center">
      {isPhone ? (
        <PhoneFrame shot={shot} className="w-[250px] sm:w-[280px]" />
      ) : (
        <div className={`relative w-full ${phone ? "pb-10 pr-6 sm:pb-12 sm:pr-10" : ""}`}>
          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-premium">
            <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
              <span className="ml-3 truncate rounded bg-white px-3 py-0.5 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-200">{product.links.web ? product.links.web.replace("https://", "") : product.name}</span>
            </div>
            <img key={shot.src} src={shot.src} alt={shot.alt} className="showcase-fade h-auto w-full bg-white" decoding="async" />
          </div>
          {phone ? (
            <div className="absolute bottom-0 right-0 flex w-[27%] min-w-[92px] max-w-[170px] flex-col items-center">
              <span className="mb-2 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-field shadow-soft ring-1 ring-green-100 sm:text-xs">
                <Smartphone size={12} /> Aussi sur mobile
              </span>
              <PhoneFrame shot={phone} className="w-full" />
            </div>
          ) : null}
        </div>
      )}
      {count > 1 ? (
        <div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1" role="tablist" aria-label={`Écrans de ${product.name}`}>
          {Array.from({ length: count }, (_, index) => (
            <button
              key={tabLabel(index)}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-black transition ${index === active ? "bg-ink text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-ocean"}`}
            >
              {tabLabel(index)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Showcase({ activeId, onSelect }) {
  const showcased = products.filter((product) => product.screenshots.length);
  const product = showcased.find((item) => item.id === activeId) || showcased[0];

  return (
    <section id="apercus" className="section-band scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="En images" title="Découvrez nos applications de l'intérieur" text="De vraies captures des applications, remplies avec des données d'exemple." />
        <div className="-mx-4 mb-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:overflow-visible">
          <div className="mx-auto flex w-max gap-2 rounded-2xl bg-white p-2 shadow-soft ring-1 ring-slate-200 lg:w-fit lg:max-w-5xl lg:flex-wrap lg:justify-center" role="tablist" aria-label="Choisir une application">
            {showcased.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === product.id}
                onClick={() => onSelect(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${item.id === product.id ? "bg-ocean text-white shadow-soft" : "text-ink hover:bg-mist"}`}
              >
                <ProductIcon product={item} size="sm" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div key={product.id} className="showcase-fade grid items-center gap-10 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-4">
              <ProductIcon product={product} size="lg" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-ocean">{categories.find((category) => category.id === product.category)?.label}</p>
                <h3 className="text-3xl font-black text-ink">{product.name}</h3>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge product={product} />
              <PlatformChips product={product} />
            </div>
            <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-field" size={16} /> {feature}
                </li>
              ))}
            </ul>
            {product.price ? (
              <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg bg-mist px-4 py-3">
                <span className="text-sm font-bold text-slate-600">{product.status === "available" ? "Prix de la licence" : "Prix prévu"}</span>
                <span className="text-2xl font-black text-ocean">{product.price}</span>
                <span className="text-xs font-semibold text-slate-500">paiement unique, sans abonnement</span>
              </p>
            ) : null}
            <div className="mt-6">
              <ProductLinks product={product} />
            </div>
          </div>
          <ScreenshotViewer key={product.id} product={product} />
        </div>
      </div>
    </section>
  );
}

const commitmentIcons = {
  terrain: Smartphone,
  conformite: Landmark,
  donnees: ShieldCheck,
  support: Headphones,
};

function About() {
  const [ref, inView] = useReveal(0.1);
  const platforms = [...new Set(products.flatMap((product) => product.platforms.filter((p) => ["Android", "Windows", "Web"].includes(p))))];
  const facts = [
    [String(products.length), "logiciels professionnels"],
    [String(platforms.length), `plateformes : ${platforms.join(", ")}`],
    ["FCFA", "prix en monnaie locale, paiement Mobile Money"],
    ["Bamako", "Mali, siège de SahelSoft"],
  ];

  return (
    <section id="apropos" className="scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8">
      <div ref={ref} className={`reveal-group mx-auto max-w-7xl ${inView ? "is-visible" : ""}`}>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="reveal">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean">À propos de SahelSoft</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">{about.title}</h2>
            <p className="mt-5 leading-8 text-slate-600">{about.intro}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-ocean bg-white/85 p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">Notre mission</p>
                <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{about.mission}</p>
              </div>
              <div className="rounded-xl border-l-4 border-field bg-white/85 p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-field">Notre vision</p>
                <p className="mt-2 text-sm font-semibold leading-7 text-slate-700">{about.vision}</p>
              </div>
            </div>
          </div>
          <div className="reveal grid gap-4 sm:grid-cols-2" style={{ "--reveal-delay": "120ms" }}>
            {about.commitments.map((item) => {
              const Icon = commitmentIcons[item.icon] || BadgeCheck;
              return (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-ocean">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 font-black text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
        <dl className="reveal mt-10 grid gap-px overflow-hidden rounded-2xl bg-slate-200 sm:grid-cols-2 lg:grid-cols-4" style={{ "--reveal-delay": "200ms" }}>
          {facts.map(([value, label]) => (
            <div key={label} className="bg-ink px-6 py-5 text-white">
              <dt className="text-2xl font-black">{value}</dt>
              <dd className="mt-1 text-sm font-semibold text-white/70">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-band px-4 py-14 sm:px-6 lg:px-8">
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
          <h3 className="text-2xl font-black text-ink">Comment obtenir un logiciel</h3>
          <ol className="mt-5 grid gap-4">
            {purchaseSteps.map(([title, text], index) => (
              <li key={title} className="flex items-start gap-4 rounded-md border border-slate-200 bg-slate-50 p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</span>
                <div>
                  <p className="font-black text-ink">{title}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ol>
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

function Footer({ onShow }) {
  const legalLinks = [
    ["Confidentialité", "/privacy.html"],
    ["Suppression de compte", "/delete-account.html"],
    ["Conditions d'utilisation", "/terms.html"],
  ];
  const openProduct = (event, id) => {
    event.preventDefault();
    onShow(id);
  };

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_10%_100%,rgba(22,163,74,0.2),transparent_40%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_2fr] lg:px-8">
        <div>
          {/* Footer variant of the logo: navy parts turned white so it reads on the dark background, brand blue kept. */}
          <img src={brand.footerLogo} alt="SahelSoft" width="240" height="64" className="h-14 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">{brand.slogan}</p>
          <ul className="mt-6 grid gap-3 text-sm font-semibold text-white/80">
            <li>
              <a href={whatsappUrl()} className="inline-flex items-center gap-3 hover:text-white">
                <MessageCircle size={17} className="text-field" /> {contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 hover:text-white">
                <Mail size={17} className="text-sky-300" /> {contact.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-3">
              <Globe size={17} className="text-sky-300" /> Bamako, Mali
            </li>
          </ul>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id}>
              <h3 className="text-xs font-black uppercase tracking-[0.14em] text-white/55">{category.label}</h3>
              <ul className="mt-4 grid gap-2.5">
                {products
                  .filter((product) => product.category === category.id)
                  .map((product) => (
                    <li key={product.id}>
                      <a href="#apercus" onClick={(event) => openProduct(event, product.id)} className="text-sm font-semibold text-white/85 transition hover:text-white">
                        {product.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Extra bottom/right padding keeps the links clear of the floating WhatsApp button. */}
      <div className="relative border-t border-white/10 px-4 pb-24 pt-5 sm:px-6 md:pb-6 md:pr-44 lg:px-8 lg:pr-48">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-semibold text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 SahelSoft. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
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
    <a href={whatsappUrl()} className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center gap-2 rounded-full bg-field p-4 sm:rounded-md sm:px-5 font-black text-white shadow-premium transition hover:-translate-y-0.5 hover:bg-emerald-700" aria-label="Contacter SahelSoft sur WhatsApp">
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
  const [showcaseId, setShowcaseId] = useState(null);

  // "Voir l'application" on a card opens that product's tab in the showcase and scrolls to it.
  const showProduct = (id) => {
    setShowcaseId(id);
    document.getElementById("apercus")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <a href="#accueil" className="skip-link">Aller au contenu</a>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Applications onShow={showProduct} />
        <Showcase activeId={showcaseId} onSelect={setShowcaseId} />
        <About />
        <Contact />
      </main>
      <Footer onShow={showProduct} />
      <FloatingWhatsApp />
    </>
  );
}

export default App;
