import type { NextApiRequest, NextApiResponse } from "next";

import { appRouter } from "../../server/api/root";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") throw new Error("Method not allowed");

  const caller = appRouter.createCaller({
    req,
    res,
  });

  await caller.appwrite.logoutUser();
  res.status(200).redirect("/login");
}
