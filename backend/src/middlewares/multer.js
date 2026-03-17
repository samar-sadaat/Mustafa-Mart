// import multer from "multer";
// import sharp from "sharp";

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/webp"];
//   if (!allowed.includes(file.mimetype)) {
//     return cb(new Error("Only JPG/PNG/WEBP allowed"), false);
//   }
//   cb(null, true);
// };

// const uploader = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image (change as you like)
// });

// // ✅ PROFILE: 1 image
// export const uploadProfileImage = uploader.single("image");

// // ✅ PRODUCT: max 6 images
// export const uploadProductImages = uploader.array("images", 6);

// /**
//  * Resize/compress uploaded images (memory -> memory)
//  * - Profile: 400x400
//  * - Product: 1000x1000
//  */
// export const resizeProfileImage = async (req, res, next) => {
//   try {
//     if (!req.file) return next();

//     req.file.buffer = await sharp(req.file.buffer)
//       .resize(400, 400, { fit: "cover" })
//       .toFormat("webp", { quality: 80 })
//       .toBuffer();

//     req.file.mimetype = "image/webp";
//     req.file.originalname = "profile.webp";
//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// export const resizeProductImages = async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) return next();

//     req.files = await Promise.all(
//       req.files.map(async (f) => {
//         const buffer = await sharp(f.buffer)
//           .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
//           .toFormat("webp", { quality: 80 })
//           .toBuffer();

//         return {
//           ...f,
//           buffer,
//           mimetype: "image/webp",
//           originalname: "product.webp",
//         };
//       })
//     );

//     next();
//   } catch (err) {
//     next(err);
//   }
// };


import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG/PNG/WEBP allowed"), false);
  }
  cb(null, true);
};

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProfileImage = uploader.single("image");
export const uploadProductImages = uploader.array("images", 6);

export const resizeProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.buffer = await sharp(req.file.buffer)
      .resize(400, 400, { fit: "cover" })
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    req.file.mimetype = "image/webp";
    req.file.originalname = "profile.webp";

    next();
  } catch (err) {
    next(err);
  }
};

export const resizeProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();

    req.files = await Promise.all(
      req.files.map(async (f) => {
        const buffer = await sharp(f.buffer)
          .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
          .toFormat("webp", { quality: 80 })
          .toBuffer();

        return {
          ...f,
          buffer,
          mimetype: "image/webp",
          originalname: "product.webp",
        };
      })
    );

    next();
  } catch (err) {
    next(err);
  }
};