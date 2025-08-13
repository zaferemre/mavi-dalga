import axios from "axios";

const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const PDF_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const THUMBNAIL_FOLDER_ID = process.env.GOOGLE_DRIVE_THUMBNAIL_FOLDER_ID;

export default async function handler(req, res) {
  try {
    // Fetch PDF Files (Including Created Time)
    const pdfResponse = await axios.get(
      `https://www.googleapis.com/drive/v3/files?q='${PDF_FOLDER_ID}'+in+parents&fields=files(id, name, createdTime)&key=${API_KEY}`
    );

    // Fetch PNG Thumbnails
    const thumbResponse = await axios.get(
      `https://www.googleapis.com/drive/v3/files?q='${THUMBNAIL_FOLDER_ID}'+in+parents&fields=files(id, name)&key=${API_KEY}`
    );

    // Create a map of thumbnails
    const thumbnailMap = {};
    thumbResponse.data.files.forEach((file) => {
      const baseName = file.name.replace(".png", "").trim(); // Normalize name
      thumbnailMap[baseName] =
        `https://drive.google.com/uc?export=view&id=${file.id}`;
    });

    // Sort PDFs by createdTime (newest first)
    const sortedFiles = pdfResponse.data.files.sort(
      (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
    );

    // Match PDFs with Thumbnails
    const files = sortedFiles.map((pdf) => {
      const baseName = pdf.name.replace(".pdf", "").trim(); // Normalize name
      const thumbnail = thumbnailMap[baseName] || "/default-thumbnail.jpeg"; // Fallback image

      return {
        name: pdf.name,
        url: `https://drive.google.com/uc?export=download&id=${pdf.id}`,
        thumbnail: thumbnail,
      };
    });

    return res.status(200).json(files);
  } catch (error) {
    console.error("❌ Error fetching PDFs:", error);
    return res.status(500).json({ message: "❌ Failed to fetch PDFs", error });
  }
}
