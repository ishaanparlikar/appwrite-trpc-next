import { z } from "zod";
import { env } from "../../../env.mjs";
import { AppwriteService } from "../../../utils/appwriteConfig";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

type AppwriteResponse = {
  message: string;
  code: number;
  type: string;
  version: string;
};

export function isAppwriteResponse(data: unknown): data is AppwriteResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    "code" in data &&
    "type" in data &&
    "version" in data
  );
}

export const appwriteRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const request = await fetch(
        env.APPWRITE_ENDPOINT + "/account/sessions/email",
        {
          method: "POST",
          headers: {
            "x-appwrite-project": env.APPWRITE_PROJECT_ID,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: input.email,
            password: input.password,
          }),
        }
      );

      const response: unknown = await request.json();

      const newHostname =
        env.APP_HOSTNAME == "localhost"
          ? env.APP_HOSTNAME
          : "." + env.APP_HOSTNAME;

      const cookie = (request.headers.get("set-cookie") ?? "")
        .split("." + env.APPWRITE_HOSTNAME)
        .join(newHostname);
      ctx.res.setHeader("set-cookie", cookie);

      return {
        response: response,
        isLoggedIn: request.status == 201 ? true : false,
      };
    }),

  getAccount: privateProcedure.query(({ ctx }) => {
    return {
      account: ctx.account,
      isLoggedIn: ctx.loggedIn,
    };
  }),

  logoutUser: privateProcedure.mutation(async () => {
    const res = await AppwriteService.deleteSession("current");
    return res;
  }),

  getDatabase: publicProcedure
    .input(z.object({ db_id: z.string(), collectionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const hash = AppwriteService.getHash(ctx.req);
      AppwriteService.setSession(hash);
      let db;
      try {
        db = await AppwriteService.getDb(input.db_id, input.collectionId);
      } catch (err) {}
      return db;
    }),
});
