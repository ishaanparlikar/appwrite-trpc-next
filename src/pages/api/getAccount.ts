import { account, APPWRITE_ENDPOINT, APPWRITE_HOSTNAME, APP_HOSTNAME } from "../../utils/appwriteConfig";

export default async function handler(req,res){
  const request = await fetch(APPWRITE_ENDPOINT + "/account",{
    method:'GET'
  })

  const response = await request.json()


  console.log(response);

  const newHostname = APP_HOSTNAME == "localhost" ? APP_HOSTNAME : "." + APP_HOSTNAME;

    const cookie = (request.headers.get("set-cookie") ?? "")
      .split("." + APPWRITE_HOSTNAME)
      .join(newHostname);

    console.log(cookie, "===========cooookie");

    res.setHeader("set-cookie", cookie);

    res.status(200).json({
      ...response,
    });
  

}