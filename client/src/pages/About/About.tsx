import React from 'react';
import { Link } from 'react-router-dom';
import { MdExitToApp, MdDownload } from 'react-icons/md';
import { Button } from '~/components';
import styles from './About.module.css';

export interface IAboutProps {
	isDownloadingTransactions: boolean;
	downloadTransactions(): void;
}

export function About({
	isDownloadingTransactions,
	downloadTransactions
}: IAboutProps) {
	return (
		<div>
			<h1 className={styles.heading}>
				Jake and Sarah's Budget App
				<Link
					to='/sign-out'
					className={styles['sign-out']}>
					Sign Out
					<MdExitToApp className={styles.exit} />
				</Link>
			</h1>
			<Button
				variant='default'
				icon={MdDownload}
				isProcessing={isDownloadingTransactions}
				onClick={downloadTransactions}>
				Download Transactions (.csv)
			</Button>
		</div>
	);
}
