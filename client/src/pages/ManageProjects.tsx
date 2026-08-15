/**
 * Reference style: Noman Builds management console — clear, utilitarian, and secure by default.
 * Purpose: Authenticated project upload, editing, publishing, and deletion workflow for the portfolio.
 */
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Check, ImagePlus, Pencil, Plus, ShieldAlert, Trash2, UploadCloud, X } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

type ProjectFormState = {
  title: string;
  category: string;
  location: string;
  completionYear: string;
  shortDescription: string;
  description: string;
  status: "draft" | "published";
  sortOrder: string;
};

const blankProject: ProjectFormState = {
  title: "", category: "", location: "", completionYear: "", shortDescription: "", description: "", status: "draft", sortOrder: "0",
};

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function fileIsUsable(file: File) {
  return file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024;
}

export default function ManageProjects() {
  const { user, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const isAdmin = user?.role === "admin";
  const { data: projects = [], isLoading } = trpc.projects.adminList.useQuery(undefined, { enabled: isAdmin });
  const [form, setForm] = useState<ProjectFormState>(blankProject);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { data: editingProject, isLoading: isLoadingImages } = trpc.projects.adminGet.useQuery({ projectId: editingId ?? 0 }, { enabled: Boolean(editingId && isAdmin) });

  const createProject = trpc.projects.create.useMutation();
  const updateProject = trpc.projects.update.useMutation();
  const uploadImage = trpc.projects.uploadImage.useMutation();
  const removeImage = trpc.projects.removeImage.useMutation();
  const removeProject = trpc.projects.remove.useMutation();
  const isMutating = createProject.isPending || updateProject.isPending || uploadImage.isPending || removeImage.isPending || removeProject.isPending || submitting;

  const orderedProjects = useMemo(() => [...projects].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()), [projects]);

  function changeField(key: keyof ProjectFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetEditor() {
    setEditingId(null);
    setForm(blankProject);
    setCoverFile(null);
    setGalleryFiles([]);
  }

  function startEdit(project: typeof projects[number]) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      location: project.location ?? "",
      completionYear: project.completionYear?.toString() ?? "",
      shortDescription: project.shortDescription ?? "",
      description: project.description ?? "",
      status: project.status,
      sortOrder: project.sortOrder.toString(),
    });
    setCoverFile(null);
    setGalleryFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && !fileIsUsable(file)) return toast.error("Choose an image smaller than 5 MB.");
    setCoverFile(file);
  }

  function selectGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.some((file) => !fileIsUsable(file))) return toast.error("Each gallery image must be an image smaller than 5 MB.");
    setGalleryFiles(files);
  }

  async function uploadSelectedImages(projectId: number) {
    const queued = [
      ...(coverFile ? [{ file: coverFile, isCover: true }] : []),
      ...galleryFiles.map((file) => ({ file, isCover: false })),
    ];
    for (let index = 0; index < queued.length; index += 1) {
      const item = queued[index];
      await uploadImage.mutateAsync({
        projectId,
        fileName: item.file.name,
        dataUrl: await toDataUrl(item.file),
        altText: form.title,
        isCover: item.isCover,
        sortOrder: index,
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.title.trim() || !form.category.trim()) return toast.error("Add a project title and category first.");
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      location: form.location.trim() || undefined,
      completionYear: form.completionYear ? Number(form.completionYear) : undefined,
      shortDescription: form.shortDescription.trim() || undefined,
      description: form.description.trim() || undefined,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
    } as const;
    try {
      const projectId = editingId ?? (await createProject.mutateAsync(payload)).projectId;
      if (editingId) await updateProject.mutateAsync({ projectId, patch: payload });
      await uploadSelectedImages(projectId);
      await utils.projects.adminList.invalidate();
      await utils.projects.listPublic.invalidate();
      toast.success(editingId ? "Project updated." : "Project created.");
      resetEditor();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The project could not be saved.");
    } finally {
      setSubmitting(false);
    }
  }

  async function togglePublish(project: typeof projects[number]) {
    try {
      await updateProject.mutateAsync({ projectId: project.id, patch: { status: project.status === "published" ? "draft" : "published" } });
      await utils.projects.adminList.invalidate();
      await utils.projects.listPublic.invalidate();
      toast.success(project.status === "published" ? "Project moved to draft." : "Project published.");
    } catch {
      toast.error("Project status could not be updated.");
    }
  }

  async function deleteProject(project: typeof projects[number]) {
    if (!window.confirm(`Delete “${project.title}”? This removes it from the portfolio.`)) return;
    try {
      await removeProject.mutateAsync({ projectId: project.id });
      await utils.projects.adminList.invalidate();
      await utils.projects.listPublic.invalidate();
      if (editingId === project.id) resetEditor();
      toast.success("Project deleted.");
    } catch {
      toast.error("Project could not be deleted.");
    }
  }

  async function deleteImage(imageId: number) {
    if (!editingId || !window.confirm("Remove this image from the project gallery?")) return;
    try {
      await removeImage.mutateAsync({ projectId: editingId, imageId });
      await utils.projects.adminGet.invalidate({ projectId: editingId });
      await utils.projects.adminList.invalidate();
      await utils.projects.listPublic.invalidate();
      toast.success("Project image removed.");
    } catch {
      toast.error("The image could not be removed.");
    }
  }

  return (
    <DashboardLayout>
      {authLoading ? <div className="manager-page"><div className="manager-empty">Loading project manager…</div></div> : !isAdmin ? <div className="manager-page"><div className="manager-forbidden"><ShieldAlert size={31} /><p className="eyebrow">ADMIN ACCESS REQUIRED</p><h1>This area is for site administrators.</h1><p>Your account is signed in, but it does not have permission to manage portfolio projects. Ask the site owner to grant administrator access.</p></div></div> : <div className="manager-page">
        <header className="manager-heading">
          <div><p className="eyebrow">N A METAL CMS</p><h1>Project manager</h1><p>Add recent work, upload project photography, then publish it to the public portfolio when ready.</p></div>
          <div className="manager-count"><strong>{projects.length}</strong><span>Total projects</span></div>
        </header>
        <section className="manager-editor">
          <div className="manager-editor__title"><div><p className="eyebrow">{editingId ? "EDIT PROJECT" : "ADD A PROJECT"}</p><h2>{editingId ? "Refine project details" : "Create a new portfolio entry"}</h2></div>{editingId && <button type="button" className="manager-plain-button" onClick={resetEditor}><X size={16} /> Cancel edit</button>}</div>
          <form onSubmit={handleSubmit} className="manager-form">
            <label><span>Project title *</span><input value={form.title} onChange={(event) => changeField("title", event.target.value)} placeholder="e.g. Palm Residence Renovation" required /></label>
            <label><span>Category *</span><input value={form.category} onChange={(event) => changeField("category", event.target.value)} placeholder="e.g. Event Fabrication" required /></label>
            <label><span>Location</span><input value={form.location} onChange={(event) => changeField("location", event.target.value)} placeholder="Area, city, or site name" /></label>
            <label><span>Completion year</span><input value={form.completionYear} onChange={(event) => changeField("completionYear", event.target.value)} inputMode="numeric" placeholder="2026" /></label>
            <label className="manager-form__wide"><span>Short description</span><input value={form.shortDescription} onChange={(event) => changeField("shortDescription", event.target.value)} placeholder="One clear line for the project card." /></label>
            <label className="manager-form__wide"><span>Project story</span><textarea rows={4} value={form.description} onChange={(event) => changeField("description", event.target.value)} placeholder="What was built, renovated, or fabricated?" /></label>
            <label><span>Portfolio status</span><select value={form.status} onChange={(event) => changeField("status", event.target.value)}><option value="draft">Draft — only visible here</option><option value="published">Published — visible on the website</option></select></label>
            <label><span>Display order</span><input value={form.sortOrder} onChange={(event) => changeField("sortOrder", event.target.value)} inputMode="numeric" placeholder="0" /></label>
            <label className="manager-upload"><span>Cover image</span><span><ImagePlus size={18} />{coverFile ? coverFile.name : "Choose one cover image"}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectCover} /></label>
            <label className="manager-upload"><span>Gallery images</span><span><UploadCloud size={18} />{galleryFiles.length ? `${galleryFiles.length} image${galleryFiles.length > 1 ? "s" : ""} selected` : "Choose additional images"}</span><input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={selectGallery} /></label>
            {editingId && <div className="manager-form__wide manager-existing-images"><div><p className="eyebrow">CURRENT PHOTOS</p><p>{isLoadingImages ? "Loading gallery…" : "Choose a new cover above to replace the current one. Remove photos you no longer need."}</p></div><div className="manager-existing-images__grid">{editingProject?.images.map((image) => <figure key={image.id}><img src={image.imageUrl} alt={image.altText || form.title} />{editingProject.project.coverImageUrl === image.imageUrl && <span>Cover</span>}<button type="button" onClick={() => deleteImage(image.id)} aria-label="Remove project image"><Trash2 size={15} /></button></figure>)}</div></div>}
            <div className="manager-form__wide manager-submit-row"><p>Images are stored securely and each file must be 5 MB or smaller.</p><button className="manager-primary-button" disabled={isMutating} type="submit">{isMutating ? "Saving…" : editingId ? "Save project" : "Create project"}<Plus size={17} /></button></div>
          </form>
        </section>
        <section className="manager-list-section"><div className="manager-list-section__title"><div><p className="eyebrow">YOUR PORTFOLIO</p><h2>Recent projects</h2></div><span>{isLoading ? "Loading…" : `${orderedProjects.length} entries`}</span></div>
          {isLoading ? <div className="manager-empty">Loading projects…</div> : orderedProjects.length === 0 ? <div className="manager-empty"><ImagePlus size={28} /><h3>Your portfolio is ready for its first project.</h3><p>Use the form above to add project details and upload photography.</p></div> : <div className="manager-project-grid">{orderedProjects.map((project) => <article key={project.id} className="manager-project-card"><div className="manager-project-card__image">{project.coverImageUrl ? <img src={project.coverImageUrl} alt={project.title} /> : <ImagePlus size={24} />}</div><div className="manager-project-card__body"><div><span className={`status-pill status-pill--${project.status}`}>{project.status}</span><h3>{project.title}</h3><p>{project.category}{project.location ? ` · ${project.location}` : ""}</p></div><div className="manager-card-actions"><button onClick={() => startEdit(project)} aria-label={`Edit ${project.title}`}><Pencil size={16} /></button><button onClick={() => togglePublish(project)} aria-label={`Toggle publication for ${project.title}`}><Check size={16} /></button><button className="danger" onClick={() => deleteProject(project)} aria-label={`Delete ${project.title}`}><Trash2 size={16} /></button></div></div></article>)}</div>}
        </section>
      </div>}
    </DashboardLayout>
  );
}
