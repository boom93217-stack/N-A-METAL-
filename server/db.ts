import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertContactMessage, InsertProject, InsertProjectImage, InsertUser, contactMessages, projectImages, projects, users } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/** Returns public projects in presentation order. */
export async function listPublishedProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.status, "published")).orderBy(asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getPublishedProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  const project = rows[0];
  if (!project || project.status !== "published") return undefined;
  const images = await db.select().from(projectImages).where(eq(projectImages.projectId, project.id)).orderBy(asc(projectImages.sortOrder), asc(projectImages.id));
  return { project, images };
}

export async function listProjectsForAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(desc(projects.updatedAt));
}

export async function getProjectForAdmin(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project) return undefined;
  const images = await db.select().from(projectImages).where(eq(projectImages.projectId, project.id)).orderBy(asc(projectImages.sortOrder), asc(projectImages.id));
  return { project, images };
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(projects).values(project);
  return Number(result[0].insertId);
}

export async function updateProject(projectId: number, patch: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(projects).set(patch).where(eq(projects.id, projectId));
}

export async function createProjectImage(image: InsertProjectImage) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(projectImages).values(image);
  return Number(result[0].insertId);
}

export async function deleteProjectImage(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.delete(projectImages).where(eq(projectImages.id, imageId));
}

export async function deleteProject(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.delete(projectImages).where(eq(projectImages.projectId, projectId));
  await db.delete(projects).where(eq(projects.id, projectId));
}

/** Stores a public contact-form submission for the site owner to review. */
export async function createContactMessage(message: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(contactMessages).values(message);
  return Number(result[0].insertId);
}
