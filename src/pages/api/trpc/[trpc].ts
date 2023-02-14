import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { NextApiRequest, NextApiResponse } from "next";

// export API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }
  // pass the (modified) req/res to the handler
  return nextApiHandler(req, res);
}
