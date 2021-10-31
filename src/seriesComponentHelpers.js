import { DateTime } from "luxon";
import { InvalidParameterException } from "./components/errors";

/**
 * Helper functions for common series components
 */

/**
 * Builds a series component which tracks compound interest. 
 * Will no-op if the value is negative.
 * 
 * @param {{
 *   interestRate: number, 
 *   compoundingPeriod: number,
 *   compoundingPeriodUnit: "seconds" | "days" | "weeks" | "months" | "years",
 * }} args
 * @returns {import("./series").SeriesComponentDefinition}
 */
export function compoundInterest({
    interestRate,
    compoundingPeriod,
    compoundingPeriodUnit,
}) {
    return {
        formula: ({ lastValue, lastTimeStampEpochSeconds }) => {
            if (lastValue < 0) {
                // no-op for negative values
                return lastValue;
            }

            const nextYear = (DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ years: 1 }));

            const divider = (function determineDivider() {
                switch (compoundingPeriodUnit) {
                    case "seconds":
                        return nextYear.diff(DateTime.fromSeconds(lastTimeStampEpochSeconds), "seconds").seconds;
                    case "days":
                        return nextYear.diff(DateTime.fromSeconds(lastTimeStampEpochSeconds), "days").days;
                    case "weeks":
                        return nextYear.diff(DateTime.fromSeconds(lastTimeStampEpochSeconds), "weeks").weeks;
                    case "months":
                        return nextYear.diff(DateTime.fromSeconds(lastTimeStampEpochSeconds), "months").months;
                    case "years":
                        return nextYear.diff(DateTime.fromSeconds(lastTimeStampEpochSeconds), "years").years;
                    default:
                        throw new InvalidParameterException("Unknown compound interest period unit: " + compoundingPeriodUnit);
                }
            })()

            return lastValue * (1 + interestRate / divider)
        },
        nextTime: ({ lastTimeStampEpochSeconds }) => {
            switch (compoundingPeriodUnit) {
                case "seconds":
                    return lastTimeStampEpochSeconds + compoundingPeriod;
                case "days":
                    return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ days: compoundingPeriod }).toSeconds();
                case "weeks":
                    return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ weeks: compoundingPeriod }).toSeconds();
                case "months":
                    return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ months: compoundingPeriod }).toSeconds();
                case "years":
                    return DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ years: compoundingPeriod }).toSeconds();
                default:
                    throw new InvalidParameterException("Unknown compound interest period unit: " + compoundingPeriodUnit);
            }
        }
    }
}


/**
 * Maybe series transforms applied in the processor?? Give cumulative.
 * Takes series datapoints and adds to running sum in the closure?
 */