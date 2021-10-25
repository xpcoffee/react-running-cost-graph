import PropTypes from 'prop-types';
import './runningCostGraph.css';
import { computeSeries, prepareSeriesParams } from '../series';
import { getGraph } from '../graph';

/**
 * Computes running costs and graphs them.
 * 
 * @typedef {{
 *   startTimeEpochSeconds: number,
 *   endTimeEpochSeconds: number,
 *   seriesDefinitions: import('../series').SeriesDefinition[]
 * }} Props
 * @param {Props} props
 */
export const RunningCostGraph = ({ seriesDefinitions, startTimeEpochSeconds, endTimeEpochSeconds }) => {
  const allSeries = seriesDefinitions
    .map(definition => prepareSeriesParams({ definition, startTimeEpochSeconds, endTimeEpochSeconds }))
    .flatMap(computeSeries);

  return getGraph(allSeries);
};

RunningCostGraph.propTypes = {
  startTimeEpochSeconds: PropTypes.number.isRequired,
  endTimeEpochSeconds: PropTypes.number.isRequired,
  seriesDefinitions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    startValue: PropTypes.number.isRequired,
    components: PropTypes.arrayOf(PropTypes.shape({
      formula: PropTypes.func.isRequired,
      timeDeltaEpochSeconds: PropTypes.number.isRequired,
    }))
  })).isRequired,
};

RunningCostGraph.defaultProps = {
  series: [],
};
