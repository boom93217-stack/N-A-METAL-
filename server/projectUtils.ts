/** Strips path separators and unsafe characters so a filename is safe to use as a storage key segment. */
export function cleanFilename(fileName: string): string {
  const base = fileName.split(/[/\\]/).pop() ?? fileName;
  const cleaned = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return cleaned.slice(0, 180) || "file";
}

/** Turns a project title into a URL-safe slug segment (the caller appends a uniqueness suffix). */
export function slugifyProjectTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.slice(0, 180) || "project";
}

const DATA_URL_PATTERN = /^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/;

/** Parses a `data:<mime>;base64,<data>` string produced by the admin upload form into raw bytes. */
export function parseImageDataUrl(dataUrl: string): { contentType: string; buffer: Buffer } {
  const match = DATA_URL_PATTERN.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid image data URL");
  }
  const [, contentType, base64] = match;
  if (!contentType.startsWith("image/")) {
    throw new Error("Only image uploads are supported");
  }
  return { contentType, buffer: Buffer.from(base64, "base64") };
}
