import React from 'react';
import { FileInput } from '~/components';
import { IWeeklyTransactionsByWeekOf, ITransaction } from '~/models';
import { budgetService } from '~/services';

export interface IUploaderProps {
	weeklyTransactions: IWeeklyTransactionsByWeekOf;
	isSavingTransaction: boolean;
	savingTransactionSuccess: boolean;
	saveTransaction(transaction: ITransaction): void;
	clearTransactionSave(): void;
	getWeeklyTransactions(weekOf: string): void;
}

export default function Uploader({
	weeklyTransactions,
	isSavingTransaction,
	savingTransactionSuccess,
	saveTransaction,
	clearTransactionSave,
	getWeeklyTransactions
}: IUploaderProps) {
	const handleUploadBank = async (file: File) => {
		const records = await budgetService.parseBankCsv(file);
		console.log(records);
	};

	return (
		<div>
			<FileInput accept='*.csv' onClick={handleUploadBank}>Upload Bank Export</FileInput>
		</div>
	);
}
