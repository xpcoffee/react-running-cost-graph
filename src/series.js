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
 * label: string;
 * formula: SeriesFormula; 
 * timeDeltaEpochSeconds: number;
 * startValue: number; 
 * }} SeriesDefinition - Datatype defining a series to be plotted on a graph
 * 
 * @typedef {{
 * startTimeEpochSeconds: number;
 * numberOfSteps: number;
 * } & SeriesDefinition} SeriesParams - Datatype containing information necessary to compute a series
 */

/**
 * Prepares the parameters necessary to process a series.
 * 
 * @param {{
 * definition: SeriesDefinition;
 * startTimeEpochSeconds: number;
 * endTimeEpochSeconds: number;
 * }} definition
 * @return {SeriesParams} params
 */
export function prepareSeriesParams({definition, startTimeEpochSeconds, endTimeEpochSeconds}) {
    const numberOfSteps = (endTimeEpochSeconds - startTimeEpochSeconds) / definition.timeDeltaEpochSeconds + 1;
    return {
        ...definition,
        startTimeEpochSeconds,
        numberOfSteps
    }
}


/**
 * Calculates the data in a series.
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
