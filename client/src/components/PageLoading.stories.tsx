import React from 'react';
import { Story, Meta } from '@storybook/react';
import PageLoading, { IPageLoadingProps } from './PageLoading';
import '~/index.css';

export default {
	title: 'Components/PageLoading',
	component: PageLoading
} as Meta;

const Template: Story<IPageLoadingProps> = props =>
	<PageLoading {...props} />;

export const Default = Template.bind({});

export const WithMessage = Template.bind({});
WithMessage.args = {
	message: 'This is a loading message'
};
