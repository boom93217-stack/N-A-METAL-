/**
 * Reference style: Fabrication editorial — charcoal, off-white, and Fabrication Gold.
 * Purpose: Shared navigation and footer for the streamlined Noman Builds website.
 */
import { Link, useLocation } from "wouter";
import { Facebook, Instagram, Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const LOGO_MARK = "/images/logo-mark.webp";
const LOGO_WORD = "/images/logo-wordmark.webp";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

function BrandMark({ inverted = false, footer = false, tagline = false }: { inverted?: boolean; footer?: boolean; tagline?: boolean }) {
  return (
    <Link href="/" className={`brand-mark ${inverted ? "brand-mark--inverted" : ""} ${footer ? "brand-mark--footer" : ""}`} aria-label="N A METAL home">
      <span className="brand-mark__lockup">
        <img className="brand-mark__icon" src={LOGO_MARK} alt="" aria-hidden="true" />
        <img className="brand-mark__word" src={LOGO_WORD} alt="N A METAL" />
      </span>
      {tagline && <span className="brand-mark__tagline" aria-hidden="true">WE BUILD WHAT YOU IMAGINE</span>}
    </Link>
  );
}

export function SiteHeader() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark inverted tagline={location === "/"} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={location === item.href ? "is-active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="mobile-menu-toggle" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-label="Toggle menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={location === item.href ? "is-active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function PageHero({ eyebrow, title, children, variant }: { eyebrow: string; title: string; children?: React.ReactNode; variant?: "about" | "contact" }) {
  return (
    <section className={`page-hero${variant ? ` page-hero--${variant}` : ""}`}>
      <div className="page-hero__backdrop" />
      <div className="shell page-hero__content">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </div>
      <div className="gold-slice gold-slice--bottom" />
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <BrandMark inverted footer tagline />
          <p>N A METAL delivers metal fabrication, event structures, display environments, and custom installations with practical craft and clear project focus.</p>
          <div className="social-links">
            <a href="https://www.facebook.com/p/Metal-Art-Dxb-100086534535300/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="https://www.instagram.com/metal_art_dxb/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
          </div>
        </div>
        <div>
          <p className="footer-label">QUICK MENU</p>
          <nav className="footer-nav">
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 N A METAL. All rights reserved.</span>
        <span>We Build What You Imagine</span>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return <a href="https://api.whatsapp.com/send?phone=+971582318648" target="_blank" rel="noreferrer" className="whatsapp-float" aria-label="Start a WhatsApp conversation"><FaWhatsapp className="whatsapp-brand-mark" aria-hidden="true" /></a>;
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
