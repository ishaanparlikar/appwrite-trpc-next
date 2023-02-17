/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { GetServerSideProps } from "next";
import { appRouter } from "../server/api/root";
import { getBaseUrl } from "../utils/api";
import { isAuthenticated, redirect } from "../utils/server";

export default function Home() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (await isAuthenticated(ctx)) {
    return redirect("dashboard");
  }

  return redirect("login");
};
