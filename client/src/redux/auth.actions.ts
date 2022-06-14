import { createAsyncThunk } from '@reduxjs/toolkit';
import * as hub from './auth.hub';

export const readLocalStorage = createAsyncThunk(
	'auth/readLocalStorage',
	() => {
		const email = localStorage.getItem('email');
		if (email === null) {
			localStorage.removeItem('accessToken');
		}
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken === null) {
			return Promise.reject();
		} else {
			return Promise.resolve({ email, accessToken });
		}
	}
);

export const getAuthenticationUrl = createAsyncThunk(
	'auth/getAuthenticationUrl',
	async () => {
		const url = await hub.getAuthenticationUrl();
		window.location.href = url;
		return url;
	}
);

export const authenticate = createAsyncThunk(
	'auth/authenticate',
	async (code: string) => {
		const { email, accessToken } = await hub.signIn(code);
		localStorage.setItem('email', email);
		localStorage.setItem('accessToken', accessToken);
		return { email, accessToken };
	},
	{
		condition: (code: string) => {
			if (!code) {
				return false;
			}
		}
	}
);

export const signOut = createAsyncThunk('auth/signOut', () => {
	localStorage.removeItem('email');
	localStorage.removeItem('accessToken');
	return Promise.resolve();
});
