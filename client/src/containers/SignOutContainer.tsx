import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSlice } from '~/redux';

export default function SignOutContainer() {
	const dispatch = useDispatch();
	const { signOut } = bindActionCreators(authSlice.actions, dispatch);

	useEffect(() => {
		signOut();
	}, []);

	return <Navigate to='/sign-in' />;
}
