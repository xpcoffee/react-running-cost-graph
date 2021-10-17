import { DateTime, Interval } from "luxon";
import React from "react";

import { RunningCostGraph } from "../RunningCostGraph";

export default {
  title: "RunningCostGraph",
  component: RunningCostGraph,
};

const Template = (args) => <RunningCostGraph {...args} />;
const daysInSeconds = (days) => days*60*60*24 

export const Default = Template.bind({});
Default.args = {
  seriesDefinitions: [
    {
      label: "one",
      formula: (value) => value + 1,
      startValue: 0,
      startTimeEpochSeconds: DateTime.now().toSeconds(),
      numberOfSteps: 10,
      timeDeltaEpochSeconds: daysInSeconds(5)
    },
    {
      label: "two",
      formula: (value) => value + 3,
      startValue: 0,
      startTimeEpochSeconds: DateTime.now().toSeconds(),
      numberOfSteps: 15,
      timeDeltaEpochSeconds: daysInSeconds(3),
    },
  ],
};
