import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PageLoading } from "~/components";
import { ErrorBoundaryContainer } from "~/containers/ErrorBoundary";
import { IIndexModel } from "./models";
import { createStore } from "~/redux";
import "@csstools/normalize.css";
import "./index.module.css";

function start() {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const AsyncSignInContainer = lazy(
		() =>
			import(
				/* webpackChunkName: 'SignInContainer' */ "~/containers/SignInContainer"
			),
	);
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const AsyncAuthenticateContainer = lazy(
		() =>
			import(
				/* webpackChunkName: 'AuthenticateContainer' */ "~/containers/AuthenticateContainer"
			),
	);
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const AsyncApplicationContainer = lazy(
		() =>
			import(
				/* webpackChunkName: 'ApplicationContainer' */ "~/containers/ApplicationContainer"
			),
	);

	const store = createStore();
	const rootContainer = document.getElementById("root");
	const indexModelJson = rootContainer.getAttribute("data-initial-state");
	const indexModel: IIndexModel = JSON.parse(indexModelJson);
	const rootElement = (
		<Provider store={store}>
			<BrowserRouter>
				<ErrorBoundaryContainer>
					<Suspense fallback={<PageLoading />}>
						<Routes>
							<Route
								path="/sign-in"
								element={<AsyncSignInContainer />}
							/>
							<Route
								path="/authenticate"
								element={<AsyncAuthenticateContainer />}
							/>
							<Route
								path="*"
								element={
									<AsyncApplicationContainer
										indexModel={indexModel}
									/>
								}
							/>
						</Routes>
					</Suspense>
				</ErrorBoundaryContainer>
			</BrowserRouter>
		</Provider>
	);
	createRoot(rootContainer).render(rootElement);
}

start();
