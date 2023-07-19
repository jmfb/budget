import React from 'react';
import { Uploads } from '~/pages';
import { useActions, useAppSelector, budgetSlice } from '~/redux';

export default function UploadsContainer() {
	const { getAllText, parseCsv, mergeTransaction, clearUpload, clearLogs } =
		useActions(budgetSlice);
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
		state => state.transactions.weeks
	);
	const logs = useAppSelector(state => state.budget.logs);

	const isLoading = Object.keys(weeklyTransactions).some(
		weekOf => weeklyTransactions[weekOf].isLoading
	);

	return (
		<Uploads
			isReadingFile={isReadingFile}
			readingFileSuccess={readingFileSuccess}
			fileText={fileText}
			isParsingCsv={isParsingCsv}
			parsingCsvSuccess={parsingCsvSuccess}
			csvRecords={csvRecords}
			isMergingTransaction={isMergingTransaction}
			mergingTransactionSuccess={mergingTransactionSuccess}
			isLoading={isLoading}
			logs={logs}
			getAllText={getAllText}
			parseCsv={parseCsv}
			mergeTransaction={mergeTransaction}
			clearUpload={clearUpload}
			clearLogs={clearLogs}
		/>
	);
}
