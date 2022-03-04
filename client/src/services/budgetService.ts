import { IIncome, IExpense } from '~/models';

const weeksPerYear = 52;
const monthsPerYear = 12;
const weeksPerMonth = weeksPerYear / monthsPerYear;

export function getWeeklyBudget(incomes: IIncome[], expenses: IExpense[]) {
	return round(getMonthlyBudget(incomes, expenses) / weeksPerMonth);
}

export function getMonthlyBudget(incomes: IIncome[], expenses: IExpense[]) {
	return getTotalMonthlyIncomes(incomes) - getTotalMonthlyExpenses(expenses);
}

export function getTotalMonthlyIncomes(incomes: IIncome[]) {
	return incomes.reduce((total, income) => total + getMonthlyIncome(income), 0);
}

export function getMonthlyIncome(income: IIncome) {
	return round((income.amount / income.weeksInterval) * weeksPerMonth);
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
