import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db.js";
import { clearSessionCookie, setSessionCookie } from "./_core/cookies.js";
import { ADMIN_OPEN_ID, checkAdminCredentials, signSession } from "./_core/session.js";
import { systemRouter } from "./_core/systemRouter.js";
import { adminProcedure, publicProcedure, router } from "./_core/trpc.js";
import { cleanFilename, parseImageDataUrl, slugifyProjectTitle } from "./projectUtils.js";
import { storageDelete, storagePut } from "./storage.js";
import { contactMessageSchema } from "./contactUtils.js";

const projectInput = z.object({
  title: z.string().trim().min(3).max(180),
  category: z.string().trim().min(2).max(100),
  location: z.string().trim().max(180).optional(),
  completionYear: z.number().int().min(1900).max(2100).optional(),
  shortDescription: z.string().trim().max(320).optional(),
  description: z.string().trim().max(5000).optional(),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ username: z.string().min(1).max(180), password: z.string().min(1).max(180) }))
      .mutation(async ({ ctx, input }) => {
        if (!checkAdminCredentials(input.username, input.password)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
        }
        await db.upsertUser({ openId: ADMIN_OPEN_ID, name: "Admin", role: "admin", lastSignedIn: new Date() });
        const user = await db.getUserByOpenId(ADMIN_OPEN_ID);
        const token = await signSession(ADMIN_OPEN_ID);
        setSessionCookie(ctx.res, token);
        return user;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearSessionCookie(ctx.res);
      return {
        success: true,
      } as const;
    }),
  }),
  contact: router({
    submit: publicProcedure.input(contactMessageSchema).mutation(async ({ input }) => {
      const messageId = await db.createContactMessage({ ...input, subject: "General enquiry" });
      return { success: true, messageId };
    }),
  }),
  projects: router({
    listPublic: publicProcedure.query(() => db.listPublishedProjects()),
    getPublic: publicProcedure.input(z.object({ slug: z.string().min(1).max(220) })).query(async ({ input }) => {
      const result = await db.getPublishedProjectBySlug(input.slug);
      if (!result) throw new Error("Project not found");
      return result;
    }),
    adminList: adminProcedure.query(() => db.listProjectsForAdmin()),
    adminGet: adminProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ input }) => {
      const result = await db.getProjectForAdmin(input.projectId);
      if (!result) throw new Error("Project not found");
      return result;
    }),
    create: adminProcedure.input(projectInput).mutation(async ({ ctx, input }) => {
      const suffix = Date.now().toString(36);
      const projectId = await db.createProject({
        ...input,
        slug: `${slugifyProjectTitle(input.title)}-${suffix}`,
        location: input.location || null,
        completionYear: input.completionYear ?? null,
        shortDescription: input.shortDescription || null,
        description: input.description || null,
        createdBy: ctx.user.id,
      });
      return { projectId };
    }),
    update: adminProcedure.input(z.object({ projectId: z.number().int().positive(), patch: projectInput.partial() })).mutation(async ({ input }) => {
      await db.updateProject(input.projectId, input.patch);
      return { success: true };
    }),
    remove: adminProcedure.input(z.object({ projectId: z.number().int().positive() })).mutation(async ({ input }) => {
      const result = await db.getProjectForAdmin(input.projectId);
      await db.deleteProject(input.projectId);
      if (result) await Promise.all(result.images.map((image) => storageDelete(image.imageUrl)));
      return { success: true };
    }),
    uploadImage: adminProcedure.input(z.object({
      projectId: z.number().int().positive(),
      fileName: z.string().min(1).max(180),
      dataUrl: z.string().max(7_500_000),
      altText: z.string().trim().max(240).optional(),
      isCover: z.boolean().default(false),
      sortOrder: z.number().int().min(0).max(10000).default(0),
    })).mutation(async ({ input }) => {
      const { contentType, buffer } = parseImageDataUrl(input.dataUrl);
      if (buffer.byteLength > 5 * 1024 * 1024) throw new Error("Images must be 5 MB or smaller.");
      const project = await db.getProjectForAdmin(input.projectId);
      if (!project) throw new Error("Project not found");
      const fileName = cleanFilename(input.fileName);
      const stored = await storagePut(`projects/${input.projectId}/${fileName}`, buffer, contentType);
      const imageId = await db.createProjectImage({
        projectId: input.projectId,
        imageUrl: stored.url,
        storageKey: stored.key,
        altText: input.altText || null,
        sortOrder: input.sortOrder,
      });
      if (input.isCover) await db.updateProject(input.projectId, { coverImageUrl: stored.url, coverImageKey: stored.key });
      return { imageId, url: stored.url };
    }),
    removeImage: adminProcedure.input(z.object({ projectId: z.number().int().positive(), imageId: z.number().int().positive() })).mutation(async ({ input }) => {
      const result = await db.getProjectForAdmin(input.projectId);
      const image = result?.images.find((candidate) => candidate.id === input.imageId);
      if (!result || !image) throw new Error("Project image not found");
      await db.deleteProjectImage(input.imageId);
      await storageDelete(image.imageUrl);
      if (result.project.coverImageUrl === image.imageUrl) {
        await db.updateProject(input.projectId, { coverImageUrl: null, coverImageKey: null });
      }
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
