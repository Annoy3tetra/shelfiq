import api from "../api/axios";

export const createSale = async (saleData) => {
  const response = await api.post(
    "/sales",
    saleData
  );

  return response.data;
};
