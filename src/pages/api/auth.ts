/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextApiRequest, NextApiResponse } from "next";
// import {} from "../../utils/appwriteConfig";
import { env } from "../../env.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // You could get email and password here
    const { email, password } = req.body;

    // TODO: Forward location headers
    const request = await fetch(env.APPWRITE_ENDPOINT + "/account/sessions/email", {
      method: "POST",
      headers: {
        "x-appwrite-project": env.APPWRITE_PROJECT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const response = await request.json();

  
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const newHostname = env.APP_HOSTNAME == "localhost" ? env.APP_HOSTNAME : "." + env.APP_HOSTNAME;

    const cookie = (request.headers.get("set-cookie") ?? "")
      .split("." + env.APPWRITE_HOSTNAME)
      .join(newHostname);

    // console.log(cookie, "===========cooookie");

    res.setHeader("set-cookie", cookie);

    res.status(200).json({
      ...response,
    });
  } else {
    return "ishan";
  }
}
