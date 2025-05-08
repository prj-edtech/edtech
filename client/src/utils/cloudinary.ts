import axios from "axios";

export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  ); // Your Cloudinary preset
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME); // Your Cloudinary cloud name

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData
    );
    return response.data.secure_url; // Return the image URL
  } catch (error) {
    console.error("Error uploading image to Cloudinary", error);
    throw new Error("Image upload failed");
  }
};
