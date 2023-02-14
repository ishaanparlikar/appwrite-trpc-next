import { type AppType } from "next/app";

import { api } from "../utils/api";
import "../styles/globals.css";



const MyApp: AppType = ({ Component, pageProps }) => {
  const { data, isLoading } = api.appwrite.getAccount.useQuery(); 
  return <Component {...pageProps} />;
  
};



export default api.withTRPC(MyApp);
