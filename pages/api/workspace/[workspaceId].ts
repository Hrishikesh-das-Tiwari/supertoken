import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import supertokens from "supertokens-node";
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

  await dbConnect();

  const { workspaceId } = req.query;
  if (method === "DELETE") {
    try {
      let userId = req.session!.getUserId();

      await Workspace.findByIdAndDelete(workspaceId);
      const myWorkspace = await Workspace.find({ userId });
      return res.status(201).json({ success: true, myWorkspace });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }
}
