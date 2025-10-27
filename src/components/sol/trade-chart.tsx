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

// Helper function to get CSS variable raw value
const getCSSVariable = (variable: string): string => {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

// Convert OKLAB to RGB
// Based on: https://www.w3.org/TR/css-color-4/#color-conversion-code
const oklabToRgb = (
  L: number,
  a: number,
  b: number,
  alpha: number = 1
): string => {
  // OKLAB to Linear RGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const lCube = l_ * l_ * l_;
  const mCube = m_ * m_ * m_;
  const sCube = s_ * s_ * s_;

  let r = 4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
  let g = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
  let bVal = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube;

  // Convert linear RGB to sRGB
  const toSRGB = (c: number) => {
    const abs = Math.abs(c);
    if (abs > 0.0031308) {
      return Math.sign(c) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
    }
    return 12.92 * c;
  };

  r = toSRGB(r);
  g = toSRGB(g);
  bVal = toSRGB(bVal);

  // Clamp to 0-255
  const clamp = (val: number) =>
    Math.max(0, Math.min(255, Math.round(val * 255)));

  return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(bVal)}, ${alpha})`;
};

// Convert CIELAB to RGB
const cielabToRgb = (
  L: number,
  a: number,
  b: number,
  alpha: number = 1
): string => {
  // CIELAB to XYZ (D65 white point)
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = fx > 0.206897 ? fx * fx * fx : (fx - 16 / 116) / 7.787;
  const yr = fy > 0.206897 ? fy * fy * fy : (fy - 16 / 116) / 7.787;
  const zr = fz > 0.206897 ? fz * fz * fz : (fz - 16 / 116) / 7.787;

  // D65 white point
  const x = xr * 0.95047;
  const y = yr * 1.0;
  const z = zr * 1.08883;

  // XYZ to Linear RGB (sRGB matrix)
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  let bVal = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  // Linear RGB to sRGB
  const toSRGB = (c: number) => {
    if (c <= 0.0031308) {
      return 12.92 * c;
    }
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  r = toSRGB(r);
  g = toSRGB(g);
  bVal = toSRGB(bVal);

  // Clamp to 0-255
  const clamp = (val: number) =>
    Math.max(0, Math.min(255, Math.round(val * 255)));

  return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(bVal)}, ${alpha})`;
};

// Parse and convert LAB to RGB
const labToRgb = (labString: string): string => {
  // Parse lab(L a b) or lab(L a b / A)
  const match = labString.match(
    /lab\(\s*([\d.]+%?)\s+([\d.+-]+)\s+([\d.+-]+)\s*(?:\/\s*([\d.]+%?))?\s*\)/
  );
  if (!match) {
    console.warn("Failed to parse LAB:", labString);
    return "rgba(0, 0, 0, 1)";
  }

  const [, lStr, aStr, bStr, alphaStr] = match;

  // Parse L value - CIELAB L is 0-100 (given as percentage 0-100%)
  const L = lStr.endsWith("%") ? parseFloat(lStr) : parseFloat(lStr);

  // Parse a and b values - CIELAB a/b range from about -128 to 127
  const a = parseFloat(aStr);
  const b = parseFloat(bStr);

  const alpha = alphaStr
    ? alphaStr.endsWith("%")
      ? parseFloat(alphaStr) / 100
      : parseFloat(alphaStr)
    : 1;

  console.log(`CIELAB parsing: ${labString} -> L:${L}, a:${a}, b:${b}`);

  return cielabToRgb(L, a, b, alpha);
};

// Parse and convert OKLCH to RGB
const oklchToRgb = (oklchString: string): string => {
  // Parse oklch(L C H) or oklch(L C H / A)
  const match = oklchString.match(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)/
  );
  if (!match) {
    console.warn("Failed to parse OKLCH:", oklchString);
    return "rgba(0, 0, 0, 1)";
  }

  const [, lStr, cStr, hStr, aStr] = match;

  // Convert percentages if present
  const L = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
  const C = cStr.endsWith("%")
    ? (parseFloat(cStr) / 100) * 0.4
    : parseFloat(cStr);
  const H = parseFloat(hStr);
  const alpha = aStr
    ? aStr.endsWith("%")
      ? parseFloat(aStr) / 100
      : parseFloat(aStr)
    : 1;

  // Convert OKLCH -> OKLAB
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  return oklabToRgb(L, a, b, alpha);
};

// Convert color string to RGB format
const toRgb = (color: string): string => {
  if (!color) return "rgba(0, 0, 0, 1)";

  if (color.startsWith("oklch(")) {
    return oklchToRgb(color);
  }

  if (color.startsWith("lab(")) {
    return labToRgb(color);
  }

  // Already in rgb/rgba format
  if (color.startsWith("rgb")) {
    return color;
  }

  return color;
};

// Helper to add opacity to color
const addOpacity = (color: string, opacity: number = 1): string => {
  const rgb = toRgb(color);

  if (rgb.startsWith("rgba")) {
    return rgb.replace(/[\d.]+\)$/, `${opacity})`);
  }

  if (rgb.startsWith("rgb")) {
    return rgb.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
  }

  return rgb;
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

    // Get raw theme colors
    const rawBackground = getCSSVariable("--background");
    const rawForeground = getCSSVariable("--foreground");
    const rawBorder = getCSSVariable("--border");
    const rawMutedForeground = getCSSVariable("--muted-foreground");

    // Convert to RGB
    const background = toRgb(rawBackground);
    const foreground = toRgb(rawForeground);
    const border = toRgb(rawBorder);
    const mutedForeground = toRgb(rawMutedForeground);

    // Get first chart color for crosshair
    const firstChartColor = toRgb(getCSSVariable("--chart-1"));

    // Create chart with theme-aware options
    const defaultChartOptions: DeepPartial<TimeChartOptions> = {
      layout: {
        textColor: foreground,
        background: {
          type: ColorType.Solid as const,
          color: background,
        },
        fontFamily: "var(--font-geist-sans)",
      },
      grid: {
        vertLines: {
          color: border,
          style: 1,
        },
        horzLines: {
          color: border,
          style: 1,
        },
      },
      crosshair: {
        vertLine: {
          color: mutedForeground,
          width: 1,
          style: 3,
          labelBackgroundColor: firstChartColor,
        },
        horzLine: {
          color: mutedForeground,
          width: 1,
          style: 3,
          labelBackgroundColor: firstChartColor,
        },
      },
      rightPriceScale: {
        borderColor: border,
      },
      timeScale: {
        borderColor: border,
        timeVisible: true,
      },
      ...chartOptions,
    };

    chartRef.current = createChart(containerRef.current, defaultChartOptions);

    // Create multiple series with auto-assigned colors
    seriesRefs.current = series.map((seriesConfig, index) => {
      // Auto-assign colors in order (1-5, cycling if more than 5)
      const colorIndex = (index % 5) + 1;
      const chartColorVar = toRgb(getCSSVariable(`--chart-${colorIndex}`));

      const defaultSeriesOptions: DeepPartial<AreaSeriesPartialOptions> = {
        lineColor: chartColorVar,
        topColor: chartColorVar,
        bottomColor: addOpacity(chartColorVar, 0.1),
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
