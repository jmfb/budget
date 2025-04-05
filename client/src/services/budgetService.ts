import {
	IIncome,
	IExpense,
	IBankRecord,
	ICapitalOneRecord,
	ITransaction,
	IPendingItem,
	TransactionSource,
} from "~/models";
import * as dateService from "./dateService";

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
		0,
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
		0,
	);
}

export function getMonthlyExpense(expense: IExpense) {
	return round(expense.amount / expense.monthsInterval);
}

export function getTotalPendingSpend(pendingItems: IPendingItem[]) {
	return pendingItems
		.filter((item) => !item.expenseName && !item.incomeName)
		.reduce((total, item) => total + item.amount, 0);
}

export function round(value: number) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function format(value: number) {
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: "USD",
	}).format(value);
}

export function getTotal(transactions: ITransaction[]) {
	return transactions?.reduce((total, { amount }) => total + amount, 0) ?? 0;
}

export function getExpenseTotal(
	expenseTransactions: Record<string, ITransaction[]>,
	transaction: ITransaction,
) {
	if (!transaction.expenseName) {
		return 0;
	}
	const transactions = expenseTransactions[transaction.expenseName];
	if (!transactions) {
		return 0;
	}
	const priorTransactions = transactions.filter(
		(prior) =>
			prior.date < transaction.date ||
			(prior.date === transaction.date && prior.id < transaction.id),
	);
	return getTotal(priorTransactions);
}

export function getTransactionAmount(
	transaction: ITransaction,
	incomes: IIncome[],
	expenses: IExpense[],
	expenseTransactions: Record<string, ITransaction[]>,
) {
	const income = incomes.find(
		(income) => income.name === transaction.incomeName,
	);
	const expense = expenses.find(
		(expense) => expense.name === transaction.expenseName,
	);
	const expenseTotal = getExpenseTotal(expenseTransactions, transaction);
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
	expenseTransactions: Record<string, ITransaction[]>,
) {
	if (!transactions) {
		return 0;
	}
	const pendingTotal = getTotalPendingSpend(pendingItems);
	let transactionTotal = 0;
	for (const transaction of transactions) {
		const amount = getTransactionAmount(
			transaction,
			incomes,
			expenses,
			expenseTransactions,
		);
		if (amount > 0) {
			transactionTotal += amount;
		}
	}
	return pendingTotal + transactionTotal;
}

export function getExtraIncome(
	transactions: ITransaction[],
	incomes: IIncome[],
	expenses: IExpense[],
) {
	if (!transactions) {
		return 0;
	}
	return transactions
		.map((transaction) =>
			getTransactionAmount(transaction, incomes, expenses, {}),
		)
		.filter((amount) => amount < 0)
		.reduce((total, amount) => total - amount, 0);
}

export function getDiscrepancy(
	transaction: ITransaction,
	incomes: IIncome[],
	expenses: IExpense[],
	expenseTransactions: Record<string, ITransaction[]>,
) {
	const income = incomes.find(
		(income) => income.name === transaction.incomeName,
	);
	if (income) {
		return income.amount + transaction.amount;
	}
	const expense = expenses.find(
		(expense) => expense.name === transaction.expenseName,
	);
	if (expense) {
		if (expense.isDistributed) {
			const expenseTotal = getExpenseTotal(
				expenseTransactions,
				transaction,
			);
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
		account: record[1],
		description: record[2],
		checkNumber: record[3],
		category: record[4],
		memo: record[5],
		credit: Number.parseFloat(record[6]),
		debit: Number.parseFloat(record[7]),
		rawText: record.join(","),
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
		rawText: record.join(","),
	};
}

export function convertBankRecordToTransaction(
	record: IBankRecord,
): ITransaction {
	const { date, description, category, debit, credit, rawText } = record;
	return {
		date,
		id: 0,
		source: TransactionSource.Bank,
		rawText,
		amount: -(credit || debit),
		originalCategory: category,
		description,
		category: "",
		note: "",
		expenseName: "",
		incomeName: "",
	};
}

export function convertCapitalOneRecordToTransaction(
	record: ICapitalOneRecord,
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
		category: "",
		note: "",
		expenseName: "",
		incomeName: "",
	};
}

function isSameAmount(first: number, second: number) {
	const epsilon = 0.01;
	const lowerBound = second - epsilon;
	const upperBound = second + epsilon;
	return first > lowerBound && first < upperBound;
}

function getFundamentalDescription(value: string) {
	return value.toLowerCase().replace(/\s/g, "");
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

export function matchesTransaction(
	searchQuery: string,
	transaction: ITransaction,
) {
	const strings = [
		transaction.category,
		transaction.note,
		transaction.incomeName,
		transaction.expenseName,
		transaction.description,
	];
	const numbers = [transaction.amount];
	return (
		matchesStrings(searchQuery, strings) ||
		matchesNumbers(searchQuery, numbers)
	);
}

function matchesStrings(searchQuery: string, values: string[]) {
	return values.some((value) => matchesString(searchQuery, value));
}

function matchesString(searchQuery: string, value: string) {
	if (!searchQuery) {
		return true;
	}
	if (!value) {
		return false;
	}
	return value.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
}

function matchesNumbers(searchQuery: string, values: number[]) {
	if (!searchQuery) {
		return true;
	}
	const numberSearch = Number.parseFloat(searchQuery);
	if (Number.isNaN(numberSearch)) {
		return false;
	}
	return values.some((value) => matchesNumber(numberSearch, value));
}

function matchesNumber(numberSearch: number, value: number) {
	const lowerBound = Math.abs(value) - 1;
	const upperBound = Math.abs(value) + 1;
	return numberSearch >= lowerBound && numberSearch <= upperBound;
}
