/**
 * Reference style: Fabrication editorial — large typographic service list and precise gold hover accents.
 * Purpose: Noman Builds metal, event, exhibition, and activation services page.
 */
import { ArrowUpRight, Boxes, Frame, Lightbulb, Sparkles, WandSparkles, Workflow, Wrench } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/SiteShell";

const fabricationVisual = "/images/services-fabrication.webp";

const serviceItems = [
  ["01", "Metal Fabrication", "Custom metalwork, frames, structures, finishes, and made-to-measure components built with precision.", Workflow],
  ["02", "Event Fabrication", "Practical event structures and immersive built elements that carry an idea from workshop to site.", Sparkles],
  ["03", "Exhibition Stands", "Distinct exhibition stand concepts, fabricated around visitor flow, brand presence, and clear impact.", WandSparkles],
  ["04", "Brand Activations", "Branded environments and interactive physical moments made to earn attention in high-footfall spaces.", Lightbulb],
  ["05", "Stages & Backdrops", "Stages, scenic backdrops, and supporting structures with strong material presence and considered detailing.", Wrench],
  ["06", "Retail & Mall Displays", "Retail displays, mall activations, and seasonal installations designed to be noticed and navigated.", Frame],
  ["07", "Event Environments", "Fabricated event environments, entry features, and guest-facing structures shaped around audience flow, atmosphere, and the brief.", Boxes],
  ["08", "Custom Props & Installation", "One-off props, display pieces, and large-format installations tailored to the exact brief and space.", Workflow],
] as const;

export default function Services() {
  return (
    <SiteLayout>
      <PageHero eyebrow="WHAT WE FABRICATE" title="Built environments made to be noticed." />
      <section className="shell service-intro">
        <div className="service-intro__copy">
          <p className="eyebrow">N A METAL SERVICES</p>
          <h2>End-to-end fabrication for events, exhibitions, activations, retail displays, and custom interiors.</h2>
        </div>
        <figure className="service-intro__visual">
          <img src={fabricationVisual} alt="Precision steel fabrication and welding in a professional workshop" loading="lazy" decoding="async" />
          <figcaption>Event &amp; Exhibition Fabrication</figcaption>
        </figure>
      </section>
      <section className="shell service-list">
        {serviceItems.map(([number, title, description, Icon]) => (
          <article key={number} className="service-row">
            <p className="service-number">{number}</p><Icon className="service-icon" size={24} />
            <div><h3>{title}</h3><p>{description}</p></div>
            <span className="service-row__arrow" aria-hidden="true"><ArrowUpRight size={24} /></span>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
