// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import supertokens from "supertokens-node";
import NextCors from "nextjs-cors";
import { middleware } from "supertokens-node/framework/express";
import { backendConfig } from "../../../config/backendConfig";

supertokens.init(backendConfig());

export default async function superTokens(req, res) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
//   await NextCors(req, res, {
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
//     origin: "https://supertoken-silk.vercel.app/",
//     credentials: true,
//     allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
//   });

  await superTokensNextWrapper(
    async (next) => {
      res.setHeader(
        "Cache-Control",
        "no-cache, no-store, max-age=0, must-revalidate"
      );
      await middleware()(req, res, next);
    },
    req,
    res
  );
  if (!res.writableEnded) {
    res.status(404).send("Not found");
  }
}
