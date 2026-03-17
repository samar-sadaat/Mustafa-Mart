import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const saveImageLocally = async (buffer, folder) => {
  const allowedFolders = ["profilePics", "products"];

  if (!allowedFolders.includes(folder)) {
    throw new Error("Invalid folder name");
  }

  const uploadDir = path.join(process.cwd(), "uploads", folder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${uuidv4()}.webp`;
  const fullPath = path.join(uploadDir, filename);

  await fs.promises.writeFile(fullPath, buffer);

  return `/uploads/${folder}/${filename}`;
};