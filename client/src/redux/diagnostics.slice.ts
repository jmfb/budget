import { createSlice } from "@reduxjs/toolkit";
import { IIndexModel } from "~/models";
import { heartbeat } from "./diagnostics.actions";

export interface IDiagnosticsState {
	bundleVersion: string;
	serverBundleVersion: string;
	isHeartbeatInProgress: boolean;
}

function makeInitialState(): IDiagnosticsState {
	const rootContainer = document.getElementById("root");
	const indexModelJson = rootContainer.getAttribute("data-initial-state");
	const indexModel: IIndexModel = JSON.parse(indexModelJson);
	const { bundleVersion } = indexModel;
	return {
		bundleVersion,
		serverBundleVersion: bundleVersion,
		isHeartbeatInProgress: false,
	};
}

const slice = createSlice({
	name: "diagnostics",
	initialState: makeInitialState(),
	reducers: {},
	extraReducers: (builder) =>
		builder
			.addCase(heartbeat.pending, (state) => {
				state.isHeartbeatInProgress = true;
			})
			.addCase(heartbeat.fulfilled, (state, action) => {
				const { bundleVersion } = action.payload;
				state.isHeartbeatInProgress = false;
				state.serverBundleVersion = bundleVersion;
			})
			.addCase(heartbeat.rejected, (state) => {
				state.isHeartbeatInProgress = false;
			}),
});

export const diagnosticsSlice = {
	...slice,
	actions: {
		...slice.actions,
		heartbeat,
	},
};
