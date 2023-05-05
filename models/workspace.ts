import mongoose from "mongoose";

export interface Workspace {
  userId: string;
  name: string;
}

const WorkspaceSchema = new mongoose.Schema<Workspace>({
  userId: String,
  name: String,
});

export default (mongoose.models.Workspace as mongoose.Model<Workspace>) ||
  mongoose.model("Workspace", WorkspaceSchema);
