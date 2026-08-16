/**
 * Reference style: Construction editorial — immersive dark project detail with practical build metadata.
 * Purpose: Public portfolio detail page for a published Noman Builds project.
 */
import { ArrowLeft, MapPin } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { SiteLayout } from "@/components/SiteShell";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug ?? "";
  const { data, isLoading, isError } = trpc.projects.getPublic.useQuery({ slug }, { enabled: Boolean(slug) });
  if (isLoading) return <SiteLayout><div className="project-detail-loading">Loading project…</div></SiteLayout>;
  if (isError || !data) return <SiteLayout><div className="project-detail-loading"><h1>Project not found.</h1><Link href="/projects" className="text-button">Back to projects <ArrowLeft size={16} /></Link></div></SiteLayout>;
  const { project, images } = data;
  const visualImages = [project.coverImageUrl, ...images.filter((image) => image.imageUrl !== project.coverImageUrl).map((image) => image.imageUrl)].filter(Boolean) as string[];
  return <SiteLayout><article className="project-detail"><section className="project-detail__hero" style={project.coverImageUrl ? { backgroundImage: `linear-gradient(90deg, rgba(9,10,12,.88), rgba(9,10,12,.35)), url(${project.coverImageUrl})` } : undefined}><div className="shell"><Link href="/projects" className="project-back"><ArrowLeft size={16} /> All projects</Link><p className="eyebrow eyebrow--gold">{project.category}</p><h1>{project.title}</h1>{project.shortDescription && <p>{project.shortDescription}</p>}<div className="project-detail__meta">{project.location && <span><MapPin size={15} />{project.location}</span>}{project.completionYear && <span>{project.completionYear}</span>}</div></div></section><section className="shell project-detail__copy"><div><p className="eyebrow">PROJECT OVERVIEW</p><h2>Fabricated for the brief. Built to perform.</h2></div><p>{project.description || "More detail about this project will be shared soon."}</p></section>{visualImages.length > 0 && <section className="shell project-detail__gallery">{visualImages.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${project.title} ${index + 1}`} loading="lazy" decoding="async" />)}</section>}</article></SiteLayout>;
}
