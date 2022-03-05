import { IIncome, IExpense, IBankRecord } from '~/models';
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

export function parseCsv(file: File) {
	return new Promise<string[][]>(resolve => {
		const reader = new FileReader();
		reader.onload = async event => {
			const parser = parse();
			parser.write(event.target.result);
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
		.filter(result => result[0] !== 'Date')
		.map(parseBankRecord);
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
