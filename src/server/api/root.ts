import { createTRPCRouter } from "./trpc";
import { appwriteRouter } from "./routers/appwrite";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  appwrite: appwriteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
