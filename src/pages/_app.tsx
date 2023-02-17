import { type AppType } from "next/app";

import { api } from "../utils/api";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="container">
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
