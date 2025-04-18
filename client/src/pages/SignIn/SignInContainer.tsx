import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { SignIn } from "./SignIn";
import { useActions, useAppSelector, authSlice } from "~/redux";

export function SignInContainer() {
	const { signOut, getAuthenticationUrl } = useActions(authSlice);
	const isSigningIn = useAppSelector((state) => state.auth.isSigningIn);
	const url = useAppSelector((state) => state.auth.url);

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
		<SignIn isSigningIn={isSigningIn} onClickSignIn={handleSignInClicked} />
	);
}
