import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { Redirect, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PageLoading } from '~/components';
import { useAppSelector, authSlice } from '~/redux';
import queryString from 'query-string';

export default function AuthenticationContainer() {
	const dispatch = useDispatch();
	const { authenticate } = bindActionCreators(authSlice.actions, dispatch);
	const location = useLocation();
	const email = useAppSelector(state => state.auth.email);
	const { code } = queryString.parse(location.search) as { code: string };

	useEffect(() => {
		authenticate(code);
	}, [code]);

	if (email !== undefined || !code) {
		return <Redirect to='/' />;
	}

	return (
		<main>
			<section>
				<PageLoading message='Authenticating...' />
			</section>
		</main>
	);
}
