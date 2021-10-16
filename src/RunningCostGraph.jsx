import React from 'react';
import PropTypes from 'prop-types';
import './runningCostGraph.css';
import { computeSeries } from './series';
import { getGraph } from './graph';

/**
 * Computes running costs and graphs them.
 * 
 * @param {{seriesDefinitions: import('./series').SeriesParams[]}} props
 */
export const RunningCostGraph = ({seriesDefinitions}) => {
  const allSeries = seriesDefinitions.map(computeSeries);
  return getGraph(allSeries);
};

/**
 */

RunningCostGraph.propTypes = {
  series: PropTypes.arrayOf(PropTypes.shape({
    formula: PropTypes.func.isRequired,
    startValue: PropTypes.number.isRequired,
    numberOfSteps: PropTypes.number.isRequired, 
    endTimeEpochSeconds: PropTypes.number.isRequired, 
    timeDeltaEpochSeconds: PropTypes.number.isRequired
  })).isRequired,
};

RunningCostGraph.defaultProps = {
  series: [],
};
