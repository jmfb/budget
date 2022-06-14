import { createSlice } from '@reduxjs/toolkit';
import {
	readLocalStorage,
	getAuthenticationUrl,
	authenticate,
	signOut
} from './auth.actions';

export interface IAuthState {
	email?: string;
	accessToken?: string;
	redirectToSignIn: boolean;
	isSigningIn: boolean;
	url?: string;
}

const initialState: IAuthState = {
	email: undefined,
	accessToken: undefined,
	redirectToSignIn: false,
	isSigningIn: false,
	url: undefined
};

const slice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: builder =>
		builder
			.addCase(readLocalStorage.fulfilled, (state, action) => {
				const { email, accessToken } = action.payload;
				state.email = email;
				state.accessToken = accessToken;
				state.redirectToSignIn = false;
			})
			.addCase(readLocalStorage.rejected, state => {
				state.redirectToSignIn = true;
			})

			.addCase(getAuthenticationUrl.pending, state => {
				state.isSigningIn = true;
			})
			.addCase(getAuthenticationUrl.fulfilled, (state, action) => {
				state.isSigningIn = false;
				state.url = action.payload;
			})
			.addCase(getAuthenticationUrl.rejected, state => {
				state.isSigningIn = false;
			})

			.addCase(signOut.fulfilled, state => {
				Object.assign(state, initialState);
			})

			.addCase(authenticate.pending, state => {
				state.isSigningIn = false;
				state.redirectToSignIn = false;
				state.url = undefined;
			})
			.addCase(authenticate.fulfilled, (state, action) => {
				const { email, accessToken } = action.payload;
				state.email = email;
				state.accessToken = accessToken;
			})
});

export default {
	...slice,
	actions: {
		...slice.actions,
		readLocalStorage,
		getAuthenticationUrl,
		authenticate,
		signOut
	}
};
