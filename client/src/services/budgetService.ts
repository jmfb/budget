import { IIncome, IExpense } from '~/models';

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
