import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  Tooltip,
  XYChart,
} from "@visx/xychart";

/**
 * Functions and utilities for graphing
 *
 * @typedef {import('./series').Series} Series
 * @typedef {{
 * key: string;
 * dataKey: string;
 * data: VisXGraphLineSeriesData;
 * xAccessor: (d: VisXGraphLineSeriesDatum) => any;
 * yAccessor: (d: VisXGraphLineSeriesDatum) => any
 * }} VisXLineSeriesParams
 * @typedef {{x: number; y: number}} VisXGraphLineSeriesDatum
 * @typedef {(d: VisXGraphLineSeriesDatum) => any} VisXGraphAccessor
 * @typedef {VisXGraphLineSeriesDatum[]} VisXGraphLineSeriesData
 */

/**
 * Creates a VisX graph from data
 * @param {Series[]} allSeries
 * @return {JSX.Element}
 */
export const getGraph = buildVisXGraph;

/**
 * @type {VisXGraphAccessor}
 */
const xAccessor = (d) => {
  if(!d?.x) {
    return undefined;
  }
  const date = new Date(0) 
  date.setUTCSeconds(d.x);
  return date;
}

/**
 * @type {VisXGraphAccessor}
 */
const yAccessor = (d) => d?.y;

/**
 * Creates a VisX graph from internal data
 * @param {Series[]} allSeries
 * @return {JSX.Element}
 */
function buildVisXGraph(allSeries) {
  const lineSeries = allSeries
    .map(seriesToVisXLineSerieParams)
    .map(AnimatedLineSeries);

  return (
      <XYChart height={300} xScale={{ type: "time"}} yScale={{ type: "linear" }}>
      <AnimatedAxis orientation="bottom" />
      <AnimatedGrid columns={false} numTicks={4} />
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale?.(tooltipData?.nearestDatum?.key ?? "") }}>
              {tooltipData?.nearestDatum?.key}
            </div>
            {xAccessor(
              // @ts-ignore
              tooltipData.nearestDatum.datum
            ).toString()}
            {", "}
            {yAccessor(
              // @ts-ignore
              tooltipData.nearestDatum.datum
            )}
          </div>
        )}
      />
      {lineSeries}
    </XYChart>
  );
}

/**
 * Converts internal series into params for a  VisX LineSeries
 * @param {Series} series
 * @return {VisXLineSeriesParams}
 */
function seriesToVisXLineSerieParams(series) {
  const dataKey = series.label;
  console.log({dataKey});

  const data = series.data.map((datum) => ({
    x: datum.timeStampEpochSeconds,
    y: datum.value,
  }));

  return {
    key: dataKey,
    dataKey,
    data,
    xAccessor,
    yAccessor,
  };
}
