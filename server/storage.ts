import { del, put } from "@vercel/blob";
import { ENV } from "./_core/env.js";

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

export async function storagePut(
  relKey: string,
  data: Buffer | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  if (!ENV.blobReadWriteToken) {
    throw new Error("Storage config missing: set BLOB_READ_WRITE_TOKEN");
  }

  const blob = await put(normalizeKey(relKey), data, {
    access: "public",
    contentType,
    token: ENV.blobReadWriteToken,
  });

  return { key: blob.pathname, url: blob.url };
}

export async function storageDelete(url: string): Promise<void> {
  if (!ENV.blobReadWriteToken) return;
  try {
    await del(url, { token: ENV.blobReadWriteToken });
  } catch (error) {
    console.warn("[Storage] Failed to delete blob:", error);
  }
}
