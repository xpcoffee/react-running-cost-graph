import React from 'react';
import PropTypes from 'prop-types';
import './runningCostGraph.css';
import { computeSeries } from './series';

/**
 * Computes running costs and graphs them.
 * 
 * @param {{seriesDefinitions: import('./series').SeriesParams[]}} props
 */
export const RunningCostGraph = ({seriesDefinitions}) => {
  const series = seriesDefinitions.map(computeSeries);

  return (
    <pre>
      {JSON.stringify(series)}
    </pre>
  );
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
