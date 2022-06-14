import React from 'react';
import { Story, Meta } from '@storybook/react';
import Button, { IButtonProps } from './Button';
import '~/index.css';

export default {
	title: 'Components/Button',
	component: Button
} as Meta;

const Template: Story<IButtonProps> = props => (
	<Button {...props}>Example</Button>
);

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
	isDisabled: true
};

export const Processing = Template.bind({});
Processing.args = {
	isDisabled: true,
	isProcessing: true
};
