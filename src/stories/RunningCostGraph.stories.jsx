import { DateTime } from "luxon";
import React from "react";

import { RunningCostGraph } from "..";
import { compoundInterest } from "../seriesComponentHelpers";

export default {
  title: "RunningCostGraph",
  component: RunningCostGraph,
};

const now = DateTime.now();

/**
 * The template to use to define Storybook examples.
 * @param {import("../components/RunningCostGraph").Props} args 
 */
const Template = (args) => <RunningCostGraph {...args} />;

/**
 * Returns the number of seconds for a given number of days.
 * @param {number} days 
 */
const daysInSeconds = (days) => days * 60 * 60 * 24

/**
 * Default example.
 * @type {{args: import("../components/RunningCostGraph").Props}}
 */
export const SimpleGraphWithMultipleSeries = Template.bind({});
SimpleGraphWithMultipleSeries.args = {
  startTimeEpochSeconds: now.toSeconds(),
  endTimeEpochSeconds: now.plus({ days: 30 }).toSeconds(),
  seriesDefinitions: [
    {
      label: "one",
      startValue: 5,
      components: [
        {
          formula: ({ lastValue }) => lastValue + 1,
          timeDeltaEpochSeconds: daysInSeconds(5)
        }
      ]
    },
    {
      label: "two",
      startValue: 10,
      components: [
        {
          formula: ({ lastValue }) => lastValue + 3,
          timeDeltaEpochSeconds: daysInSeconds(3),
        }
      ]
    },
  ],
};

/**
 * With multiple components in one series.
 * @type {{args: import("../components/RunningCostGraph").Props}}
 */
export const SingleSeriesComposedOfMultipleComponents = Template.bind({});
SingleSeriesComposedOfMultipleComponents.args = {
  startTimeEpochSeconds: now.toSeconds(),
  endTimeEpochSeconds: now.plus({ days: 30 }).toSeconds(),
  seriesDefinitions: [
    {
      label: "one + two",
      startValue: 0,
      components: [
        {
          formula: ({ lastValue }) => lastValue + 1,
          timeDeltaEpochSeconds: daysInSeconds(5)
        },
        {
          formula: ({ lastValue }) => lastValue + 3,
          timeDeltaEpochSeconds: daysInSeconds(3),
        }
      ]
    }
  ],
};

const compoundInterestHelperInterestRate = 0.2; // 20% interest rate for illustrative purposes
const fiveYearsFromNow = now.plus({ years: 5 }).toSeconds();
/**
 * Compound interest helper. Plotted alongside the classic compound interest formula.
 * 
 * @type {{args: import("../components/RunningCostGraph").Props}}
 */
export const CompoundInterestComponentHelper = Template.bind({});
CompoundInterestComponentHelper.args = {
  startTimeEpochSeconds: now.toSeconds(),
  endTimeEpochSeconds: fiveYearsFromNow,
  seriesDefinitions: [
    {
      label: "compound interest helper evaluating monthly",
      startValue: 100,
      components: [
        /**
         * 5% interest compounded monthly
         */
        compoundInterest({ interestRate: compoundInterestHelperInterestRate, compoundingPeriodMonths: 1 })
      ]
    },
    {
      label: "classic compound interest formula",
      startValue: 100,
      components: [
        {
          formula: ({ lastValue }) => lastValue * Math.pow((1 + (compoundInterestHelperInterestRate / 12)), (12 * 5)),
          timeDeltaEpochSeconds: fiveYearsFromNow - now.toSeconds(),
        }
      ]
    }
  ],
};

const mortgage = 300000;
const monthlyPayments = 2000;
const annualMortgageInterestRate = 0.015; // 1.5% interest rate
const thirtyYearsFromNow = now.plus({ years: 30 }).toSeconds();
/**
 * Example of a mortgage getting repaid and the running cost to repay it
 * 
 * @type {{args: import("../components/RunningCostGraph").Props}}
 */
export const RunningCostPlottedAlongside = Template.bind({});
RunningCostPlottedAlongside.args = {
  startTimeEpochSeconds: now.toSeconds(),
  endTimeEpochSeconds: thirtyYearsFromNow,
  seriesDefinitions: [
    {
      label: "mortgage",
      startValue: mortgage,
      runningCostConfig: {
        plotType: "alongside",
        prefix: "running cost:"
      },
      components: [
        /**
         * Mortgage
         */
        compoundInterest({ interestRate: annualMortgageInterestRate, compoundingPeriodMonths: 1 }),
        {
          nextTime: ({ lastTimeStampEpochSeconds }) => DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ months: 1 }).toSeconds(),
          formula: ({ lastValue }) => {
            /**
             * No-op if there's no remaining cost
             */
            if (lastValue <= 0) {
              return lastValue;
            }

            /**
             * Only pay remainder for the last mortgage payment
             */
            if (lastValue < monthlyPayments) {
              return 0;
            }

            return lastValue - monthlyPayments;
          }
        }
      ]
    }
  ],
};

/**
 * Example of a mortgage getting repaid
 * 
 * @type {{args: import("../components/RunningCostGraph").Props}}
 */
export const RunningCostPlottedAlone = Template.bind({});
RunningCostPlottedAlone.args = {
  startTimeEpochSeconds: now.toSeconds(),
  endTimeEpochSeconds: thirtyYearsFromNow,
  seriesDefinitions: [
    {
      label: "mortgage",
      startValue: mortgage,
      runningCostConfig: {
        plotType: "only",
        prefix: "running cost:"
      },
      components: [
        /**
         * Mortgage
         */
        compoundInterest({ interestRate: annualMortgageInterestRate, compoundingPeriodMonths: 1 }),
        {
          nextTime: ({ lastTimeStampEpochSeconds }) => DateTime.fromSeconds(lastTimeStampEpochSeconds).plus({ months: 1 }).toSeconds(),
          formula: ({ lastValue }) => {
            /**
             * No-op if there's no remaining cost
             */
            if (lastValue <= 0) {
              return lastValue;
            }

            /**
             * Only pay remainder for the last mortgage payment
             */
            if (lastValue < monthlyPayments) {
              return 0;
            }

            return lastValue - monthlyPayments;
          }
        }
      ]
    }
  ],
};
