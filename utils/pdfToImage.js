import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

export async function getFirstPageAsImage(pdfUrl) {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);

    const scale = 2; // Adjust for better quality
    const viewport = page.getViewport({ scale });

    // Create a canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render the page
    const renderContext = { canvasContext: context, viewport };
    await page.render(renderContext).promise;

    return canvas.toDataURL("image/png"); // Convert to Base64 Image
  } catch (error) {
    console.error("❌ Error rendering PDF:", error);
    return "/default-thumbnail.png"; // Fallback image
  }
}
