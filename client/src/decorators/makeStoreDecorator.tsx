import { createElement } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { rootReducer, IState } from "~/redux";

export function makeStoreDecorator(configure?: (state: IState) => void) {
	const initialState = rootReducer(undefined, { type: "" }) as IState;
	const state = JSON.parse(JSON.stringify(initialState));
	configure?.(state);
	const store = configureStore({
		preloadedState: state,
		reducer: rootReducer,
	});
	return (Story: any, context: any) => (
		<Provider store={store}>{createElement(Story, context)}</Provider>
	);
}
