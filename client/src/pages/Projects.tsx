/**
 * Reference style: Fabrication editorial — a cinematic gallery with dark framing and gold category markers.
 * Purpose: N A METAL project gallery.
 */
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteLayout } from "@/components/SiteShell";
import { trpc } from "@/lib/trpc";

const projectHeroVisuals = {
  stage: "/images/hero-desktop.webp",
  arch: "/images/gala-entry.jpg",
  backdrop: "/images/exhibition.jpg",
} as const;

export default function Projects() {
  const [selected, setSelected] = useState("All");
  const { data: projects = [], isLoading } = trpc.projects.listPublic.useQuery();
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);
  const visibleProjects = useMemo(() => selected === "All" ? projects : projects.filter((project) => project.category === selected), [projects, selected]);
  return (
    <SiteLayout>
      <section className="projects-hero" aria-labelledby="projects-hero-title">
        <div className="shell projects-hero__inner">
          <div className="projects-hero__copy">
            <p className="eyebrow eyebrow--light">EVENT · EXHIBITION · ACTIVATION</p>
            <h1 id="projects-hero-title">Projects built to make an impact.</h1>
            <p>Event environments, entry structures, and exhibition installations created with practical fabrication detail.</p>
          </div>
          <div className="projects-hero__collage" aria-label="Selected event fabrication projects">
            <figure className="projects-hero__stage"><img src={projectHeroVisuals.stage} alt="Illuminated outdoor metal installation in a Dubai event environment" /><figcaption>Event environments</figcaption></figure>
            <figure className="projects-hero__arch"><img src={projectHeroVisuals.arch} alt="Gold fabricated event entry structure" /><figcaption>Entry structures</figcaption></figure>
            <figure className="projects-hero__backdrop"><img src={projectHeroVisuals.backdrop} alt="Custom exhibition installation with black and gold metal detailing" /><figcaption>Exhibition installations</figcaption></figure>
          </div>
        </div>
        <div className="gold-slice gold-slice--bottom" />
      </section>
      <section className="shell gallery-section gallery-section--projects">
        <div className="gallery-heading"><div><p className="eyebrow">SELECTED WORK</p><h2>Made with purpose.</h2></div><p>Your published N A METAL projects will appear here as you add them through the project manager.</p></div>
        {categories.length > 1 && <div className="filter-row" aria-label="Project categories">{categories.map((category) => <button key={category} onClick={() => setSelected(category)} className={selected === category ? "is-selected" : ""}>{category}</button>)}</div>}
        {isLoading ? <div className="portfolio-empty">Loading projects…</div> : visibleProjects.length === 0 ? <div className="portfolio-empty"><ImageOff size={28} /><h3>New work is being prepared.</h3><p>Check back soon to explore N A METAL fabrication, display, and installation work.</p></div> : <div className="project-grid">{visibleProjects.map((project, index) => <Link href={`/projects/${project.slug}`} className={`project-tile project-tile--${(index % 5) + 1}`} key={project.id}>{project.coverImageUrl ? <img src={project.coverImageUrl} alt={project.title} /> : <div className="project-tile__empty"><ImageOff size={27} /></div>}<div className="project-tile__overlay"><p>{project.category}</p><h3>{project.title}</h3><ArrowUpRight size={21} /></div></Link>)}</div>}
      </section>
    </SiteLayout>
  );
}
