import { api } from "../../utils/api";

const Dashboard = () => {
  const logout = api.appwrite.logoutUser.useMutation();

  function logOut() {
    const res = logout.mutate();
      console.log(logout.data);
      
  }
  return (
    <>
      <div>Dashboard</div>
      <button onClick={logOut}>logout</button>
    </>
  );
};

export default Dashboard;
