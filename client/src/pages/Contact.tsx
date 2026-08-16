/**
 * Reference style: General Enquiry card — a centered rounded white message panel on an off-white field.
 * Purpose: Noman Builds contact and project enquiry page.
 */
import { ContactForm } from "@/components/ContactForm";
import { PageHero, SiteLayout } from "@/components/SiteShell";
import { useEffect, useRef, useState } from "react";

const contactVisual = "/images/contact-steel.webp";

export default function Contact() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = formCardRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsFormVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setIsFormVisible(true);
      observer.disconnect();
    }, { threshold: 0.18 });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <SiteLayout>
      <PageHero eyebrow="REQUEST A QUOTE" title="Let’s make your next event real." variant="contact" />
      <section className="general-enquiry-section"><div className="shell general-enquiry-layout"><aside className="contact-image-panel"><img src={contactVisual} alt="Dubai steel colonnade with an elegant bronze canopy" loading="lazy" decoding="async" /><div><p className="eyebrow eyebrow--light">N A METAL</p><span>Metal · Event · Exhibition</span></div></aside><div ref={formCardRef} className={`general-enquiry-card form-scroll-reveal${isFormVisible ? " is-revealed" : ""}`}><ContactForm /></div></div></section>
    </SiteLayout>
  );
}
