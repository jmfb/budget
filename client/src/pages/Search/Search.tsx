import { Grid, TextField } from "@mui/material";
import { NoResults, PageLoading } from "~/components";
import { Transactions } from "~/pages/Home/Transactions";
import { ICategory, IExpense, IIncome, ITransaction } from "~/models";
import { ChangeEvent } from "react";

export interface ISearchProps {
	searchQuery: string;
	isLoading: boolean;
	categoryById: Record<number, ICategory>;
	incomeById: Record<number, IIncome>;
	expenseById: Record<number, IExpense>;
	expenseTransactions: Record<string, ITransaction[]>;
	transactions: ITransaction[];
	onUpdateSearch(searchQuery: string): void;
}

export function Search({
	searchQuery,
	isLoading,
	categoryById,
	incomeById,
	expenseById,
	expenseTransactions,
	transactions,
	onUpdateSearch,
}: ISearchProps) {
	const handleSearchChanged = (event: ChangeEvent<HTMLInputElement>) => {
		onUpdateSearch(event.currentTarget.value);
	};

	if (isLoading) {
		return <PageLoading />;
	}

	return (
		<Grid container direction="column" spacing={2}>
			<TextField
				label="Search"
				variant="standard"
				autoFocus
				placeholder="Search for transactions..."
				value={searchQuery}
				onChange={handleSearchChanged}
			/>
			{!!searchQuery && transactions.length === 0 && (
				<NoResults>No transactions matched your search.</NoResults>
			)}
			<Transactions
				transactions={transactions}
				categoryById={categoryById}
				incomeById={incomeById}
				expenseById={expenseById}
				expenseTransactions={expenseTransactions}
				variant="search"
				onlyShowNewItems={false}
				setOnlyShowNewItems={() => undefined}
				includePendingItems={false}
			/>
		</Grid>
	);
}
