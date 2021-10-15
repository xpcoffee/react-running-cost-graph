import React from 'react';

import { RunningCostGraph } from './RunningCostGraph';

export default {
  title: 'Example/Button',
  component: RunningCostGraph,
};

const Template = (args) => <RunningCostGraph {...args} />;

export const Default = Template.bind({});
Default.args = {};
