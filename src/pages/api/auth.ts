import type { NextApiRequest, NextApiResponse } from "next";

import { appRouter } from "../../server/api/root";
import { getBaseUrl } from "../../utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") throw new Error("Method not allowed");

  const caller = appRouter.createCaller({
    req,
    res,
  });

  try {
    // Let tRPC handle errors
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = await caller.appwrite.login(req.body);

    if (result.isLoggedIn) {
      res.status(200).redirect(`${getBaseUrl()}/dashboard`);
    } else {
      res.status(401).redirect(`${getBaseUrl()}/login`);
    }
  } catch {
    res.status(401).redirect("/login");
  }
}
