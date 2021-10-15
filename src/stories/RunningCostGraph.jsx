import React from 'react';
import PropTypes from 'prop-types';
import './runningCostGraph.css';

/**
 * Computes running costs and graphs them.
 * 
 * @param {{series: Series[]}} props
 */
export const RunningCostGraph = ({series}) => {

  return (
    <pre>
      {JSON.stringify(series)}
    </pre>
  );
};

/**
 * @typedef {{ value: number, timeStampEpochSeconds: number}} SeriesTuple
 */

/**
 * The series formula is given the previous value, current step index and the results of the series thus far
 * and must compute and return the value at this step.
 * 
 * @typedef {(lastValue: number, currentStepIndex: number, seriesSoFar: SeriesTuple[]) => number} SeriesFormula
 */

/**
 * @typedef {{
 * formula: SeriesFormula; 
 * startValue: number; 
 * startTimeEpochSeconds: number, 
 * numberOfSteps: number, 
 * timeDeltaEpochSeconds: number
 * }} Series
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
