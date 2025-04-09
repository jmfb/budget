import React from 'react';
import { Link } from 'react-router-dom';
import { MdExitToApp, MdDownload } from 'react-icons/md';
import { Button } from '~/components';
import styles from './About.module.css';

export interface IAboutProps {
	isDownloadingTransactions: boolean;
	isDownloadingPendingItems: boolean;
	isDownloadingExpenses: boolean;
	isDownloadingIncomes: boolean;
	downloadTransactions(): void;
	downloadPendingItems(): void;
	downloadExpenses(): void;
	downloadIncomes(): void;
}

export function About({
	isDownloadingTransactions,
	isDownloadingPendingItems,
	isDownloadingExpenses,
	isDownloadingIncomes,
	downloadTransactions,
	downloadPendingItems,
	downloadExpenses,
	downloadIncomes
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
			<div className={styles['download-buttons']}>
				<Button
					variant='default'
					icon={MdDownload}
					isProcessing={isDownloadingTransactions}
					onClick={downloadTransactions}>
					Download Transactions (.csv)
				</Button>
				<Button
					variant='default'
					icon={MdDownload}
					isProcessing={isDownloadingPendingItems}
					onClick={downloadPendingItems}>
					Download Pending Items (.csv)
				</Button>
				<Button
					variant='default'
					icon={MdDownload}
					isProcessing={isDownloadingExpenses}
					onClick={downloadExpenses}>
					Download Expenses (.csv)
				</Button>
				<Button
					variant='default'
					icon={MdDownload}
					isProcessing={isDownloadingIncomes}
					onClick={downloadIncomes}>
					Download Incomes (.csv)
				</Button>
			</div>
		</div>
	);
}
