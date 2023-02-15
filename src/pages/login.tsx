import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import type { CSSProperties } from "react";
import { useState } from "react";
import { api } from "../utils/api";
import { isAuthenticated, redirect } from "../utils/server";

const Login = () => {
  const router = useRouter();
  const login = api.appwrite.login.useMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // let tRPC handle the error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      const res = await login.mutateAsync(data as any);
      if (res.isLoggedIn) {
        await router.push("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="form u-width-full-line u-max-width-500 u-margin-inline-auto"
      onSubmit={handleSubmit}
    >
      <ul className="form-list">
        <li className="form-item">
          <label className="label">Email</label>
          <div className="input-text-wrapper">
            <input
              name="email"
              type="text"
              className="input-text"
              placeholder="john.doe@appwrite.io"
            />
          </div>
        </li>
        <li className="form-item">
          <label className="label">Password</label>
          <div
            className="input-text-wrapper"
            style={{ "--amount-of-buttons": 1 } as CSSProperties}
          >
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="input-text"
              placeholder="SuperSecretPassword"
            />

            <button
              className="show-password-button"
              aria-label="show password"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <span className="icon-eye" aria-hidden="true"></span>
            </button>
          </div>
        </li>
        <li className="form-item">
          <div className="u-flex u-main-end">
            <button className="button" type="submit" disabled={loading}>
              Login
            </button>
          </div>
        </li>
        {error && (
          <li className="form-item">
            <div className="u-flex u-main-center">
              <p className="u-bold u-color-text-danger">Login failed</p>
            </div>
          </li>
        )}
      </ul>
    </form>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (await isAuthenticated(ctx)) {
    return redirect("dashboard");
  }
  return { props: {} };
};
