/**
 * Reference style: Construction editorial — dark banner, editorial white space, gold transition detail.
 * Purpose: About page for the Noman Builds rebrand.
 */
import { Hammer, Lightbulb, ShieldCheck } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/SiteShell";

const aboutVisual = "/images/about-workshop.webp";

export default function About() {
  return (
    <SiteLayout>
      <PageHero variant="about" eyebrow="ABOUT N A METAL" title="Built for the brief, made practical." />
      <section className="shell split-section split-section--about">
        <div className="visual-panel"><img src={aboutVisual} alt="Metal fabrication professional preparing a precision steel component in a workshop" loading="lazy" decoding="async" /></div>
        <div className="prose-column">
          <p className="eyebrow">WELCOME TO N A METAL</p>
          <h2>Your event fabrication partner.</h2>
          <p>N A METAL brings fabrication, event structures, exhibitions, and activations together under one clear project approach. We turn ideas into practical, durable environments with real attention to detail.</p>
          <p>From a branded entry feature to a full event environment, we connect considered planning with capable craft so the experience is ready from workshop to site.</p>
        </div>
      </section>
      <section className="principles-section">
        <div className="shell">
          <p className="eyebrow eyebrow--gold">HOW WE WORK</p>
          <h2>Clear planning. Strong fabrication. Reliable delivery.</h2>
          <div className="principles-grid">
            <article><Lightbulb size={24} /><h3>Shape the brief</h3><p>We turn the event brief into a build-ready plan, from scope and material choices to the right fabrication approach.</p></article>
            <article><Hammer size={24} /><h3>Build the detail</h3><p>Practical fabrication thinking makes every finish, structure, and installation purposeful and ready for the event.</p></article>
            <article><ShieldCheck size={24} /><h3>Reliable delivery</h3><p>Clear organisation and on-site coordination keep fabrication and installation moving when it matters most.</p></article>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
