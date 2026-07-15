import api from "../api/axios";

export const getSummary = async () => {
  const response = await api.get(
    "/dashboard/summary"
  );

  return response.data;
};

export const getTopBooks = async () => {
  const response = await api.get(
    "/dashboard/top-books"
  );

  return response.data;
};

export const getSalesTrend = async () => {
  const response = await api.get(
    "/dashboard/sales-trend"
  );

  return response.data;
};