import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthorizedApplicationContainer } from './AuthorizedApplicationContainer';
import { IIndexModel } from '~/models';
import { useAppSelector, authSlice } from '~/redux';

export interface IApplicationContainerProps {
	indexModel: IIndexModel;
}

export default function ApplicationContainer({
	indexModel
}: IApplicationContainerProps) {
	const dispatch = useDispatch();
	const { readLocalStorage } = bindActionCreators(
		authSlice.actions,
		dispatch
	);
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

	return <AuthorizedApplicationContainer {...{ indexModel }} />;
}
