import React, { useEffect, useState } from 'react';
import { FileInput } from '~/components';
import { ITransaction } from '~/models';
import { budgetService } from '~/services';

export interface IUploaderProps {
	isMerging: boolean;
	mergeTransactions(transactions: ITransaction[]): void;
}

export default function Uploader({
	isMerging,
	mergeTransactions
}: IUploaderProps) {
	const [isMergingBank, setIsMergingBank] = useState(false);
	const [isMergingCapitalOne, setIsMergingCapitalOne] = useState(false);

	const handleUploadBank = async (file: File) => {
		setIsMergingBank(true);
		mergeTransactions(await budgetService.parseBankCsv(file));
	};

	const handleUploadCapitalOne = async (file: File) => {
		setIsMergingCapitalOne(true);
		mergeTransactions(await budgetService.parseCapitalOneCsv(file));
	};

	useEffect(() => {
		if (!isMerging) {
			if (isMergingBank) {
				setIsMergingBank(false);
			}
			if (isMergingCapitalOne) {
				setIsMergingCapitalOne(false);
			}
		}
	}, [isMerging, isMergingBank, isMergingCapitalOne]);

	return (
		<div>
			<FileInput
				accept='*.csv'
				isDisabled={isMerging}
				isProcessing={isMergingBank}
				onClick={handleUploadBank}>
				Upload Bank Export
			</FileInput>
			<FileInput
				accept='*.csv'
				isDisabled={isMerging}
				isProcessing={isMergingCapitalOne}
				onClick={handleUploadCapitalOne}>
				Upload Capital One Export
			</FileInput>
		</div>
	);
}
