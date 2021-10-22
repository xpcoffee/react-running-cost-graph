import { DateTime } from "luxon";
import React from "react";

import { RunningCostGraph } from "../RunningCostGraph";

export default {
  title: "RunningCostGraph",
  component: RunningCostGraph,
};

/**
 * The template to use to define Storybook examples.
 * @param {import("../RunningCostGraph").Props} args 
 */
const Template = (args) => <RunningCostGraph {...args} />;

/**
 * Returns the number of seconds for a given number of days.
 * @param {number} days 
 */
const daysInSeconds = (days) => days * 60 * 60 * 24

/**
 * Default example.
 */
export const Default = Template.bind({});
Default.args = {
  startTimeEpochSeconds: DateTime.now().toSeconds(),
  endTimeEpochSeconds: DateTime.now().plus({ days: 30 }).toSeconds(),
  seriesDefinitions: [
    {
      label: "one",
      formula: (value) => value + 1,
      startValue: 0,
      timeDeltaEpochSeconds: daysInSeconds(5)
    },
    {
      label: "two",
      formula: (value) => value + 3,
      startValue: 0,
      timeDeltaEpochSeconds: daysInSeconds(3),
    },
  ],
};
