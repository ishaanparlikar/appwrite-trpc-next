import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AppwriteService } from "../../../utils/appwriteConfig";
import { env } from "../../../env.mjs";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  account: publicProcedure
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

      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const newHostname =
        env.APP_HOSTNAME == "localhost"
          ? env.APP_HOSTNAME
          : "." + env.APP_HOSTNAME;

      const cookie = (request.headers.get("set-cookie") ?? "")
        .split("." + env.APPWRITE_HOSTNAME)
        .join(newHostname);
      ctx.res.setHeader("set-cookie", cookie);
      console.log(cookie, "===========cooookie from trpc");
      return response;
    }),
  getAccount: publicProcedure.query(async ({ ctx }) => {
    const sessionNames = [
      "a_session_" + env.APPWRITE_PROJECT_ID.toLowerCase(),
      "a_session_" + env.APPWRITE_PROJECT_ID.toLowerCase() + "_legacy",
    ] as const;
    const hash =
      ctx.req.cookies[sessionNames[0]] ??
      ctx.req.cookies[sessionNames[1]] ??
      "";

    AppwriteService.setSession(hash);
    let account;
    try {
      account = await AppwriteService.getAccount();
      return account;
    } catch (err) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: '',
        cause:err
      });
    }
  }),

  getDatabase: publicProcedure
    .input(z.object({ db_id: z.string(), collectionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const hash = AppwriteService.getHash(ctx.req);
      AppwriteService.setSession(hash);
      let db;
      try {
        db = await AppwriteService.getDb(input.db_id, input.collectionId);
      } catch (err) {
        console.error(err, "------------------------>err");
      }
      return db;
    }),
});
