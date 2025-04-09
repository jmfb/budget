import { createAsyncThunk } from '@reduxjs/toolkit';
import { IState } from './IState';
import * as hub from './diagnostics.hub';

export const heartbeat = createAsyncThunk(
	'diagnostics/heartbeat',
	async (unused, { getState }) => {
		const {
			auth: { accessToken }
		} = getState() as IState;
		return await hub.heartbeat(accessToken);
	},
	{
		condition: (unused, { getState }) => {
			const {
				diagnostics: { isHeartbeatInProgress }
			} = getState() as IState;
			if (isHeartbeatInProgress) {
				return false;
			}
		}
	}
);
