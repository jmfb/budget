import React, { lazy, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './Header';
import NewerVersionPrompt from './NewerVersionPrompt';
import { useAppSelector, authSlice, diagnosticsSlice } from '~/redux';
import { useInterval } from '~/hooks';

// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncHomeContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'HomeContainer' */ '~/containers/HomeContainer'
		)
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncStatisticsContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'StatisticsContainer' */ '~/containers/StatisticsContainer'
		)
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncIncomesContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'IncomesContainer' */ '~/containers/IncomesContainer'
		)
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncExpensesContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'ExpensesContainer' */ '~/containers/ExpensesContainer'
		)
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncUploadsContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'UploadsContainer' */ '~/containers/UploadsContainer'
		)
);
// eslint-disable-next-line @typescript-eslint/naming-convention
const AsyncSignOutContainer = lazy(
	() =>
		import(
			/* webpackChunkName: 'SignOutContainer' */ '~/containers/SignOutContainer'
		)
);

export default function ApplicationContainer() {
	const dispatch = useDispatch();
	const { readLocalStorage } = bindActionCreators(
		authSlice.actions,
		dispatch
	);
	const { heartbeat } = bindActionCreators(
		diagnosticsSlice.actions,
		dispatch
	);
	const redirectToSignIn = useAppSelector(
		state => state.auth.redirectToSignIn
	);
	const url = useAppSelector(state => state.auth.url);
	const email = useAppSelector(state => state.auth.email);
	const bundleVersion = useAppSelector(
		state => state.diagnostics.bundleVersion
	);
	const serverBundleVersion = useAppSelector(
		state => state.diagnostics.serverBundleVersion
	);

	useEffect(() => {
		readLocalStorage();
	}, []);

	useInterval(() => {
		heartbeat();
	}, 60_000);

	const handleRefreshClicked = () => {
		window.location.reload();
	};

	if (redirectToSignIn && url === undefined) {
		return <Navigate to='/sign-in' />;
	}

	if (email === undefined) {
		return null;
	}

	return (
		<>
			<Header />
			<main>
				<section>
					<Routes>
						<Route
							path='/'
							element={<AsyncHomeContainer />}
						/>
						<Route
							path='/statistics'
							element={<AsyncStatisticsContainer />}
						/>
						<Route
							path='/incomes'
							element={<AsyncIncomesContainer />}
						/>
						<Route
							path='/expenses'
							element={<AsyncExpensesContainer />}
						/>
						<Route
							path='/uploads'
							element={<AsyncUploadsContainer />}
						/>
						<Route
							path='/sign-out'
							element={<AsyncSignOutContainer />}
						/>
						<Route
							path='*'
							element={<Navigate to='/' />}
						/>
					</Routes>
					<NewerVersionPrompt
						{...{
							bundleVersion,
							serverBundleVersion
						}}
						onClickRefresh={handleRefreshClicked}
					/>
				</section>
			</main>
		</>
	);
}
