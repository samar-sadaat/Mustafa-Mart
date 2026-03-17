import fs from "fs";
import path from "path";

export const ensureUploadDirs = () => {
  const dirs = [
    path.join("uploads", "profilePics"),
    path.join("uploads", "products"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

