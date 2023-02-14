import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useRouter } from "next/router";

const Login = () => {
  const loginAccount = api.appwrite.login.useMutation();
  const { data } = api.appwrite.getAccount.useQuery();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  function login() {
    try {
      const res = loginAccount.mutate({ email: email, password: password });
      return res;
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <>
      {!loginAccount.isLoading ? (
        <>
          <input
            type="text"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>login</button>
        </>
      ) : (
        <h1>Loading Login</h1>
      )}
    </>
  );
};

export default Login;
