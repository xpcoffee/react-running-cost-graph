import { DateTime } from "luxon";
import Heap from "mnemonist/heap";

/**
 * Functions that work with/compute series.
 */

/**
 * @typedef {{ value: number, timeStampEpochSeconds: number }} SeriesDatapoint A datapoint calculated in a series.
 * @typedef {{label: string, data: SeriesDatapoint[]}} Series A set of datapoints that can be plotted.
 * 
 * @typedef {(args: {lastValue: number, currentStepIndex: number, seriesSoFar: SeriesDatapoint[], lastTimeStampEpochSeconds: number}) => number} SeriesFormula
 * The series formula is given the previous value, current step index and the results of the series thus 
 * far and must compute and return the value at this step.
 *
 * @typedef {{
 *   formula: SeriesFormula; 
 *   timeDeltaEpochSeconds?: number;
 *   nextTime?: ({lastTimeStampEpochSeconds: number}) => number;
 * }} SeriesComponentDefinition Datatype defining a component of a series to be plotted on a graph. 
 * The effects of mutliple series components can be combined into a single series.
 * 
 * @typedef {{
 *   label: string;
 *   startValue: number; 
 *   runningCostConfig?: RunningCostConfig;
 *   components: SeriesComponentDefinition[];
 * }} SeriesDefinition Datatype defining a series to be plotted on a graph
 * 
 * @typedef {{
 *   startTimeEpochSeconds: number;
 *   endTimeEpochSeconds: number;
 * } & SeriesDefinition} SeriesParams Datatype containing information necessary to compute a series
 * 
 * @typedef {{ 
 *   plotType: "off" | "alongside" | "only" ;
 *   prefix: string;
 * }} RunningCostConfig
 */

/**
 * @type {RunningCostConfig} 
 */
const defaultRunningCostConfig = {
    plotType: "off",
    prefix: "running cost:",
}

/**
 * Calculates the data in a series.
 * 
 * This algorithm works around a min-heap which stores the next timestamps that need to be 
 * processed for each SeriesComponent, with the soonest timestamp kept at the top.
 * 
 * While there are still timestamp-component tuples to be processed:
 * 
 * 1. a tuple is popped from the heap 
 * 2. the series datum is computed using the component's formula and added to the series
 * 3. the next timestamp is determined for this component
 * 4. if the next timestamp is still within the time-range, a timestamp-component tuple 
 * is added to the heap.
 * 
 * @param {SeriesParams} params 
 * @returns {Series[]}
 */
export function computeSeries({
    label,
    startTimeEpochSeconds,
    endTimeEpochSeconds,
    components,
    startValue,
    runningCostConfig = defaultRunningCostConfig,
}) {
    const computeHeap = prepareComputeHeap({ startTimeEpochSeconds, components });
    let value = startValue;
    let timeStampEpochSeconds = startTimeEpochSeconds;
    let index = 0;

    /**
     * @type SeriesDatapoint[]
     */
    const data = [{ value, timeStampEpochSeconds }];
    console.log({ data })
    /**
     * @type SeriesDatapoint[] | undefined
     */
    const runningCostData = runningCostConfig.plotType === "off" ? undefined : [{ value: 0, timeStampEpochSeconds }];

    while (computeHeap.size) {
        const tuple = computeHeap.pop();

        if (tuple === undefined) {
            continue;
        }

        const result = (function computeDatum() {
            const prevValue = value;
            const newValue = tuple.component.formula({
                lastValue: prevValue,
                currentStepIndex: index,
                seriesSoFar: data,
                lastTimeStampEpochSeconds: tuple.timeStamp
            });

            const nextTimeStampForFormula = getTimeDeltaEpochSeconds(tuple.component, tuple.timeStamp);
            return { nextTimeStampForFormula, value: newValue }
        })();

        const delta = result.value - value;
        // Only accumulate costs
        const runningCostDelta = delta < 0 ? delta * -1 : 0;
        value = result.value;

        const existingDatum = data[index]
        console.log({ existingDatum })
        if (timeStampEpochSeconds === tuple.timeStamp && existingDatum) {
            // update existing datum
            existingDatum.value = value;

            if (runningCostData) {
                const existingRunningCostDatum = runningCostData[index];
                existingRunningCostDatum.value += runningCostDelta;
            }
        } else {
            // add new datum
            data.push({ timeStampEpochSeconds: tuple.timeStamp, value })

            if (runningCostData) {
                const runningCostValue = runningCostData[runningCostData.length - 1].value + runningCostDelta;
                runningCostData.push({ timeStampEpochSeconds: tuple.timeStamp, value: runningCostValue })
            }
        }


        if (result.nextTimeStampForFormula <= endTimeEpochSeconds) {
            computeHeap.push({ timeStamp: result.nextTimeStampForFormula, component: tuple.component })
            computeHeap.inspect()
        }

        timeStampEpochSeconds = tuple.timeStamp;
        index++;
    }

    /**
     * @type {Series[]}
     */
    const series = [];
    if (runningCostData) {
        series.push({ label: runningCostConfig.prefix + label, data: runningCostData });
    }
    if (runningCostConfig.plotType !== "only") {
        series.push({ label, data });
    }
    return series;
}

/**
 * Returns a min-heap used to manage which timestamp-formula tuple needs to be processed next.
 * 
 * @param {{
 *   startTimeEpochSeconds: number,
 *   components: SeriesComponentDefinition[]
 * }} args 
 */
function prepareComputeHeap({ startTimeEpochSeconds, components }) {
    /**
     * @typedef {{timeStamp: number, component: SeriesComponentDefinition}} ComputeHeapMember
     * @param {ComputeHeapMember} a 
     * @param {ComputeHeapMember} b 
     * @returns number
     */
    const computeHeapComparator = (a, b) => {
        if (a.timeStamp > b.timeStamp)
            return 1;
        if (a.timeStamp < b.timeStamp)
            return -1;
        return 0;
    }
    const computeHeap = new Heap(computeHeapComparator);

    for (let component of components) {
        const nextDatumToProcess = {
            component,
            timeStamp: getTimeDeltaEpochSeconds(component, startTimeEpochSeconds),
        }

        computeHeap.push(nextDatumToProcess);
    }


    return computeHeap;
}

/**
 * @param {SeriesComponentDefinition} component 
 * @param {number} timeStampEpochSeconds 
 * @return {number} the time delta
 */
function getTimeDeltaEpochSeconds(component, timeStampEpochSeconds) {
    let nextTimeStampForFormula;

    if (component.timeDeltaEpochSeconds) {
        nextTimeStampForFormula = timeStampEpochSeconds + component.timeDeltaEpochSeconds;
    } else if (component.nextTime) {
        nextTimeStampForFormula = component.nextTime({ lastTimeStampEpochSeconds: timeStampEpochSeconds });
    }

    if (nextTimeStampForFormula === undefined) {
        throw ("Component must specify either timeDelta or timeDeltaEpochSeconds");
    }

    return nextTimeStampForFormula;
}

/**
 * Prepares the parameters necessary to process a series.
 * 
 * @param {{
 *   definition: SeriesDefinition;
 *   startTimeEpochSeconds: number;
 *   endTimeEpochSeconds: number;
 * }} definition
 * @return {SeriesParams} params
 */
export function prepareSeriesParams({ definition, startTimeEpochSeconds, endTimeEpochSeconds }) {
    return {
        ...definition,
        startTimeEpochSeconds,
        endTimeEpochSeconds
    }
}
