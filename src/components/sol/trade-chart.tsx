"use client";

import React from "react";
import type {
  AreaSeriesPartialOptions,
  DeepPartial,
  ISeriesApi,
  SingleValueData,
  TimeChartOptions,
} from "lightweight-charts";
import { AreaSeries, ColorType, createChart } from "lightweight-charts";

interface SeriesConfig {
  data: SingleValueData[];
  options?: DeepPartial<AreaSeriesPartialOptions>;
}

interface TradeChartProps {
  series: SeriesConfig[];
  className?: string;
  chartOptions?: DeepPartial<TimeChartOptions>;
}

// Hardcoded theme colors matching global.css
// Light mode colors
const LIGHT_COLORS = {
  background: "rgb(255, 255, 255)",
  foreground: "rgb(37, 37, 37)",
  border: "rgb(235, 235, 235)",
  mutedForeground: "rgb(142, 142, 142)",
  chart1: "rgb(223, 123, 55)", // oklch(0.646 0.222 41.116) - orange
  chart2: "rgb(63, 153, 153)", // oklch(0.6 0.118 184.704) - cyan
  chart3: "rgb(82, 91, 118)", // oklch(0.398 0.07 227.392) - dark blue
  chart4: "rgb(201, 211, 83)", // oklch(0.828 0.189 84.429) - yellow-green
  chart5: "rgb(211, 180, 68)", // oklch(0.769 0.188 70.08) - yellow
};

// Dark mode colors
const DARK_COLORS = {
  background: "rgb(37, 37, 37)",
  foreground: "rgb(251, 251, 251)",
  border: "rgba(255, 255, 255, 0.1)",
  mutedForeground: "rgb(180, 180, 180)",
  chart1: "rgb(124, 58, 237)", // oklch(0.488 0.243 264.376) - purple
  chart2: "rgb(52, 177, 152)", // oklch(0.696 0.17 162.48) - cyan
  chart3: "rgb(211, 180, 68)", // oklch(0.769 0.188 70.08) - yellow
  chart4: "rgb(192, 72, 185)", // oklch(0.627 0.265 303.9) - magenta
  chart5: "rgb(214, 107, 82)", // oklch(0.645 0.246 16.439) - orange-red
};

// Helper to add opacity to RGB color
const addOpacity = (rgb: string, opacity: number): string => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
  }
  return rgb;
};

// Get colors based on theme
const getThemeColors = () => {
  if (typeof window === "undefined") return LIGHT_COLORS;
  const isDark = document.documentElement.classList.contains("dark");
  return isDark ? DARK_COLORS : LIGHT_COLORS;
};

const TradeChart = ({
  series,
  className = "h-[320px] w-full",
  chartOptions,
}: TradeChartProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRefs = React.useRef<ISeriesApi<"Area">[]>([]);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // Get theme colors
    const colors = getThemeColors();
    const chartColors = [
      colors.chart1,
      colors.chart2,
      colors.chart3,
      colors.chart4,
      colors.chart5,
    ];

    // Create chart with theme-aware options
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
        vertLines: {
          color: colors.border,
          style: 1,
        },
        horzLines: {
          color: colors.border,
          style: 1,
        },
      },
      crosshair: {
        vertLine: {
          color: colors.mutedForeground,
          width: 1,
          style: 3,
          labelBackgroundColor: colors.chart1,
        },
        horzLine: {
          color: colors.mutedForeground,
          width: 1,
          style: 3,
          labelBackgroundColor: colors.chart1,
        },
      },
      rightPriceScale: {
        borderColor: colors.border,
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
      },
      ...chartOptions,
    };

    chartRef.current = createChart(containerRef.current, defaultChartOptions);

    // Create multiple series with auto-assigned colors
    seriesRefs.current = series.map((seriesConfig, index) => {
      // Auto-assign colors in order (1-5, cycling if more than 5)
      const chartColor = chartColors[index % 5];

      const defaultSeriesOptions: DeepPartial<AreaSeriesPartialOptions> = {
        lineColor: chartColor,
        topColor: chartColor,
        bottomColor: addOpacity(chartColor, 0.1),
        lineWidth: 2,
        ...seriesConfig.options,
      };

      const areaSeries = chartRef.current!.addSeries(
        AreaSeries,
        defaultSeriesOptions
      );
      areaSeries.setData(seriesConfig.data);

      return areaSeries;
    });

    // Fit content to view
    chartRef.current.timeScale().fitContent();

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, [series, chartOptions]);

  return <div className={className} ref={containerRef} />;
};

export { TradeChart };
