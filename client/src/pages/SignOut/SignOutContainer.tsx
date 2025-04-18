import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useActions, authSlice } from "~/redux";

export function SignOutContainer() {
	const { signOut } = useActions(authSlice);

	useEffect(() => {
		signOut();
	}, []);

	return <Navigate to="/sign-in" />;
}
