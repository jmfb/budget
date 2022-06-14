import React from 'react';
import { Story, Meta } from '@storybook/react';
import SignIn, { ISignInProps } from './SignIn';
import '~/index.css';

export default {
	title: 'Pages/SignIn/Page',
	component: SignIn
} as Meta;

const Template: Story<ISignInProps> = props => <SignIn {...props} />;

export const Default = Template.bind({});

export const SigningIn = Template.bind({});
SigningIn.args = {
	isSigningIn: true
};
