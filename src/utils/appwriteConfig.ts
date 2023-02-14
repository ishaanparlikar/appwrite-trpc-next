import { Client, Account, ID, Databases } from "appwrite";
import type { NextApiRequest } from "next";
import { env } from "../env.mjs";

const client = new Client()
  .setEndpoint(env.APPWRITE_ENDPOINT)
  .setProject(env.APPWRITE_PROJECT_ID);

export const account = new Account(client);
const databases = new Databases(client);

export const AppwriteService = {
  setSession: (hash: string) => {
    const authCookies: { [key: string]: string } = {};
    authCookies["a_session_" + env.APPWRITE_PROJECT_ID] = hash;
    client.headers["X-Fallback-Cookies"] = JSON.stringify(authCookies);
    return authCookies
  },
  getAccount: async () => {
    return await account.get();
  },
  getDb: async (dbId: string, collectionId: string) => {
    return await databases.listDocuments(dbId, collectionId);
  },
  deleteSession: async (session_id?: string) => {
    return await account.deleteSession(session_id ? session_id : "current");
  },
  getHash: (req: NextApiRequest) => {
    const sessionNames = [
      "a_session_" + env.APPWRITE_PROJECT_ID.toLowerCase(),
      "a_session_" + env.APPWRITE_PROJECT_ID.toLowerCase() + "_legacy",
    ] as const;
    const hash =
      req.cookies[sessionNames[0]] ?? req.cookies[sessionNames[1]] ?? "";
    return hash;
  },
};
