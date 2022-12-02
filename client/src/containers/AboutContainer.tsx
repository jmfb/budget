import React from 'react';
import { useAppSelector, useActions, transactionsSlice } from '~/redux';
import { About } from '~/pages/About/About';

export default function AboutContainer() {
	const { downloadTransactions } = useActions(transactionsSlice);
	const isDownloadingTransactions = useAppSelector(
		state => state.transactions.isDownloading
	);
	return <About {...{ isDownloadingTransactions, downloadTransactions }} />;
}
