import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoading } from '~/components';
import { useActions, useAppSelector, authSlice } from '~/redux';
import queryString from 'query-string';

export default function AuthenticationContainer() {
	const { authenticate } = useActions(authSlice);
	const location = useLocation();
	const email = useAppSelector(state => state.auth.email);
	const { code } = queryString.parse(location.search) as { code: string };

	useEffect(() => {
		authenticate(code);
	}, [code]);

	if (email !== undefined || !code) {
		return <Navigate to='/' />;
	}

	return (
		<main className='responsive'>
			<section>
				<PageLoading message='Authenticating...' />
			</section>
		</main>
	);
}
