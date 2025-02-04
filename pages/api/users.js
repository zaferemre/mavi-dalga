import connectToDatabase from "../../utils/db";
import mongoose from "mongoose";
export default async function handler(req, res) {
  await connectToDatabase(); // ✅ Connect to MongoDB

  const db = mongoose.connection.useDb("sample_mflix"); // ✅ Ensure we use `sample_mflix`
  const usersCollection = db.collection("users"); // ✅ Select `users` collection

  if (req.method === "GET") {
    try {
      const users = await usersCollection
        .find({})
        .project({ password: 0 })
        .toArray(); // ✅ Exclude passwords
      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "❌ Error fetching users", error });
    }
  }

  return res.status(405).json({ message: "❌ Method Not Allowed" });
}
