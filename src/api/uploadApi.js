import api from "./axios";

/* ==========================================================
   UPLOAD PRODUCT IMAGE
========================================================== */

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();

    formData.append("image", file);

    const { data } = await api.post("/upload", formData);

    return data;
  } catch (error) {
    console.error("Upload Image Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Image upload failed.",
    };
  }
};

/* ==========================================================
   UPLOAD MULTIPLE IMAGES
   (Requires backend route: POST /api/upload/multiple)
========================================================== */

export const uploadImages = async (files) => {
  try {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    const { data } = await api.post(
      "/upload/multiple",
      formData
    );

    return data;
  } catch (error) {
    console.error("Upload Images Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Image upload failed.",
    };
  }
};

/* ==========================================================
   DELETE IMAGE
   (Requires backend route: DELETE /api/upload)
========================================================== */

export const deleteImage = async (publicId) => {
  try {
    const { data } = await api.delete("/upload", {
      data: {
        public_id: publicId,
      },
    });

    return data;
  } catch (error) {
    console.error("Delete Image Error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Image deletion failed.",
    };
  }
};