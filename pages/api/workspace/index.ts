import randomWords from "random-words";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens, { deleteUser } from "supertokens-node";
import { backendConfig } from "../../../config/backendConfig";
import dbConnect from "../../../lib/dbConnect";
import Workspace from "../../../models/workspace";

supertokens.init(backendConfig());

export default async function handler(req: SessionRequest, res: any) {
  const { method } = req;

  try {
    await superTokensNextWrapper(
      async (next) => {
        await verifySession()(req, res, next);
      },
      req,
      res
    );
  } catch (error) {
    return res.status(401).json({ error });
  }

  dbConnect().then(async () => {
    const userId = req.session!.getUserId();

    switch (method) {
      case "GET":
        try {
          const myWorkspace = await Workspace.find({ userId });

          return res.status(200).json({ success: true, myWorkspace });
        } catch (error) {
          console.log("error->", error);

          return res.status(400).json({ success: false });
        }
        break;
      case "POST":
        try {
          const name = randomWords(1)[0];
          await Workspace.create({ userId, name });

          const myWorkspace = await Workspace.find({ userId });
          return res.status(201).json({ success: true, myWorkspace });
        } catch (error) {
          return res.status(400).json({ success: false });
        }
        break;
      case "DELETE":
        try {
          await deleteUser(userId);
          return res.status(201).json({ success: true });
        } catch (error) {
          return res.status(400).json({ success: false });
        }
        break;
      default:
        res.status(400).json({ success: false });
        break;
    }
  });
}
