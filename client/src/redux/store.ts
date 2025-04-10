import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { IState } from "./IState";

export function createStore() {
	return configureStore<IState>({ reducer: rootReducer });
}
