/**
 * Reference style: Fabrication editorial — cinematic workshop imagery, spacious service list, and project gallery.
 * Purpose: Home page for the Noman Builds rebrand.
 */
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { SiteLayout } from "@/components/SiteShell";
import { trpc } from "@/lib/trpc";

const heroPremium = "/images/hero-desktop.webp";
const heroPremiumMobile = "/images/hero-mobile.webp";
const gala = "/images/gala-entry.jpg";
const exhibition = "/images/exhibition.jpg";
const workshop = "/images/workshop.jpg";

const serviceList = ["Metal Fabrication", "Event Fabrication", "Exhibition Stands", "Brand Activations", "Stages & Backdrops", "Retail & Mall Displays", "Interior & Architectural Fit-Outs", "Custom Props & Installation"];

export default function Home() {
  const { data: projectPreview = [] } = trpc.projects.listPublic.useQuery();
  return (
    <SiteLayout>
      <section className="home-hero">
        <picture className="home-hero__media" aria-hidden="true">
          <source media="(max-width: 620px)" srcSet={heroPremiumMobile} />
          <img src={heroPremium} width="1600" height="900" fetchPriority="high" loading="eager" decoding="async" alt="" />
        </picture>
        <div className="home-hero__shade" />
        <div className="shell home-hero__content"><p className="eyebrow eyebrow--light">METAL FABRICATION · EVENT &amp; EXHIBITION · ARCHITECTURAL SOLUTIONS</p><h1>N A<br />METAL</h1><p>Event and exhibition fabrication, custom metalwork, display environments, and architectural installations. Built with intention.</p></div>
      </section>
      <section className="shell services-overview"><div className="section-heading"><p className="eyebrow">OUR SERVICES</p><h2>Plan with precision.<br />Build to perform.</h2></div><div className="service-lines">{serviceList.map((service, index) => <Link href="/services" key={service}><span>0{index + 1}</span>{service}<ArrowUpRight size={20} /></Link>)}</div></section>
      <section className="shell work-preview"><div className="section-heading section-heading--split"><div><p className="eyebrow">RECENT WORK</p><h2>Built for the brief.<br />Delivered for the long term.</h2></div><Link href="/projects" className="text-button">View all projects <ArrowRight size={16} /></Link></div>{projectPreview.length > 0 ? <div className="preview-grid">{projectPreview.slice(0, 4).map((project, index) => <Link href={`/projects/${project.slug}`} className={`preview-tile preview-tile--${index === 0 ? "wide" : index === 1 ? "tall" : "standard"}`} key={project.id}>{project.coverImageUrl ? <img src={project.coverImageUrl} alt={project.title} /> : <div className="preview-tile__empty" />}<span>{project.title}<ArrowUpRight size={18} /></span></Link>)}</div> : <div className="home-portfolio-empty">Your recent N A METAL projects will appear here once published.</div>}</section>
      <section className="home-statement"><div className="shell"><p className="eyebrow eyebrow--gold">N A METAL</p><h2>We Build What You Imagine.</h2><p>Every strong project rests on capable craftsmanship, disciplined material choices and a clear plan of action. That’s how we work.</p><Link href="/about" className="text-button text-button--light">Meet N A METAL <ArrowRight size={16} /></Link></div></section>
    </SiteLayout>
  );
}
