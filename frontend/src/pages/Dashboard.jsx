import { useEffect, useMemo, useState } from "react";
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
  AlertTriangle,
  BookOpen,
  Clock3,
  IndianRupee,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { Skeleton, StatCardSkeleton } from "../components/ui/Skeleton";

import {
  getSummary,
  getTopBooks,
  getSalesTrend,
} from "../services/dashboardService";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [topBooks, setTopBooks] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryData, topBooksData, salesTrendData] = await Promise.all([
        getSummary(),
        getTopBooks(),
        getSalesTrend(),
      ]);

      setSummary(summaryData);
      setTopBooks(normalizeTopBooks(topBooksData));
      setSalesTrend(normalizeSalesTrend(salesTrendData));
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to load dashboard metrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const recentActivity = useMemo(() => {
    return buildRecentActivity({ summary, topBooks, salesTrend });
  }, [summary, topBooks, salesTrend]);

  return (
    <Layout>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Operations overview</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Store performance
          </h2>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mb-6">
          <ErrorState
            title="Dashboard unavailable"
            description={error}
            onRetry={fetchDashboardData}
          />
        </div>
      ) : null}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <KpiCard
              title="Total Books"
              value={formatNumber(summary?.total_books)}
              helper="Catalogued titles"
              icon={BookOpen}
              tone="blue"
            />
            <KpiCard
              title="Today's Sales"
              value={formatCurrency(summary?.today_sales)}
              helper="Revenue booked today"
              icon={IndianRupee}
              tone="emerald"
            />
            <KpiCard
              title="Low Stock"
              value={formatNumber(summary?.low_stock_books)}
              helper="Need replenishment"
              icon={TrendingDown}
              tone="amber"
            />
            <KpiCard
              title="Total Sales"
              value={formatNumber(summary?.total_sales)}
              helper="Transactions recorded"
              icon={ShoppingBag}
              tone="indigo"
            />
          </>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <RevenueTrendCard loading={loading} salesTrend={salesTrend} />

        <div className="grid gap-6">
          <TopBooksCard loading={loading} topBooks={topBooks} />
          <LowStockPanel loading={loading} count={summary?.low_stock_books ?? 0} />
        </div>
      </section>

      <section className="mt-6">
        <RecentActivityCard loading={loading} activities={recentActivity} />
      </section>
    </Layout>
  );
};

const RevenueTrendCard = ({ loading, salesTrend }) => (
  <Card className="p-5">
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h3 className="text-base font-semibold text-slate-950">Revenue trend</h3>
        <p className="mt-1 text-sm text-slate-500">Sales revenue across recent trading days</p>
      </div>
      <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
        <TrendingUp size={16} />
        Live API data
      </span>
    </div>

    {loading ? (
      <ChartSkeleton />
    ) : salesTrend.length ? (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesTrend} margin={{ left: -20, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="salesRevenue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={shortCurrency} />
            <Tooltip
              formatter={(value) => [formatCurrency(value), "Revenue"]}
              labelStyle={{ color: "#0F172A", fontWeight: 600 }}
              contentStyle={{
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                boxShadow: "0 16px 40px rgba(15,23,42,0.1)",
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fill="url(#salesRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <EmptyState
        title="No revenue trend yet"
        description="Revenue history will appear once sales records are available."
      />
    )}
  </Card>
);

const TopBooksCard = ({ loading, topBooks }) => (
  <Card className="p-5">
    <h3 className="text-base font-semibold text-slate-950">Top selling books</h3>
    <p className="mt-1 text-sm text-slate-500">Best performers by quantity sold</p>

    <div className="mt-5 space-y-3">
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
            <Skeleton className="h-8 w-8" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </div>
          </div>
        ))
      ) : topBooks.length ? (
        topBooks.slice(0, 5).map((book, index) => (
          <motion.div
            key={`${book.title}-${index}`}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.14 }}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-sm font-semibold text-slate-600">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{book.title}</p>
                <p className="text-xs text-slate-500">{book.author || "Book sales"}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-sm font-semibold text-slate-950">
              {formatNumber(book.sold)}
            </span>
          </motion.div>
        ))
      ) : (
        <EmptyState
          title="No top books yet"
          description="Best sellers will appear after sales are recorded."
        />
      )}
    </div>
  </Card>
);

const LowStockPanel = ({ loading, count }) => {
  const hasLowStock = Number(count) > 0;

  return (
    <Card className={`p-5 ${hasLowStock ? "border-amber-200 bg-amber-50/70" : ""}`}>
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${hasLowStock ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-600"}`}>
          <AlertTriangle size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-950">Low stock alerts</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {loading
              ? "Checking inventory thresholds..."
              : hasLowStock
                ? `${count} books are below the reorder threshold.`
                : "Inventory levels are currently healthy."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-white/70 bg-white/75 p-3 text-sm text-slate-600">
          {hasLowStock
            ? "Prioritize purchase orders for fast-moving titles before the next sales cycle."
            : "No urgent replenishment action is required right now."}
        </div>
      )}
    </Card>
  );
};

const RecentActivityCard = ({ loading, activities }) => (
  <Card className="p-5">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h3 className="text-base font-semibold text-slate-950">Recent activity</h3>
        <p className="mt-1 text-sm text-slate-500">Latest operational signals from dashboard data</p>
      </div>
      <Clock3 size={18} className="text-slate-400" />
    </div>

    <div className="grid gap-3 md:grid-cols-3">
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        ))
      ) : activities.length ? (
        activities.map((activity) => (
          <motion.div
            key={activity.title}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.14 }}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <p className="text-sm font-semibold text-slate-950">{activity.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{activity.description}</p>
            <p className="mt-3 text-xs font-medium text-slate-400">{activity.time}</p>
          </motion.div>
        ))
      ) : (
        <div className="md:col-span-3">
          <EmptyState
            title="No recent activity"
            description="Operational updates will appear here as dashboard data changes."
          />
        </div>
      )}
    </div>
  </Card>
);

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

const KpiCard = ({ title, value, helper, icon: Icon, tone }) => (
  <Card hover className="p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        <p className="mt-2 text-sm text-slate-500">{helper}</p>
      </div>
      <span className={`grid h-11 w-11 place-items-center rounded-lg ${toneClasses[tone]}`}>
        <Icon size={21} />
      </span>
    </div>
  </Card>
);

const ChartSkeleton = () => (
  <div className="h-80 rounded-lg border border-slate-100 bg-slate-50 p-5">
    <Skeleton className="h-full w-full" />
  </div>
);

const normalizeTopBooks = (payload) => {
  const rows = Array.isArray(payload) ? payload : payload?.data ?? payload?.items ?? [];

  return rows.map((book) => ({
    title: book.title ?? book.book_title ?? book.name ?? "Untitled book",
    author: book.author ?? book.writer ?? "",
    sold: Number(book.sold ?? book.quantity_sold ?? book.total_sold ?? book.sales ?? 0),
  }));
};

const normalizeSalesTrend = (payload) => {
  const rows = Array.isArray(payload) ? payload : payload?.data ?? payload?.items ?? [];

  return rows.map((sale) => ({
    date: sale.date ?? sale.day ?? sale.label ?? "",
    revenue: Number(sale.revenue ?? sale.sales ?? sale.total ?? sale.amount ?? 0),
  }));
};

const buildRecentActivity = ({ summary, topBooks, salesTrend }) => {
  const latestTrend = salesTrend.at(-1);
  const bestSeller = topBooks[0];
  const activities = [];

  if (latestTrend) {
    activities.push({
      title: "Revenue updated",
      description: `${formatCurrency(latestTrend.revenue)} recorded for ${latestTrend.date || "the latest period"}.`,
      time: "Just now",
    });
  }

  if (bestSeller) {
    activities.push({
      title: "Best seller changed",
      description: `${bestSeller.title} leads with ${formatNumber(bestSeller.sold)} units sold.`,
      time: "Today",
    });
  }

  if (summary) {
    activities.push({
      title: "Inventory checked",
      description: `${formatNumber(summary.low_stock_books)} books currently need stock attention.`,
      time: "Today",
    });
  }

  return activities;
};

const formatNumber = (value = 0) => {
  return new Intl.NumberFormat("en-IN").format(Number(value ?? 0));
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
};

const shortCurrency = (value = 0) => {
  const amount = Number(value ?? 0);

  if (amount >= 100000) {
    return `₹${Math.round(amount / 100000)}L`;
  }

  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}K`;
  }

  return `₹${amount}`;
};

export default Dashboard;
