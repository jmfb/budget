import { ChangeEvent, useState } from "react";
import { Grid, FormControlLabel, Switch } from "@mui/material";
import { VerticalLayout } from "~/components";
import { PendingItems } from "./PendingItems";
import { Transaction } from "./Transaction";
import { TransactionEditorContainer } from "./TransactionEditorContainer";
import { ITransaction, IIncome, IExpense, ICategory } from "~/models";
import styles from "./Transactions.module.css";

export interface ITransactionsProps {
	variant: "home" | "search";
	onlyShowNewItems: boolean;
	transactions: ITransaction[];
	categoryById: Record<number, ICategory>;
	incomeById: Record<number, IIncome>;
	expenseById: Record<number, IExpense>;
	expenseTransactions: Record<number, ITransaction[]>;
	includePendingItems: boolean;
	setOnlyShowNewItems(value: boolean): void;
}

export function Transactions({
	variant,
	onlyShowNewItems,
	transactions,
	categoryById,
	incomeById,
	expenseById,
	expenseTransactions,
	includePendingItems,
	setOnlyShowNewItems,
}: ITransactionsProps) {
	const [showEditor, setShowEditor] = useState(false);
	const [existingTransaction, setExistingTransaction] =
		useState<ITransaction | null>(null);

	const transactionsByDate = transactions
		.filter(
			(transaction) =>
				!onlyShowNewItems ||
				(transaction.expenseId === null &&
					transaction.incomeId === null &&
					transaction.categoryId === null),
		)
		.reduce(
			(map, transaction) => {
				const grouping = map[transaction.date];
				if (grouping === undefined) {
					map[transaction.date] = [transaction];
				} else {
					grouping.push(transaction);
				}
				return map;
			},
			{} as Record<string, ITransaction[]>,
		);

	const handleOnlyShowNewItemsChanged = (
		_: ChangeEvent<HTMLInputElement>,
		newValue: boolean,
	) => {
		setOnlyShowNewItems(newValue);
	};
	const createEditClickedHandler = (transaction: ITransaction) => () => {
		setShowEditor(true);
		setExistingTransaction(transaction);
	};

	const handleCloseEditor = () => {
		setShowEditor(false);
		setExistingTransaction(null);
	};

	return (
		<VerticalLayout gap="small">
			{includePendingItems && <PendingItems />}
			{variant === "home" && (
				<Grid
					container
					direction="row"
					justifyContent="flex-end"
					width="100%"
				>
					<FormControlLabel
						label="Only show new items"
						control={
							<Switch
								checked={onlyShowNewItems}
								onChange={handleOnlyShowNewItemsChanged}
							/>
						}
					/>
				</Grid>
			)}
			{Object.keys(transactionsByDate)
				.sort((a, b) => -a.localeCompare(b))
				.map((date) => (
					<div key={date}>
						<div className={styles.date}>{date}</div>
						{transactionsByDate[date]
							.sort((a, b) => a.id - b.id)
							.sort((a, b) => a.amount - b.amount)
							.map((transaction) => (
								<Transaction
									key={transaction.id}
									transaction={transaction}
									categoryById={categoryById}
									incomeById={incomeById}
									expenseById={expenseById}
									expenseTransactions={expenseTransactions}
									onEdit={createEditClickedHandler(
										transaction,
									)}
								/>
							))}
					</div>
				))}
			{showEditor && (
				<TransactionEditorContainer
					transaction={existingTransaction!}
					onClose={handleCloseEditor}
				/>
			)}
		</VerticalLayout>
	);
}
