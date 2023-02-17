import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { isAuthenticated, redirect } from "../utils/server";

const Dashboard = () => {
  const account = api.appwrite.getAccount.useQuery();

  return (
    <form method="POST" action="/api/logout">
      <h1 className="heading-level-3">Welcome {account.data?.account?.name}</h1>
      <button className="button u-margin-block-start-16" type="submit">
        logout
      </button>
    </form>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!(await isAuthenticated(ctx))) {
    return redirect("login");
  }
  return { props: {} };
};
