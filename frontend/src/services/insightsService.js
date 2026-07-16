import api from "../api/axios";

export const getInsightsAIMetrics = async () => {
  const response = await api.get("/insights-ai/metrics");
  return response.data;
};
