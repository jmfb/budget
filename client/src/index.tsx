import { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PageLoading } from "~/components";
import { ErrorBoundaryContainer } from "~/containers/ErrorBoundary";
import { createStore } from "~/redux";
import "@csstools/normalize.css";
import "./index.css";

function start() {
	const AsyncSignInContainer = lazy(
		() => import("~/containers/SignInContainer"),
	);
	const AsyncAuthenticateContainer = lazy(
		() => import("~/containers/AuthenticateContainer"),
	);
	const AsyncApplicationContainer = lazy(
		() => import("~/containers/ApplicationContainer"),
	);

	const store = createStore();
	const rootContainer = document.getElementById("root");
	if (!rootContainer) {
		throw new Error("Missing root element");
	}
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
								element={<AsyncApplicationContainer />}
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
