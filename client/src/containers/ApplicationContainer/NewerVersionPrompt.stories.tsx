import React from 'react';
import {
	NewerVersionPrompt,
	INewerVersionPromptProps
} from './NewerVersionPrompt';
import '~/index.module.css';

export default {
	title: 'Containers/Application/NewerVersionPrompt',
	component: NewerVersionPrompt
};

function Template(props: INewerVersionPromptProps) {
	return <NewerVersionPrompt {...props} />;
}

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
