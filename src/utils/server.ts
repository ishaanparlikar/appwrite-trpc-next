import { GetServerSidePropsContext } from "next";
import { appRouter } from "../server/api/root";
import { getBaseUrl } from "./api";

export async function isAuthenticated({ req, res }: GetServerSidePropsContext) {
  const caller = appRouter.createCaller({
    req: req as any,
    res: res as any,
  });

  try {
    const result = await caller.appwrite.getAccount();

    return result.isLoggedIn;
  } catch {
    return false;
  }
}

export function redirect(url: string) {
  return {
    redirect: {
      destination: `${getBaseUrl()}/${url}`,
      permanent: false,
    },
  };
}
