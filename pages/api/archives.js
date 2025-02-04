import connectToDatabase from "../../utils/db";
import Archive from "../../models/Archive";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const archives = await Archive.find({});
      return res.status(200).json(archives);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching archives", error });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
