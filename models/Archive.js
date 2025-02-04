import mongoose from "mongoose";

const ArchiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, required: true },
});

export default mongoose.models.Archive ||
  mongoose.model("Archive", ArchiveSchema);
