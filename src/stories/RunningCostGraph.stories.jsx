import { DateTime } from "luxon";
import React from "react";

import { RunningCostGraph } from "..";

export default {
  title: "RunningCostGraph",
  component: RunningCostGraph,
};

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
export const Default = Template.bind({});
Default.args = {
  startTimeEpochSeconds: DateTime.now().toSeconds(),
  endTimeEpochSeconds: DateTime.now().plus({ days: 30 }).toSeconds(),
  seriesDefinitions: [
    {
      label: "one",
      startValue: 0,
      components: [
        {
          formula: (value) => value + 1,
          timeDeltaEpochSeconds: daysInSeconds(5)
        }
      ]
    },
    {
      label: "two",
      startValue: 0,
      components: [
        {
          formula: (value) => value + 3,
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
export const MultipleComponents = Template.bind({});
MultipleComponents.args = {
  startTimeEpochSeconds: DateTime.now().toSeconds(),
  endTimeEpochSeconds: DateTime.now().plus({ days: 30 }).toSeconds(),
  seriesDefinitions: [
    {
      label: "one + two",
      startValue: 0,
      components: [
        {
          formula: (value) => value + 1,
          timeDeltaEpochSeconds: daysInSeconds(5)
        },
        {
          formula: (value) => value + 3,
          timeDeltaEpochSeconds: daysInSeconds(3),
        }
      ]
    }
  ],
};
