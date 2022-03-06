import {
	IIncome,
	IExpense,
	IBankRecord,
	ICapitalOneRecord,
	ITransaction,
	TransactionSource
} from '~/models';
import { parse } from 'csv-parse';
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
	return incomes.reduce((total, income) => total + getMonthlyIncome(income), 0);
}

export function getMonthlyIncome(income: IIncome) {
	return round((income.amount / income.weeksInterval) * weeksPerMonth);
}

export function getWeeklyExpenses(expenses: IExpense[]) {
	return round(getTotalMonthlyExpenses(expenses) / weeksPerMonth);
}

export function getTotalMonthlyExpenses(expenses: IExpense[]) {
	return expenses.reduce((total, expense) => total + getMonthlyExpense(expense), 0);
}

export function getMonthlyExpense(expense: IExpense) {
	return round(expense.amount / expense.monthsInterval);
}

export function round(value: number) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function format(value: number) {
	return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
}

export function getDistinctWeekOfs(transactions: ITransaction[]) {
	const weekOfs = transactions.map(transaction => dateService.getStartOfWeek(transaction.date));
	return weekOfs.filter((weekOf, index) => weekOfs.indexOf(weekOf) === index);
}

export function parseCsv(file: File) {
	return new Promise<string[][]>(resolve => {
		const reader = new FileReader();
		reader.onload = async event => {
			const parser = parse();
			const { result } = event.target;
			parser.write((<string>result).trim());
			parser.end();
			const results = [] as string[][];
			for await (const record of parser) {
				results.push(record);
			}
			resolve(results);
		};
		reader.readAsText(file);
	});
}

export async function parseBankCsv(file: File) {
	const results = await parseCsv(file);
	return results
		.slice(1)
		.map(parseBankRecord)
		.map(convertBankRecordToTransaction);
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

export function convertBankRecordToTransaction(record: IBankRecord): ITransaction {
	const {
		date,
		type,
		description,
		debit,
		credit,
		rawText
	} = record;
	return {
		date,
		id: 0,
		source: TransactionSource.Bank,
		rawText,
		amount: type === 'CREDIT' ? -credit : debit,
		originalCategory: '',
		description,
		category: '',
		note: '',
		expenseName: '',
		incomeName: ''
	};
}

export async function parseCapitalOneCsv(file: File) {
	const results = await parseCsv(file);
	return results
		.slice(1)
		.map(parseCapitalOneRecord)
		.map(convertCapitalOneRecordToTransaction);
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

export function convertCapitalOneRecordToTransaction(record: ICapitalOneRecord): ITransaction {
	const {
		transactionDate,
		description,
		category,
		debit,
		credit,
		rawText
	} = record;
	return {
		date: transactionDate,
		id: 0,
		source: TransactionSource.CapitalOne,
		rawText,
		amount: debit === NaN ? -credit : debit,
		originalCategory: category,
		description,
		category,
		note: '',
		expenseName: '',
		incomeName: ''
	};
}
