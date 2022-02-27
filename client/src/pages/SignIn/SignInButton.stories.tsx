import React from 'react';
import { Story, Meta } from '@storybook/react';
import SignInButton, { ISignInButtonProps } from './SignInButton';
import '~/index.css';

export default {
	title: 'Pages/SignIn/SignInButton',
	component: SignInButton
} as Meta;

const Template: Story<ISignInButtonProps> = props =>
	<SignInButton {...props} />;

export const Light = Template.bind({});
Light.args = {
	style: 'light'
};

export const LightDisabled = Template.bind({});
LightDisabled.args = {
	style: 'light',
	isDisabled: true
};

export const Dark = Template.bind({});
Dark.args = {
	style: 'dark'
};

export const DarkDisabled = Template.bind({});
DarkDisabled.args = {
	style: 'light',
	isDisabled: true
};
