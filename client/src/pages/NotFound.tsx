import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { SiteLayout } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="project-detail-loading">
        <h1>Page not found.</h1>
        <Link href="/" className="text-button">
          Back to home <ArrowLeft size={16} />
        </Link>
      </div>
    </SiteLayout>
  );
}
