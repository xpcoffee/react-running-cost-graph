import { DateTime } from "luxon";
import Heap from "mnemonist/heap";

/**
 * Functions that work with/compute series.
 */

/**
 * @typedef {{ value: number, timeStampEpochSeconds: number}} SeriesDatapoint A datapoint calculated in a series.
 * @typedef {{label: string, data: SeriesDatapoint[]}} Series A set of datapoints that can be plotted.
 * 
 * @typedef {(lastValue: number, currentStepIndex: number, seriesSoFar: SeriesDatapoint[]) => number} SeriesFormula
 * The series formula is given the previous value, current step index and the results of the series thus 
 * far and must compute and return the value at this step.
 *
 * @typedef {{
 *   formula: SeriesFormula; 
 *   timeDeltaEpochSeconds: number;
 * }} SeriesComponentDefinition Datatype defining a component of a series to be plotted on a graph. 
 * The effects of mutliple series components can be combined into a single series.
 * 
 * @typedef {{
 *   label: string;
 *   startValue: number; 
 *   components: SeriesComponentDefinition[]
 * }} SeriesDefinition Datatype defining a series to be plotted on a graph
 * 
 * @typedef {{
 *   startTimeEpochSeconds: number;
 *   endTimeEpochSeconds: number;
 * } & SeriesDefinition} SeriesParams Datatype containing information necessary to compute a series
 */

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
 * @returns {Series}
 */
export function computeSeries({ label, startTimeEpochSeconds, endTimeEpochSeconds, components, startValue }) {
    const computeHeap = prepareComputeHeap({ startTimeEpochSeconds, components });
    let value = startValue;
    let timeStampEpochSeconds = startTimeEpochSeconds;
    let index = 0;

    /**
     * @type SeriesDatapoint[]
     */
    const data = [{ value, timeStampEpochSeconds }];

    while (computeHeap.size) {
        const tuple = computeHeap.pop();
        if (tuple === undefined) {
            continue;
        }
        console.log("from tuple: " + printEpoch(tuple.timeStamp))

        const result = (function computeDatum() {
            const prevValue = value;
            const newValue = tuple.component.formula(prevValue, index, data);

            const nextTimeStampForFormula = tuple.timeStamp + tuple.component.timeDeltaEpochSeconds;

            return { nextTimeStampForFormula, value: newValue }
        })();

        value = result.value;

        const existingDatum = data[index]
        if (timeStampEpochSeconds === tuple.timeStamp && existingDatum) {
            // update existing datum
            existingDatum.value = value;
        } else {
            // add new datum
            data.push({ timeStampEpochSeconds: tuple.timeStamp, value })
        }

        if (result.nextTimeStampForFormula < endTimeEpochSeconds) {
            console.log("pushing to minheap: " + printEpoch(result.nextTimeStampForFormula))
            computeHeap.push({ timeStamp: result.nextTimeStampForFormula, component: tuple.component })
            computeHeap.inspect()
        }

        timeStampEpochSeconds = tuple.timeStamp;
        index++;
    }

    return { label, data };
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
            timeStamp: startTimeEpochSeconds + component.timeDeltaEpochSeconds
        }

        computeHeap.push(nextDatumToProcess);
    }


    return computeHeap;
}

const printEpoch = (epoch) => DateTime.fromSeconds(epoch).toFormat("ooo")

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
