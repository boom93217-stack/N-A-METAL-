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
      <PageHero variant="about" eyebrow="ABOUT N A METAL" title="Thoughtful building, made practical." />
      <section className="shell split-section split-section--about">
        <div className="visual-panel"><img src={aboutVisual} alt="Metal fabrication professional preparing a precision steel component in a workshop" loading="lazy" decoding="async" /></div>
        <div className="prose-column">
          <p className="eyebrow">WELCOME TO N A METAL</p>
          <h2>Your construction partner for well-made spaces.</h2>
          <p>N A METAL brings construction, renovation, fabrication and fit-out work together under one clear project approach. We turn ideas into spaces that are practical, durable and made with real attention to detail.</p>
          <p>From a focused interior upgrade to a more complex new build, we connect considered planning with capable craft so the work remains grounded from start to finish.</p>
        </div>
      </section>
      <section className="principles-section">
        <div className="shell">
          <p className="eyebrow eyebrow--gold">HOW WE WORK</p>
          <h2>Blending planning, craft, and delivery.</h2>
          <div className="principles-grid">
            <article><Lightbulb size={24} /><h3>Build clarity</h3><p>We sharpen the brief into a build-ready plan, from early scope through to the right material choices.</p></article>
            <article><Hammer size={24} /><h3>Built detail</h3><p>Practical construction thinking makes every finish, structure, and installation purposeful and sound.</p></article>
            <article><ShieldCheck size={24} /><h3>Reliable delivery</h3><p>Clear organisation and on-site coordination keep the work moving when it matters most.</p></article>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
