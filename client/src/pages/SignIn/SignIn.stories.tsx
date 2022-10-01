import React from 'react';
import { SignIn, ISignInProps } from './SignIn';
import '~/index.css';

export default {
	title: 'Pages/SignIn/Page',
	component: SignIn
};

function Template(props: ISignInProps) {
	return <SignIn {...props} />;
}

export const Default = Template.bind({});

export const SigningIn = Template.bind({});
SigningIn.args = {
	isSigningIn: true
};
