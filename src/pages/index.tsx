/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type NextPage } from "next";
import { api } from "../utils/api";
import Dashboard from "./dashboard";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Login from "./login";

const Home: NextPage = () => {
  const { error, isLoading, data } = api.appwrite.getAccount.useQuery();
  const router = useRouter();
  const getDb = api.appwrite.getDatabase.useQuery({
    db_id: "63e4ad61eeea8b2540fc",
    collectionId: "63e4ad6f7bb4e6430e03",
  });

  // if (isLoading) return <h1>Loading</h1>;
  
  if (error || !data?.isLoggedIn) return <Login />;
  return <Dashboard />;
};

export default Home;
