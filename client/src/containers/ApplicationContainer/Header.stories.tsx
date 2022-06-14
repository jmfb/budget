import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Meta, Story } from '@storybook/react';
import Header, { IHeaderProps } from './Header';
import '~/index.css';

export default {
	title: 'Containers/Application/Header',
	component: Header
} as Meta;

const Template: Story<IHeaderProps> = props => (
	<BrowserRouter>
		<Header {...props} />
	</BrowserRouter>
);

export const Default = Template.bind({});
Default.args = {};
