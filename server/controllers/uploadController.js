/* ==========================================================
   UPLOAD IMAGE
========================================================== */

export const uploadImage = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      console.warn("⚠️ No file provided in upload request");
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    console.log("✅ File received:", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",

      image: {
        url: req.file.path,

        // Cloudinary public id
        public_id: req.file.filename,

        // Original file information
        originalName: req.file.originalname,

        // File size in bytes
        size: req.file.size,

        // File type
        format: req.file.mimetype,
      },
    });


  } catch (error) {
    console.error("❌ Upload Error Details:");
    console.error("  Name:", error?.name);
    console.error("  Message:", error?.message);
    console.error("  Code:", error?.code);
    console.error("  Full:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Image upload failed.",
    });
  }
};