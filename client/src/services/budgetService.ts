import {
	IIncome,
	IExpense,
	IBankRecord,
	ICapitalOneRecord,
	ITransaction,
	IPendingItem,
	TransactionSource,
	IExpenseTotals
} from '~/models';
import * as dateService from './dateService';

const weeksPerYear = 52;
const monthsPerYear = 12;
const weeksPerMonth = weeksPerYear / monthsPerYear;

export function getWeeklyBudget(incomes: IIncome[], expenses: IExpense[]) {
	return getWeeklyIncomes(incomes) - getWeeklyExpenses(expenses);
}

export function getMonthlyBudget(incomes: IIncome[], expenses: IExpense[]) {
	return getTotalMonthlyIncomes(incomes) - getTotalMonthlyExpenses(expenses);
}

export function getWeeklyIncomes(incomes: IIncome[]) {
	return round(getTotalMonthlyIncomes(incomes) / weeksPerMonth);
}

export function getTotalMonthlyIncomes(incomes: IIncome[]) {
	return incomes.reduce(
		(total, income) => total + getMonthlyIncome(income),
		0
	);
}

export function getMonthlyIncome(income: IIncome) {
	return round((income.amount / income.weeksInterval) * weeksPerMonth);
}

export function getWeeklyExpenses(expenses: IExpense[]) {
	return round(getTotalMonthlyExpenses(expenses) / weeksPerMonth);
}

export function getTotalMonthlyExpenses(expenses: IExpense[]) {
	return expenses.reduce(
		(total, expense) => total + getMonthlyExpense(expense),
		0
	);
}

export function getMonthlyExpense(expense: IExpense) {
	return round(expense.amount / expense.monthsInterval);
}

export function getTotalPendingSpend(pendingItems: IPendingItem[]) {
	return pendingItems.reduce((total, item) => total + item.amount, 0);
}

export function round(value: number) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function format(value: number) {
	return new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'USD'
	}).format(value);
}

export function getTransactionAmount(
	transaction: ITransaction,
	incomes: IIncome[],
	expenses: IExpense[],
	yearlyExpenseTotals: IExpenseTotals,
	weekExpesneTotals: IExpenseTotals
) {
	const income = incomes.find(
		income => income.name === transaction.incomeName
	);
	const expense = expenses.find(
		expense => expense.name === transaction.expenseName
	);
	const yearlyExpenseTotal =
		yearlyExpenseTotals[transaction.expenseName] ?? 0;
	const weekExpenseTotal = weekExpesneTotals[transaction.expenseName] ?? 0;
	const expenseTotal = yearlyExpenseTotal + weekExpenseTotal;
	const expenseTotalWithAmount = expenseTotal + transaction.amount;

	if (transaction.amount > 0 || expense) {
		if (expense?.isDistributed) {
			if (expenseTotal > expense.amount) {
				return transaction.amount;
			}
			if (expenseTotalWithAmount > expense.amount) {
				return expenseTotalWithAmount - expense.amount;
			}
			return 0;
		}
		return transaction.amount - (expense?.amount ?? 0);
	}
	return transaction.amount + (income?.amount ?? 0);
}

export function getTotalSpend(
	transactions: ITransaction[],
	pendingItems: IPendingItem[],
	incomes: IIncome[],
	expenses: IExpense[],
	yearlyExpenseTotals: IExpenseTotals
) {
	if (!transactions) {
		return 0;
	}
	const pendingTotal = getTotalPendingSpend(pendingItems);
	const weekExpenseTotal: IExpenseTotals = {};
	let transactionTotal = 0;
	for (const transaction of transactions) {
		const amount = getTransactionAmount(
			transaction,
			incomes,
			expenses,
			yearlyExpenseTotals,
			weekExpenseTotal
		);
		if (amount > 0) {
			transactionTotal += amount;
		}
		const currentWeekTotal = weekExpenseTotal[transaction.expenseName] ?? 0;
		weekExpenseTotal[transaction.expenseName] =
			currentWeekTotal + transaction.amount;
	}
	return pendingTotal + transactionTotal;
}

export function getExtraIncome(
	transactions: ITransaction[],
	incomes: IIncome[],
	expenses: IExpense[]
) {
	if (!transactions) {
		return 0;
	}
	return transactions
		.map(transaction =>
			getTransactionAmount(transaction, incomes, expenses, {}, {})
		)
		.filter(amount => amount < 0)
		.reduce((total, amount) => total - amount, 0);
}

export function getDiscrepancy(
	transaction: ITransaction,
	incomes: IIncome[],
	expenses: IExpense[],
	yearlyExpenseTotals: IExpenseTotals,
	weekExpesneTotals: IExpenseTotals
) {
	const income = incomes.find(
		income => income.name === transaction.incomeName
	);
	if (income) {
		return income.amount + transaction.amount;
	}
	const expense = expenses.find(
		expense => expense.name === transaction.expenseName
	);
	if (expense) {
		if (expense.isDistributed) {
			const yearlyExpenseTotal = yearlyExpenseTotals[expense.name] ?? 0;
			const weekExpenseTotal = weekExpesneTotals[expense.name] ?? 0;
			const expenseTotal = yearlyExpenseTotal + weekExpenseTotal;
			const expenseTotalWithAmount = expenseTotal + transaction.amount;
			if (expenseTotal > expense.amount) {
				return transaction.amount;
			}
			if (expenseTotalWithAmount > expense.amount) {
				return expenseTotalWithAmount - expense.amount;
			}
			return 0;
		}
		return transaction.amount - expense.amount;
	}
	return 0;
}

export function isCapitalOneDebit(transaction: ITransaction) {
	return (
		transaction.amount > 0 &&
		!!transaction.description.match(/^CAPITAL ONE .*$/i)
	);
}

export function isCapitalOneCredit(transaction: ITransaction) {
	return (
		transaction.amount < 0 &&
		!!transaction.description.match(/^CAPITAL ONE .*$/i)
	);
}

export function parseBankRecord(record: string[]): IBankRecord {
	return {
		date: dateService.toString(new Date(record[0])),
		referenceNumber: record[1],
		type: record[2],
		description: record[3],
		debit: Number.parseFloat(record[4]),
		credit: Number.parseFloat(record[5]),
		checkNumber: record[6],
		balance: Number.parseFloat(record[7]),
		rawText: record.join(',')
	};
}

export function parseCapitalOneRecord(record: string[]): ICapitalOneRecord {
	return {
		transactionDate: record[0],
		postedDate: record[1],
		cardNumber: record[2],
		description: record[3],
		category: record[4],
		debit: Number.parseFloat(record[5]),
		credit: Number.parseFloat(record[6]),
		rawText: record.join(',')
	};
}

export function convertBankRecordToTransaction(
	record: IBankRecord
): ITransaction {
	const { date, type, description, debit, credit, rawText } = record;
	return {
		date,
		id: 0,
		source: TransactionSource.Bank,
		rawText,
		amount: type === 'CREDIT' ? -credit : -debit,
		originalCategory: '',
		description,
		category: '',
		note: '',
		expenseName: '',
		incomeName: ''
	};
}

export function convertCapitalOneRecordToTransaction(
	record: ICapitalOneRecord
): ITransaction {
	const { transactionDate, description, category, debit, credit, rawText } =
		record;
	return {
		date: transactionDate,
		id: 0,
		source: TransactionSource.CapitalOne,
		rawText,
		amount: Number.isNaN(debit) ? -credit : debit,
		originalCategory: category,
		description,
		category: '',
		note: '',
		expenseName: '',
		incomeName: ''
	};
}

function isSameAmount(first: number, second: number) {
	const epsilon = 0.01;
	const lowerBound = second - epsilon;
	const upperBound = second + epsilon;
	return first > lowerBound && first < upperBound;
}

function getFundamentalDescription(value: string) {
	return value.toLowerCase().replace(/\s/g, '');
}

function isSameDescription(first: string, second: string) {
	return (
		getFundamentalDescription(first) === getFundamentalDescription(second)
	);
}

export function isSameTransaction(first: ITransaction, second: ITransaction) {
	return (
		first.source === second.source &&
		isSameAmount(first.amount, second.amount) &&
		isSameDescription(first.description, second.description)
	);
}
