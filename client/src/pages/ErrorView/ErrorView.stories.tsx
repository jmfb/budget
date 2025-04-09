import React from 'react';
import { ErrorView, IErrorViewProps } from './ErrorView';
import '~/index.module.css';

export default {
	title: 'Pages/ErrorView/Page',
	component: ErrorView
};

function Template(props: IErrorViewProps) {
	return <ErrorView {...props} />;
}

export const Default = Template.bind({});
Default.args = {
	action: 'Example Action',
	message: 'This is an error message'
};

export const WithContext = Template.bind({});
WithContext.args = {
	action: 'Example Action',
	message: 'This is an error message',
	context:
		'This is some context about the error\n' +
		'That can be multiple lines\n' +
		'And is usually a fixed width.'
};
