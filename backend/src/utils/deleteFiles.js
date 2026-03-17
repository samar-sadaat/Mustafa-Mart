import fs from "fs";
import path from "path";

export const deleteLocalFiles = async (files = []) => {
  await Promise.all(
    files.map(async (filePath) => {
      try {
        const fullPath = path.join(process.cwd(), filePath.replace(/^\/+/, ""));
        await fs.promises.unlink(fullPath);
      } catch (err) {
        console.error("Failed to delete file:", err.message);
      }
    })
  );
};