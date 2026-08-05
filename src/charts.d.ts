/* Buzz & Ink · charts — type declarations */

export interface ChartSeries {
  /** Legend label. Shown whenever there are 2+ series. */
  name?: string;
  values: number[];
  /** Override the slot color. Anything not matching a CSS color shape is ignored. */
  color?: string;
}

export interface ChartOptions {
  /** X-axis labels. Defaults to 1..n. */
  categories?: string[];
  series?: ChartSeries[];
  /** Single-series shorthand — use instead of `series`. */
  values?: number[];
  /** Single-series shorthand as {label, value} pairs. */
  data?: Array<{ label?: string; value: number; color?: string }> | number[];
  name?: string;
  /** Rendered above the plot in mono caps. */
  title?: string;
  height?: number;
  /** Value formatter for ticks and tooltips. Default abbreviates k/M/B. */
  format?: (value: number) => string;
  /** Horizontal grid lines. Default true. */
  grid?: boolean;
  /** Axis ticks and labels. Default true. */
  axis?: boolean;
  /** Approximate y-tick count before "nice" rounding. Default 4. */
  ticks?: number;
  /**
   * Force the legend on or off. Defaults to on for 2+ series. Turning it off
   * for a multi-series chart removes the secondary encoding the palette
   * depends on for colorblind separation — only do it if identity is carried
   * some other way.
   */
  legend?: boolean;
  /** Entrance animation. Default true; always skipped under reduced motion. */
  animate?: boolean;
}

export interface BarChartOptions extends ChartOptions {
  /** Stack series instead of grouping them side by side. */
  stacked?: boolean;
}

export interface LineChartOptions extends ChartOptions {
  /** Fill under the line with a fading gradient. */
  area?: boolean;
  /** Catmull-Rom smoothing. Default true; false draws straight segments. */
  curve?: boolean;
  /** Draw a marker at each datum. Default true. */
  points?: boolean;
  /** Start the y-axis at the data minimum instead of zero. Default false. */
  zero?: boolean;
}

export interface DonutChartOptions {
  data: Array<{ label?: string; value: number; color?: string }>;
  title?: string;
  /** Outer diameter in px. Default 200. */
  size?: number;
  /** Ring width in px. Default 22. */
  thickness?: number;
  /** Replace the centre readout, or `false` to omit it. */
  center?: { value: string; label: string } | false;
  format?: (value: number) => string;
  legend?: boolean;
  animate?: boolean;
}

export interface SparklineOptions {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Gradient fill beneath the line. Default true. */
  area?: boolean;
  /** Dot on the final value. Default true. */
  dot?: boolean;
  curve?: boolean;
}

export interface ChartController {
  el: HTMLElement;
  /** Merge new options and re-render. */
  update(options: Partial<ChartOptions>): void;
  destroy(): void;
}

export function barChart(el: HTMLElement, options?: BarChartOptions): ChartController;
export function lineChart(el: HTMLElement, options?: LineChartOptions): ChartController;
export function areaChart(el: HTMLElement, options?: LineChartOptions): ChartController;
export function donutChart(el: HTMLElement, options?: DonutChartOptions): ChartController;
export function sparkline(el: HTMLElement, options?: SparklineOptions): { el: HTMLElement; destroy(): void };

export const charts: {
  barChart: typeof barChart;
  lineChart: typeof lineChart;
  areaChart: typeof areaChart;
  donutChart: typeof donutChart;
  sparkline: typeof sparkline;
};
