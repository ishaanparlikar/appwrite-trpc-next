import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { isAuthenticated, redirect } from "../utils/server";

const Dashboard = () => {
  const router = useRouter();
  const account = api.appwrite.getAccount.useQuery();
  const logout = api.appwrite.logoutUser.useMutation();

  function logOut() {
    logout.mutate();
    void router.push("/");
  }

  return (
    <>
      <h1 className="heading-level-3">Welcome {account.data?.account?.name}</h1>
      <button className="button u-margin-block-start-16" onClick={logOut}>
        logout
      </button>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!(await isAuthenticated(ctx))) {
    return redirect("login");
  }
  return { props: {} };
};
