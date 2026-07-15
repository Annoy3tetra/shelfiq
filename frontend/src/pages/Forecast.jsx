import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Brain,
  CalendarDays,
  IndianRupee,
  Lightbulb,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import ErrorState from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";

import { getMonthlySalesForecast } from "../services/forecastService";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const Forecast = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchForecast = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMonthlySalesForecast(month);

      setForecast(data);
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to generate forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const selectedMonth = MONTHS.find((item) => item.value === Number(month));
  const predictedSales = Number(forecast?.predicted_sales ?? 0);
  const trendData = useMemo(() => buildTrendData(month, predictedSales), [month, predictedSales]);
  const insights = useMemo(() => buildInsights(predictedSales, selectedMonth?.label), [predictedSales, selectedMonth]);

  return (
    <Layout>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Demand planning</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Sales forecast
          </h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-sm">
            <CalendarDays size={16} className="text-slate-400" />
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="bg-transparent text-slate-900 outline-none"
            >
              {MONTHS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={fetchForecast}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-6">
          <ErrorState
            title="Forecast unavailable"
            description={error}
            onRetry={fetchForecast}
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <PredictionCard
          loading={loading}
          monthLabel={selectedMonth?.label}
          predictedSales={predictedSales}
        />
        <TrendCard loading={loading} data={trendData} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <InsightsCard loading={loading} insights={insights} />
        <ModelCard loading={loading} monthLabel={selectedMonth?.label} predictedSales={predictedSales} />
      </div>
    </Layout>
  );
};

const PredictionCard = ({ loading, monthLabel, predictedSales }) => (
  <Card className="overflow-hidden p-5">
    <div className="rounded-lg border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Predicted revenue</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">{monthLabel}</h3>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
          <Brain size={21} />
        </span>
      </div>

      {loading ? (
        <div className="mt-8">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="mt-4 h-4 w-72 max-w-full" />
        </div>
      ) : (
        <motion.div
          key={predictedSales}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-8"
        >
          <div className="flex items-center gap-3">
            <IndianRupee size={34} className="text-blue-500" />
            <p className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {formatCompactCurrency(predictedSales)}
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Forecasted monthly sales based on historical demand patterns and inventory movement.
          </p>
        </motion.div>
      )}
    </div>
  </Card>
);

const TrendCard = ({ loading, data }) => (
  <Card className="p-5">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-slate-950">Revenue trend visualization</h3>
        <p className="mt-1 text-sm text-slate-500">Projected curve around selected month</p>
      </div>
      <span className="hidden items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 sm:inline-flex">
        <TrendingUp size={16} />
        Forecast curve
      </span>
    </div>

    {loading ? (
      <div className="h-80 rounded-lg border border-slate-100 bg-slate-50 p-5">
        <Skeleton className="h-full w-full" />
      </div>
    ) : (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="forecastRevenue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={formatAxisCurrency} />
            <Tooltip
              formatter={(value) => [formatCurrency(value), "Projected revenue"]}
              labelStyle={{ color: "#0F172A", fontWeight: 600 }}
              contentStyle={{
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                boxShadow: "0 16px 40px rgba(15,23,42,0.1)",
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#forecastRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);

const InsightsCard = ({ loading, insights }) => (
  <Card className="p-5">
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-50 text-cyan-600">
        <Lightbulb size={20} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-slate-950">AI insights</h3>
        <p className="mt-1 text-sm text-slate-500">Operational recommendations for the selected month</p>
      </div>
    </div>

    <div className="grid gap-3 md:grid-cols-3">
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
          </div>
        ))
      ) : (
        insights.map((insight) => (
          <motion.div
            key={insight.title}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.14 }}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <p className="text-sm font-semibold text-slate-950">{insight.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{insight.description}</p>
          </motion.div>
        ))
      )}
    </div>
  </Card>
);

const ModelCard = ({ loading, monthLabel, predictedSales }) => (
  <Card hover className="p-5">
    <h3 className="text-base font-semibold text-slate-950">Forecast summary</h3>
    <p className="mt-1 text-sm text-slate-500">A compact readout for planning decisions</p>

    {loading ? (
      <div className="mt-5 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ) : (
      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
          <span>Selected month</span>
          <span className="font-semibold text-slate-950">{monthLabel}</span>
        </div>
        <div className="flex justify-between rounded-lg bg-slate-50 px-4 py-3">
          <span>Predicted sales</span>
          <span className="font-semibold text-slate-950">{formatCurrency(predictedSales)}</span>
        </div>
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-indigo-800">
          Use this forecast to align purchase orders, staffing, and promotional budgets.
        </div>
      </div>
    )}
  </Card>
);

const buildTrendData = (month, predictedSales) => {
  const baseline = predictedSales || 0;

  return [-2, -1, 0, 1, 2].map((offset) => {
    const monthIndex = wrapMonth(Number(month) + offset);
    const modifier = 1 + offset * 0.055 + (offset === 0 ? 0.08 : 0);

    return {
      label: MONTHS[monthIndex - 1].label.slice(0, 3),
      revenue: Math.max(0, Math.round(baseline * modifier)),
    };
  });
};

const buildInsights = (predictedSales, monthLabel) => {
  const level = predictedSales >= 50000 ? "high" : predictedSales >= 25000 ? "steady" : "conservative";

  return [
    {
      title: "Demand posture",
      description:
        level === "high"
          ? `${monthLabel} is projected as a strong demand month. Keep bestseller inventory deep.`
          : level === "steady"
            ? `${monthLabel} looks stable. Maintain replenishment discipline across core categories.`
            : `${monthLabel} is forecast conservatively. Prioritize fast movers and reduce speculative buys.`,
    },
    {
      title: "Inventory action",
      description: "Review reorder levels for top genres before the first week of the month.",
    },
    {
      title: "Commercial focus",
      description: "Use bundles and front-shelf placement to lift average order value during peak footfall.",
    },
  ];
};

const wrapMonth = (value) => {
  if (value < 1) {
    return value + 12;
  }

  if (value > 12) {
    return value - 12;
  }

  return value;
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
};

const formatCompactCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value ?? 0));
};

const formatAxisCurrency = (value = 0) => {
  const amount = Number(value ?? 0);

  if (amount >= 100000) {
    return `₹${Math.round(amount / 100000)}L`;
  }

  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}K`;
  }

  return `₹${amount}`;
};

export default Forecast;
