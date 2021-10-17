/**
 * Functions that work with/compute series.
 * 
 * @typedef {{ value: number, timeStampEpochSeconds: number}} SeriesDatapoint - A datapoint calculated in a series.
 * 
 * @typedef {{label: string, data: SeriesDatapoint[]}} Series - A set of datapoints that can be plotted.
 * 
 * @typedef {(lastValue: number, currentStepIndex: number, seriesSoFar: SeriesDatapoint[]) => number} SeriesFormula - The series 
 * formula is given the previous value, current step index and the results of the series thus far and must compute and return the value at this step.
 * 
 * @typedef {{
 * label: string,
 * formula: SeriesFormula; 
 * startValue: number; 
 * startTimeEpochSeconds: number, 
 * numberOfSteps: number, 
 * timeDeltaEpochSeconds: number
 * }} SeriesParams - Datatype containing information necessary to compute a series
 */


/**
 * Function that can compute a series, given its params
 * 
 * @param {SeriesParams} params 
 * @returns {Series}
 */
export function computeSeries({label, startValue, startTimeEpochSeconds, numberOfSteps, timeDeltaEpochSeconds, formula}) {
    var value = startValue;
    var timeStampEpochSeconds = startTimeEpochSeconds; 
    const data = [{value, timeStampEpochSeconds}];

    for(let i = 0; i < numberOfSteps; i++) {
        timeStampEpochSeconds += timeDeltaEpochSeconds;
        value = formula(value, i, data);
        data.push({value, timeStampEpochSeconds});
    }

    console.table(data);
    return {label, data};
}
