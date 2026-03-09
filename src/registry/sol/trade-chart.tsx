"use client";

import type {
  CandlestickData,
  CandlestickSeriesPartialOptions,
  DeepPartial,
  TimeChartOptions,
} from "lightweight-charts";
import { CandlestickSeries, ColorType, createChart } from "lightweight-charts";
import React from "react";

interface TradeChartProps {
  data: CandlestickData[];
  visibleBars?: number;
  className?: string;
  chartOptions?: DeepPartial<TimeChartOptions>;
  seriesOptions?: DeepPartial<CandlestickSeriesPartialOptions>;
}

const LIGHT_COLORS = {
  background: "rgb(255, 255, 255)",
  foreground: "rgb(37, 37, 37)",
  border: "rgb(235, 235, 235)",
  mutedForeground: "rgb(142, 142, 142)",
};

const DARK_COLORS = {
  background: "rgb(37, 37, 37)",
  foreground: "rgb(251, 251, 251)",
  border: "rgba(255, 255, 255, 0.1)",
  mutedForeground: "rgb(180, 180, 180)",
};

const TradeChart = ({
  data,
  visibleBars,
  className = "h-[320px] w-full",
  chartOptions,
  seriesOptions,
}: TradeChartProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<ReturnType<typeof createChart> | null>(null);
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  // Watch for theme changes on <html> class
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Stable serialized keys so inline object literals don't cause re-renders
  const chartOptionsKey = JSON.stringify(chartOptions);
  const seriesOptionsKey = JSON.stringify(seriesOptions);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const parsedChartOptions = chartOptionsKey
      ? (JSON.parse(chartOptionsKey) as DeepPartial<TimeChartOptions>)
      : undefined;
    const parsedSeriesOptions = seriesOptionsKey
      ? (JSON.parse(
          seriesOptionsKey,
        ) as DeepPartial<CandlestickSeriesPartialOptions>)
      : undefined;

    const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

    const defaultChartOptions: DeepPartial<TimeChartOptions> = {
      layout: {
        textColor: colors.foreground,
        background: {
          type: ColorType.Solid as const,
          color: colors.background,
        },
        fontFamily: "var(--font-geist-sans)",
      },
      grid: {
        vertLines: { color: colors.border, style: 1 },
        horzLines: { color: colors.border, style: 1 },
      },
      crosshair: {
        vertLine: {
          color: colors.mutedForeground,
          width: 1,
          style: 3,
        },
        horzLine: {
          color: colors.mutedForeground,
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border, timeVisible: true },
      autoSize: true,
      ...parsedChartOptions,
    };

    chartRef.current = createChart(containerRef.current, defaultChartOptions);

    const candlestick = chartRef.current.addSeries(CandlestickSeries, {
      borderVisible: false,
      ...parsedSeriesOptions,
    });
    candlestick.setData(data);

    if (visibleBars && data.length > visibleBars) {
      chartRef.current.timeScale().setVisibleLogicalRange({
        from: data.length - visibleBars - 0.5,
        to: data.length - 0.5,
      });
    } else {
      chartRef.current.timeScale().fitContent();
    }

    return () => {
      chartRef.current?.remove();
    };
  }, [data, visibleBars, isDark, chartOptionsKey, seriesOptionsKey]);

  return <div className={className} ref={containerRef} />;
};

export type { TradeChartProps };
export { TradeChart };
