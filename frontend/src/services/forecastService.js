import api from "../api/axios";

export const getMonthlySalesForecast = async (month) => {
  const response = await api.get(
    `/forecast/monthly-sales?month=${month}`
  );

  return response.data;
};
