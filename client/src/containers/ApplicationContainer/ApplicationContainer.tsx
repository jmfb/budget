import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthorizedApplicationContainer } from './AuthorizedApplicationContainer';
import { IIndexModel } from '~/models';
import { useActions, useAppSelector, authSlice } from '~/redux';

export interface IApplicationContainerProps {
	indexModel: IIndexModel;
}

export default function ApplicationContainer({
	indexModel
}: IApplicationContainerProps) {
	const { readLocalStorage } = useActions(authSlice);
	const redirectToSignIn = useAppSelector(
		state => state.auth.redirectToSignIn
	);
	const url = useAppSelector(state => state.auth.url);
	const email = useAppSelector(state => state.auth.email);

	useEffect(() => {
		readLocalStorage();
	}, []);

	if (redirectToSignIn && url === undefined) {
		return <Navigate to='/sign-in' />;
	}

	if (email === undefined) {
		return null;
	}

	return <AuthorizedApplicationContainer indexModel={indexModel} />;
}
