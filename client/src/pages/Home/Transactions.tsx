import React from 'react';
import { ITransaction } from '~/models';
import { budgetService } from '~/services';

export interface ITransactionsProps {
	transactions: ITransaction[];
}

export default function Transaction({
	transactions
}: ITransactionsProps) {
	const transactionsByDate = transactions.reduce((map, transaction) => {
		const grouping = map[transaction.date];
		if (grouping === undefined) {
			map[transaction.date] = [transaction];
		} else {
			grouping.push(transaction);
		}
		return map;
	}, {} as Record<string, ITransaction[]>);

	return (
		<div>
			{Object.keys(transactionsByDate).sort((a, b) => -a.localeCompare(b)).map(date =>
				<div key={date}>
					<h3>{date}</h3>
					{transactionsByDate[date].map(transaction =>
						<div key={transaction.id}>
							{budgetService.format(transaction.amount)} - {transaction.description}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
