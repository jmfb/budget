import React from 'react';
import { PageLoading, IPageLoadingProps } from './PageLoading';
import '~/index.module.css';

export default {
	title: 'Components/PageLoading',
	component: PageLoading
};

function Template(props: IPageLoadingProps) {
	return <PageLoading {...props} />;
}

export const Default = Template.bind({});

export const WithMessage = Template.bind({});
WithMessage.args = {
	message: 'This is a loading message'
};
