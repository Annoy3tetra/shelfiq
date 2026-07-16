import api from "../api/axios";

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const registerUser = async (name, email, password, role) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    role
  });
  return response.data;
};