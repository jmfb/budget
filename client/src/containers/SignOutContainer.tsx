import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authSlice } from '~/redux';

export default function SignOutContainer() {
	const dispatch = useDispatch();
	const { signOut } = bindActionCreators(authSlice.actions, dispatch);

	useEffect(() => {
		signOut();
	}, []);

	return (
		<Redirect to='/sign-in' />
	);
}
