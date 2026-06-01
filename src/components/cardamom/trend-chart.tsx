"use client";

import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export type TrendSeries = {
  id: string;
  label: string;
  color: string;
  points: Array<{ date: string; value: number; tooltipDate?: string }>;
};

type TrendChartProps = {
  title?: string;
  series: TrendSeries[];
};

function formatCurrency(value: number) {
  return `Rs ${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function TrendChart({ title = "Trend", series }: TrendChartProps) {
  const activeSeries = series.filter((item) => item.points.length > 0);

  const labels = useMemo(() => {
    const first = activeSeries[0];
    return first ? first.points.map((point) => point.date) : [];
  }, [activeSeries]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: activeSeries.map((item, index) => ({
        label: item.label,
        data: item.points.map((point) => point.value),
        borderColor: item.color,
        backgroundColor: `${item.color}33`,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
        tension: 0.3,
        fill: index === 0,
      })),
    }),
    [activeSeries, labels],
  );

  const options = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "#10b981",
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "#080d0a",
          borderColor: "rgba(6, 78, 59, 1)",
          borderWidth: 1,
          titleColor: "#a7f3d0",
          bodyColor: "#a7f3d0",
          callbacks: {
            title(items) {
              const first = items[0];
              if (!first) return "";
              const point = activeSeries[0]?.points[first.dataIndex];
              return point?.tooltipDate ?? String(first.label ?? "");
            },
            label(context) {
              const value = Number(context.raw);
              return `${context.dataset.label}: Rs ${Math.round(value).toLocaleString("en-IN")}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(6, 78, 59, 0.4)" },
          ticks: { color: "#059669", maxTicksLimit: 8 },
        },
        y: {
          grid: { color: "rgba(6, 78, 59, 0.4)" },
          ticks: {
            color: "#059669",
            callback(value) {
              return `Rs ${Math.round(Number(value)).toLocaleString("en-IN")}`;
            },
          },
        },
      },
    }),
    [activeSeries],
  );

  if (!activeSeries.length || !labels.length) {
    return (
      <div className="rounded-3xl border border-[#1f3027] bg-gradient-to-b from-[#0f1b15] to-[#0b1410] p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#64d3a1]">{title}</h3>
        <p className="mt-4 text-sm text-slate-500">No trend data yet. Run sync from admin to populate trend lines.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#1f3027] bg-gradient-to-b from-[#0f1b15] to-[#0b1410] p-5 shadow-xl">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#64d3a1]">{title}</h3>
      <div className="h-64 w-full md:h-72">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
