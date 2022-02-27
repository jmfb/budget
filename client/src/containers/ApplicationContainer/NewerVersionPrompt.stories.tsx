import React from 'react';
import { Story, Meta } from '@storybook/react';
import NewerVersionPrompt, { INewerVersionPromptProps } from './NewerVersionPrompt';
import '~/index.css';

export default {
	title: 'Containers/Application/NewerVersionPrompt',
	component: NewerVersionPrompt,
} as Meta;

const Template: Story<INewerVersionPromptProps> = props =>
	<NewerVersionPrompt {...props} />;

export const SameVersion = Template.bind({});
SameVersion.args = {
	bundleVersion: '1.2.3.4',
	serverBundleVersion: '1.2.3.4'
};

export const NewerVersion = Template.bind({});
NewerVersion.args = {
	bundleVersion: '1.2.3.4',
	serverBundleVersion: '1.2.3.5'
};
