import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import { AppwriteService } from "../../../utils/appwriteConfig";
import { env } from "../../../env.mjs";

import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
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

      console.log(request.status);
      
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const newHostname =
        env.APP_HOSTNAME == "localhost"
          ? env.APP_HOSTNAME
          : "." + env.APP_HOSTNAME;

      const cookie = (request.headers.get("set-cookie") ?? "")
        .split("." + env.APPWRITE_HOSTNAME)
        .join(newHostname);
      ctx.res.setHeader("set-cookie", cookie);
      // console.log(cookie, "===========cooookie from trpc");
      return {
        response:response,
        isLoggedIn: request.status == 201 ? true : false
      }
    }),

  getAccount: privateProcedure.query(({ ctx }) => {
    return {
      account: ctx.account,
      isLoggedIn: ctx.loggedIn,
    };
  }),

  logoutUser: privateProcedure
    .mutation(async () => {
      const res = await AppwriteService.deleteSession('current')
      return res
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
        // console.error(err, "------------------------>err");
      }
      return db;
    }),
});
