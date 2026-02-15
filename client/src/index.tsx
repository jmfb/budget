import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { MuiProvider } from "./MuiProvider";
import { PageLoading } from "~/components";
import {
	ErrorBoundaryContainer,
	SignInContainer,
	AuthenticateContainer,
	ApplicationContainer,
} from "~/pages";
import { createStore } from "~/redux";
import "@csstools/normalize.css";
import "./index.css";

function start() {
	const store = createStore();
	const rootContainer = document.getElementById("root");
	if (!rootContainer) {
		throw new Error("Missing root element");
	}
	const rootElement = (
		<Provider store={store}>
			<MuiProvider>
				<BrowserRouter>
					<ErrorBoundaryContainer>
						<Suspense fallback={<PageLoading />}>
							<Routes>
								<Route
									path="/sign-in"
									element={<SignInContainer />}
								/>
								<Route
									path="/authenticate"
									element={<AuthenticateContainer />}
								/>
								<Route
									path="*"
									element={<ApplicationContainer />}
								/>
							</Routes>
						</Suspense>
					</ErrorBoundaryContainer>
				</BrowserRouter>
			</MuiProvider>
		</Provider>
	);
	createRoot(rootContainer).render(rootElement);
}

start();
