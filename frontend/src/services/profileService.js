import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/profile/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
