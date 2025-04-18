import { useState } from "react";
import { Switch, VerticalLayout } from "~/components";
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
				<div className={styles.onlyShowNewItems}>
					<Switch
						checked={onlyShowNewItems}
						onChange={setOnlyShowNewItems}
					>
						Only show new items
					</Switch>
				</div>
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
