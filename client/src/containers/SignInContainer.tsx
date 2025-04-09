import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { SignIn } from '~/pages';
import { useActions, useAppSelector, authSlice } from '~/redux';

export default function SignInContainer() {
	const { signOut, getAuthenticationUrl } = useActions(authSlice);
	const isSigningIn = useAppSelector(state => state.auth.isSigningIn);
	const url = useAppSelector(state => state.auth.url);

	useEffect(() => {
		signOut();
	}, []);

	const handleSignInClicked = () => {
		getAuthenticationUrl();
	};

	if (url !== undefined) {
		return <Navigate to={url} />;
	}

	return (
		<SignIn
			isSigningIn={isSigningIn}
			onClickSignIn={handleSignInClicked}
		/>
	);
}
