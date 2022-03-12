import React, { useEffect, useState } from 'react';
import { FileInput, PageLoading, Button } from '~/components';
import { budgetService } from '~/services';
import { ITransaction } from '~/models';
import styles from './Uploads.css';

export interface IUploadsProps {
	isReadingFile: boolean;
	readingFileSuccess: boolean;
	fileText: string;
	isParsingCsv: boolean;
	parsingCsvSuccess: boolean;
	csvRecords: string[][];
	isMergingTransaction: boolean;
	mergingTransactionSuccess: boolean;
	getAllText(file: File): void;
	parseCsv(fileText: string): void;
	mergeTransaction(transaction: ITransaction): void;
	clearUpload(): void;
}

export default function Uploads({
	isReadingFile,
	readingFileSuccess,
	fileText,
	isParsingCsv,
	parsingCsvSuccess,
	csvRecords,
	isMergingTransaction,
	mergingTransactionSuccess,
	getAllText,
	parseCsv,
	mergeTransaction,
	clearUpload
}: IUploadsProps) {
	const [isMergingBank, setIsMergingBank] = useState(false);
	const [isMergingCapitalOne, setIsMergingCapitalOne] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadIndex, setUploadIndex] = useState<number>(null);

	const handleUploadBank = (file: File) => {
		setIsMergingBank(true);
		getAllText(file);
	};

	const handleUploadCapitalOne = (file: File) => {
		setIsMergingCapitalOne(true);
		getAllText(file);
	};

	const finishUpload = () => {
		clearUpload();
		setIsMergingCapitalOne(false);
		setIsMergingBank(false);
		setIsUploading(false);
		setUploadIndex(null);
	};

	const handleMergeClicked = () => {
		if (csvRecords.length === 0) {
			finishUpload();
		} else {
			setIsUploading(true);
			setUploadIndex(0);
		}
	};

	const isMerging = isMergingBank || isMergingCapitalOne;

	useEffect(() => {
		clearUpload();
		return clearUpload;
	}, []);

	useEffect(() => {
		if (isMerging && !isReadingFile && readingFileSuccess) {
			parseCsv(fileText);
		}
	}, [isMerging, isReadingFile, readingFileSuccess]);

	useEffect(() => {
		if (uploadIndex !== null) {
			if (uploadIndex >= csvRecords.length) {
				finishUpload();
			} else {
				const csvRecord = csvRecords[uploadIndex];
				if (isMergingBank) {
					const bankRecord = budgetService.parseBankRecord(csvRecord);
					const transaction = budgetService.convertBankRecordToTransaction(bankRecord);
					if (budgetService.isCapitalOneDebit(transaction)) {
						setUploadIndex(uploadIndex + 1);
					} else {
						mergeTransaction(transaction);
					}
				} else if (isMergingCapitalOne) {
					const capitalOneRecord = budgetService.parseCapitalOneRecord(csvRecord);
					const transaction = budgetService.convertCapitalOneRecordToTransaction(capitalOneRecord);
					if (budgetService.isCapitalOneCredit(transaction)) {
						setUploadIndex(uploadIndex + 1);
					} else {
						mergeTransaction(transaction);
					}
				} else {
					finishUpload();
				}
			}
		}
	}, [uploadIndex]);

	useEffect(() => {
		if (isUploading && !isMergingTransaction && mergingTransactionSuccess) {
			setUploadIndex(uploadIndex + 1);
		}
	}, [isUploading, isMergingTransaction, mergingTransactionSuccess]);

	return (
		<div>
			{!isMerging &&
				<div className={styles.uploadButtons}>
					<div className={styles.bankButton}>
						<FileInput
							accept='*.csv'
							onClick={handleUploadBank}>
							Upload Bank Export
						</FileInput>
					</div>
					<div className={styles.capitalOneButton}>
						<FileInput
							accept='*.csv'
							onClick={handleUploadCapitalOne}>
							Upload Capital One Export
						</FileInput>
					</div>
				</div>
			}
			{isReadingFile &&
				<PageLoading message='Loading export file' />
			}
			{isParsingCsv &&
				<PageLoading message='Parsing csv records' />
			}
			{isMerging &&
				<>
					<div className={styles.mergeRow}>
						<Button
							isDisabled={!parsingCsvSuccess || isUploading}
							isProcessing={isUploading}
							onClick={handleMergeClicked}>
							Merge Transactions
						</Button>
						{parsingCsvSuccess && !isUploading &&
							<div className={styles.mergeLabel}>{csvRecords.length} transactions to import</div>
						}
						{isUploading &&
							<progress
								className={styles.progress}
								max={csvRecords.length}
								value={uploadIndex}
								/>
						}
					</div>
					{readingFileSuccess &&
						<pre className={styles.preview}>
							{fileText}
						</pre>
					}
				</>
			}
		</div>
	);
}
