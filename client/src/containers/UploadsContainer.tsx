import React, { useEffect } from 'react';
import { Uploads } from '~/pages';
import { useActions, useAppSelector, budgetSlice } from '~/redux';
import { dateService } from '~/services';

export default function UploadsContainer() {
	const {
		getAllText,
		parseCsv,
		mergeTransaction,
		clearUpload,
		clearLogs,
		getBudget
	} = useActions(budgetSlice);
	const isReadingFile = useAppSelector(state => state.budget.isReadingFile);
	const readingFileSuccess = useAppSelector(
		state => state.budget.readingFileSuccess
	);
	const fileText = useAppSelector(state => state.budget.fileText);
	const isParsingCsv = useAppSelector(state => state.budget.isParsingCsv);
	const parsingCsvSuccess = useAppSelector(
		state => state.budget.parsingCsvSuccess
	);
	const csvRecords = useAppSelector(state => state.budget.csvRecords);
	const isMergingTransaction = useAppSelector(
		state => state.budget.isMergingTransaction
	);
	const mergingTransactionSuccess = useAppSelector(
		state => state.budget.mergingTransactionSuccess
	);
	const weeklyTransactions = useAppSelector(
		state => state.budget.weeklyTransactions
	);
	const logs = useAppSelector(state => state.budget.logs);

	const isLoading = Object.keys(weeklyTransactions).some(
		weekOf => weeklyTransactions[weekOf].isLoading
	);

	useEffect(() => {
		getBudget(dateService.getStartOfCurrentWeek());
	}, []);

	return (
		<Uploads
			{...{
				isReadingFile,
				readingFileSuccess,
				fileText,
				isParsingCsv,
				parsingCsvSuccess,
				csvRecords,
				isMergingTransaction,
				mergingTransactionSuccess,
				isLoading,
				logs,
				getAllText,
				parseCsv,
				mergeTransaction,
				clearUpload,
				clearLogs
			}}
		/>
	);
}
