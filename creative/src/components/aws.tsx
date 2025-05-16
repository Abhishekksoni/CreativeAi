import axios from "axios";

export const uploadImage = async (img: File): Promise<string | null> => {
  try {
    // Step 1: Get pre-signed upload URL from backend
    const response = await axios.get<{ uploadedURL: string }>("http://localhost:8000/getUrl/get-upload-url");
    const { uploadedURL } = response.data;

    // Step 2: Upload the file to S3 using the pre-signed URL
    await axios.put(uploadedURL, img, {
      headers: {
        "Content-Type": img.type,
      },
    });

    // Step 3: Return the uploaded image URL (without query params)
    return uploadedURL.split("?")[0];
  }catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Image upload failed:", error.message);
    } else {
      console.error("Unknown error occurred during image upload.");
    }
    return null;
  }
};
