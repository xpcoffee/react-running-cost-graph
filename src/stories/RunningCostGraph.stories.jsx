import React from "react";

import { RunningCostGraph } from "../RunningCostGraph";

export default {
  title: "RunningCostGraph",
  component: RunningCostGraph,
};

const Template = (args) => <RunningCostGraph {...args} />;

export const Default = Template.bind({});
Default.args = {
  seriesDefinitions: [
    {
      label: "one",
      formula: (value) => value + 1,
      startValue: 0,
      startTimeEpochSeconds: 0,
      numberOfSteps: 10,
      timeDeltaEpochSeconds: 5,
    },
    {
      label: "two",
      formula: (value) => value + 3,
      startValue: 0,
      startTimeEpochSeconds: 0,
      numberOfSteps: 10,
      timeDeltaEpochSeconds: 5,
    },
  ],
};
