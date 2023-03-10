import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../server/api/root";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const caller = appRouter.createCaller({
    req,
    res,
  });

  try {
    const result = await caller.appwrite.getAccount();
    return res.status(200).json(result);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
