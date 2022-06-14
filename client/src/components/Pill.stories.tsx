import React from 'react';
import { Story, Meta } from '@storybook/react';
import Pill, { IPillProps } from './Pill';
import '~/index.css';

export default {
	title: 'Components/Pill',
	component: Pill
} as Meta;

const Template: Story<IPillProps> = props => (
	<span style={{ display: 'inline-block' }}>
		<Pill {...props}>Example</Pill>
	</span>
);

export const Info = Template.bind({});
Info.args = {
	type: 'info'
};

export const Danger = Template.bind({});
Danger.args = {
	type: 'danger'
};

export const Success = Template.bind({});
Success.args = {
	type: 'success'
};
