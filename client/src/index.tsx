import React, { Suspense, lazy } from 'react';
import { render } from 'react-dom';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PageLoading } from '~/components';
import ErrorBoundary from '~/containers/ErrorBoundary';
import { createStore } from '~/redux';
import './index.css';

function start() {
	const asyncSignInContainer = lazy(() =>
		import(/* webpackChunkName: 'SignInContainer' */ '~/containers/SignInContainer'));
	const asyncAuthenticateContainer = lazy(() =>
		import(/* webpackChunkName: 'AuthenticateContainer' */ '~/containers/AuthenticateContainer'));
	const asyncApplicationContainer = lazy(() =>
		import(/* webpackChunkName: 'ApplicationContainer' */ '~/containers/ApplicationContainer'));

	const store = createStore();
	const rootContainer = document.getElementById('root');
	const rootElement =
		<Provider {...{store}}>
			<BrowserRouter>
				<ErrorBoundary>
					<Suspense fallback={<PageLoading />}>
						<Switch>
							<Route path='/sign-in' component={asyncSignInContainer} />
							<Route path='/authenticate' component={asyncAuthenticateContainer} />
							<Route component={asyncApplicationContainer} />
						</Switch>
					</Suspense>
				</ErrorBoundary>
			</BrowserRouter>
		</Provider>;
	render(rootElement, rootContainer);
}

start();
