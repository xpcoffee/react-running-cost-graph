import { DateTime } from "luxon";

/**
 * Helper functions for common series components
 */

/**
 * Builds a series component which tracks compound interest. 
 * Will no-op if the value is negative.
 * 
 * @param {{
 *   interestRate: number, 
 *   compoundingPeriodEpochSeconds?: number,
 *   compoundingPeriodDays?: number,
 *   compoundingPeriodWeeks?: number,
 *   compoundingPeriodMonths?: number,
 *   compoundingPeriodYears?: number,
 * }} args
 * @returns {import("./series").SeriesComponentDefinition}
 */
export function compoundInterest({
    interestRate,
    compoundingPeriodEpochSeconds,
    compoundingPeriodDays,
    compoundingPeriodWeeks,
    compoundingPeriodMonths,
    compoundingPeriodYears,
}) {
    if (!(compoundingPeriodEpochSeconds
        || compoundingPeriodDays
        || compoundingPeriodWeeks
        || compoundingPeriodMonths
        || compoundingPeriodYears)) {
        throw "compoundInterest must be provided a compounding period";
    }

    return {
        formula: ({ lastValue, lastTimeStampEpochSeconds }) => {
            if (lastValue < 0) {
                // no-op for negative values
                return lastValue;
            }

            /**
             * @type number
             */
            let divider = 1;
            const nextYear = DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ years: 1 })
                .diff(DateTime.fromSeconds(lastTimeStampEpochSeconds));
            console.log({ nextYear });

            if (compoundingPeriodEpochSeconds) {
                divider = nextYear.seconds;
            }

            if (compoundingPeriodDays) {
                divider = nextYear.days;
            }

            if (compoundingPeriodWeeks) {
                divider = nextYear.weeks;
            }

            if (compoundingPeriodMonths) {
                divider = nextYear.months;
            }

            if (compoundingPeriodYears) {
                divider = 1;
            }

            console.log({ divider });

            return lastValue * (1 + interestRate / 12)
        },
        nextTime: ({ lastTimeStampEpochSeconds }) => {
            if (compoundingPeriodEpochSeconds) {
                return lastTimeStampEpochSeconds + compoundingPeriodEpochSeconds;
            }

            if (compoundingPeriodDays) {
                return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ days: compoundingPeriodDays }).toSeconds();
            }

            if (compoundingPeriodWeeks) {
                return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ weeks: compoundingPeriodWeeks }).toSeconds();
            }

            if (compoundingPeriodMonths) {
                return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ months: compoundingPeriodMonths }).toSeconds();
            }

            if (compoundingPeriodYears) {
                return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ years: compoundingPeriodYears }).toSeconds();
            }
        }
    }
}


/**
 * Maybe series transforms applied in the processor?? Give cumulative.
 * Takes series datapoints and adds to running sum in the closure?
 */