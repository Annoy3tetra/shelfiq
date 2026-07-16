import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  Info,
  Layers,
  Lightbulb,
  PlusCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import ErrorState from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";
import { getInsightsAIMetrics } from "../services/insightsService";

const InsightsAI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getInsightsAIMetrics();
      setData(result);
    } catch (requestError) {
      console.error("Failed to fetch Insights AI metrics:", requestError);
      setError("Unable to generate AI predictions right now. Please verify your connection or try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const status = data?.status ?? (loading ? "loading" : "insufficient_data");
  const metrics = data?.metrics || {};
  const charts = data?.charts || { sales_trend_chart: [], demand_forecast_chart: [] };
  const recommendations = data?.recommendations || [];

  return (
    <Layout>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Sparkles size={13} className="animate-pulse text-indigo-600 dark:text-indigo-400" />
              Real-Time Machine Learning
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Insights AI & Demand Forecasting
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Predictive revenue modeling and automated inventory recommendations powered by scikit-learn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchInsights}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-indigo-600" : ""} />
            Analyze Latest Sales
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-6">
          <ErrorState
            title="Insights Engine Unavailable"
            description={error}
            onRetry={fetchInsights}
          />
        </div>
      ) : null}

      {/* CASE 1: INSUFFICIENT DATA / EMPTY STATE */}
      {!loading && status === "insufficient_data" && (
        <EmptyInsightsState message={data?.message} />
      )}

      {/* CASE 2 & 3: LOADING OR REAL DATA AVAILABLE */}
      {(loading || status === "enabled" || status === "partial_data") && (
        <div className="space-y-6">
          {/* Partial Data Warning Notice */}
          {!loading && status === "partial_data" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4 text-amber-900 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h4 className="text-sm font-bold">Preliminary AI Forecast (&lt; 30 Days Span)</h4>
                <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                  You have recorded {metrics.total_sales_count} sales over {metrics.span_days} days. Insights AI has generated preliminary trend models. For peak predictive accuracy, continue logging sales across a full 30-day window.
                </p>
              </div>
            </motion.div>
          )}

          {/* Top 3 High-Level Cards: Revenue Prediction, Growth Trend, Confidence Indicator */}
          <div className="grid gap-6 md:grid-cols-3">
            <RevenuePredictionCard loading={loading} predictedRevenue={metrics.predicted_next_30_days_revenue} spanDays={metrics.span_days} />
            <GrowthTrendCard loading={loading} growthPercent={metrics.growth_percent} />
            <ConfidenceIndicatorCard loading={loading} level={metrics.confidence_level} score={metrics.confidence_score} salesCount={metrics.total_sales_count} />
          </div>

          {/* Middle Section: AI Recommendations */}
          <AIRecommendationsSection loading={loading} recommendations={recommendations} />

          {/* Bottom Section: Recharts Time-Series & Demand Forecasts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SalesTrendChartCard loading={loading} data={charts.sales_trend_chart} />
            <DemandForecastChartCard loading={loading} data={charts.demand_forecast_chart} />
          </div>
        </div>
      )}
    </Layout>
  );
};

/* --- SECTION 1: EMPTY STATE FOR 0 SALES OR < 10 SALES --- */
const EmptyInsightsState = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35 }}
    className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-8 text-center shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 md:p-14"
  >
    {/* Background Decorative Glows */}
    <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />

    <div className="relative z-10 mx-auto max-w-lg">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 text-white"
      >
        <Brain size={46} />
      </motion.div>

      <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-indigo-100/80 px-3.5 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
        <BookOpen size={14} />
        Minimum Data Threshold Required
      </span>

      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
        Start Recording Sales to Unlock AI Insights
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {message || "Not enough sales history to generate accurate machine learning predictions."} Our scikit-learn models require at least 10 historical sales transactions to fit reliable demand curves and inventory velocity recommendations.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          to="/sales"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-500 hover:to-purple-500"
        >
          <PlusCircle size={18} />
          Record New Sale
        </Link>
        <Link
          to="/books"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Explore Inventory
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200/60 pt-6 dark:border-slate-800/80 text-left">
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-white">1. Log Transactions</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Record cashier checkout sales or bulk orders.</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-white">2. Automatic Fit</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Ridge regression models auto-train on demand.</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-white">3. Actionable AI</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Get restock alerts and revenue trends instantly.</p>
        </div>
      </div>
    </div>
  </motion.div>
);

/* --- SECTION 2: REVENUE PREDICTION CARD --- */
const RevenuePredictionCard = ({ loading, predictedRevenue, spanDays }) => (
  <Card className="relative overflow-hidden p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Projected 30-Day Revenue
        </p>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-36" />
        ) : (
          <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {formatCurrency(predictedRevenue)}
          </h3>
        )}
      </div>
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Brain size={22} />
      </span>
    </div>
    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
      Computed using Ridge regression over {spanDays || 0} days of actual revenue history.
    </p>
  </Card>
);

/* --- SECTION 3: GROWTH TREND CARD --- */
const GrowthTrendCard = ({ loading, growthPercent }) => {
  const isPositive = (growthPercent ?? 0) >= 0;
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Period-Over-Period Growth
          </p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <div className="mt-1.5 flex items-baseline gap-2">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {isPositive ? `+${growthPercent}%` : `${growthPercent}%`}
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                }`}
              >
                {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {isPositive ? "Surging" : "Dipping"}
              </span>
            </div>
          )}
        </div>
        <span
          className={`grid h-11 w-11 place-items-center rounded-xl ${
            isPositive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          }`}
        >
          {isPositive ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Compares latest 14-day sales velocity vs prior 14-day period.
      </p>
    </Card>
  );
};

/* --- SECTION 4: CONFIDENCE INDICATOR CARD --- */
const ConfidenceIndicatorCard = ({ loading, level, score, salesCount }) => (
  <Card className="relative overflow-hidden p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Model Confidence Score
        </p>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-28" />
        ) : (
          <div className="mt-1.5 flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {level || "Moderate"}
            </h3>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              ({score || 70}%)
            </span>
          </div>
        )}
      </div>
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
        <ShieldCheck size={22} />
      </span>
    </div>
    {loading ? (
      <Skeleton className="mt-3 h-2 w-full" />
    ) : (
      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
            style={{ width: `${score || 70}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Based on {salesCount || 0} historical transactions and time-series variance ($R^2$).
        </p>
      </div>
    )}
  </Card>
);

/* --- SECTION 5: AI RECOMMENDATIONS --- */
const AIRecommendationsSection = ({ loading, recommendations }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <Lightbulb size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">
            AI Business Recommendations
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Actionable strategies generated automatically from real inventory turnover rates.
          </p>
        </div>
      </div>
    </div>

    {loading ? (
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    ) : recommendations.length === 0 ? (
      <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        No immediate restock alerts or category spikes detected. Continue recording sales to accumulate deeper recommendations.
      </div>
    ) : (
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec, index) => {
          let badgeColor = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60";
          let badgeText = "Insight";
          if (rec.type === "opportunity") {
            badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60";
            badgeText = "Growth Opportunity";
          } else if (rec.type === "alert") {
            badgeColor = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60";
            badgeText = "Action Required";
          } else if (rec.type === "steady") {
            badgeColor = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60";
            badgeText = "Volume Anchor";
          }

          return (
            <motion.div
              key={index}
              whileHover={{ y: -3 }}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-bold text-slate-950 dark:text-white">
                  {rec.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {rec.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    )}
  </Card>
);

/* --- SECTION 6: SALES TREND CHART (ACTUALS VS AI CURVE) --- */
const SalesTrendChartCard = ({ loading, data }) => (
  <Card className="flex flex-col justify-between p-6">
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">
            Daily Revenue & 15-Day AI Forecast Curve
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Historical actual daily totals vs scikit-learn Ridge projected trend line.
          </p>
        </div>
      </div>
    </div>

    <div className="mt-6 h-72 w-full">
      {loading ? (
        <Skeleton className="h-full w-full rounded-2xl" />
      ) : data.length === 0 ? (
        <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-800">
          No time-series data available yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickFormatter={(val) => val.split("-").slice(1).join("/")}
              tick={{ fontSize: 11, fill: "#64748B" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val) => `₹${val > 999 ? (val / 1000).toFixed(0) + "k" : val}`}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            <Area
              type="monotone"
              dataKey="actual_revenue"
              name="Actual Revenue (₹)"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#actualRevGrad)"
            />
            <Area
              type="monotone"
              dataKey="predicted_revenue"
              name="AI Predicted Revenue (₹)"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#predRevGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  </Card>
);

/* --- SECTION 7: DEMAND FORECAST CHART --- */
const DemandForecastChartCard = ({ loading, data }) => (
  <Card className="flex flex-col justify-between p-6">
    <div>
      <h3 className="text-base font-bold text-slate-950 dark:text-white">
        Category Velocity & 30-Day Unit Demand
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Historical units sold vs projected next 30-day replenishment requirement by book genre.
      </p>
    </div>

    <div className="mt-6 h-72 w-full">
      {loading ? (
        <Skeleton className="h-full w-full rounded-2xl" />
      ) : data.length === 0 ? (
        <div className="grid h-full place-items-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 dark:border-slate-800">
          No category sales data recorded yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748B" }} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            <Bar
              dataKey="historical_demand"
              name="Historical Sold (Units)"
              fill="#3B82F6"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="forecasted_demand"
              name="Projected 30-Day Demand (Units)"
              fill="#A855F7"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </Card>
);

/* --- CUSTOM CHART TOOLTIPS --- */
const CustomChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <p className="text-xs font-bold text-slate-900 dark:text-white">Date: {label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((item, idx) =>
          item.value !== null && item.value !== undefined ? (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400" style={{ color: item.color }}>
                {item.name}:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(item.value)}
              </span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <p className="text-xs font-bold text-slate-900 dark:text-white">Genre: {label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-400" style={{ color: item.color }}>
              {item.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{item.value} units</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
};

export default InsightsAI;
