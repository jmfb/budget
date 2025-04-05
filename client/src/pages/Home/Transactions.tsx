import { useState } from "react";
import { Switch } from "~/components";
import { PendingItems } from "./PendingItems";
import { Transaction } from "./Transaction";
import { TransactionEditorContainer } from "./TransactionEditorContainer";
import { ITransaction, IIncome, IExpense } from "~/models";
import styles from "./Transactions.module.css";

export interface ITransactionsProps {
	variant: "home" | "search";
	onlyShowNewItems: boolean;
	transactions: ITransaction[];
	incomes: IIncome[];
	expenses: IExpense[];
	expenseTransactions: Record<string, ITransaction[]>;
	includePendingItems: boolean;
	setOnlyShowNewItems(value: boolean): void;
}

export function Transactions({
	variant,
	onlyShowNewItems,
	transactions,
	incomes,
	expenses,
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
				(!transaction.expenseName &&
					!transaction.incomeName &&
					!transaction.category),
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
		<div>
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
									incomes={incomes}
									expenses={expenses}
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
		</div>
	);
}
