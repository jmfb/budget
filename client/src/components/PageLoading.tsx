import React from 'react';
import { LoadingIcon } from './LoadingIcon';
import styles from './PageLoading.css';

export interface IPageLoadingProps {
	message?: string;
}

export function PageLoading({ message }: IPageLoadingProps) {
	return (
		<>
			{message && <div className={styles.message}>{message}</div>}
			<div className={styles.loading}>
				<LoadingIcon />
			</div>
		</>
	);
}
