export interface IErrorReport {
	action: string;
	context: string;
	message: string;
}

export interface ISignedInModel {
	accessToken: string;
	email: string;
}

export interface ICategory {
	id: number;
	name: string;
}

export interface ICreateCategoryRequest {
	name: string;
}

export interface IUpdateCategoryRequest {
	name: string;
}

export interface IRetireCategoryRequest {
	retireId: number;
	replacementId: number;
}

export interface IIncome {
	id: number;
	year: number;
	name: string;
	amount: number;
	weeksInterval: number;
}

export interface ICreateIncomeRequest {
	year: number;
	name: string;
	amount: number;
	weeksInterval: number;
}

export interface IUpdateIncomeRequest {
	name: string;
	amount: number;
	weeksInterval: number;
}

export interface IExpense {
	id: number;
	year: number;
	name: string;
	amount: number;
	categoryId: number;
	monthsInterval: number;
	isDistributed: boolean;
}

export interface ICreateExpenseRequest {
	year: number;
	name: string;
	amount: number;
	categoryId: number;
	monthsInterval: number;
	isDistributed: boolean;
}

export interface IUpdateExpenseRequest {
	name: string;
	amount: number;
	categoryId: number;
	monthsInterval: number;
	isDistributed: boolean;
}

export enum TransactionSource {
	Bank = 0,
	CapitalOne = 1,
}

export interface ITransaction {
	id: number;
	date: string;
	sourceId: TransactionSource;
	rawText: string;
	amount: number;
	originalCategory: string;
	categoryId: number | null;
	description: string;
	note: string;
	expenseId: number | null;
	incomeId: number | null;
}

export interface IGetTransactionsResponse {
	transactions: ITransaction[];
	nextPageKey: string | null;
}

export interface ICreateTransactionRequest {
	date: string;
	sourceId: TransactionSource;
	rawText: string;
	amount: number;
	originalCategory: string;
	categoryId: number | null;
	description: string;
	note: string;
	expenseId: number | null;
	incomeId: number | null;
}

export interface IUpdateTransactionRequest {
	date: string;
	sourceId: TransactionSource;
	rawText: string;
	amount: number;
	originalCategory: string;
	categoryId: number | null;
	description: string;
	note: string;
	expenseId: number | null;
	incomeId: number | null;
}

export interface IPendingItem {
	id: number;
	name: string;
	amount: number;
	categoryId: number | null;
	expenseId: number | null;
	incomeId: number | null;
}

export interface ICreatePendingItemRequest {
	name: string;
	amount: number;
	categoryId: number | null;
	expenseId: number | null;
	incomeId: number | null;
}

export interface IUpdatePendingItemRequest {
	name: string;
	amount: number;
	categoryId: number | null;
	expenseId: number | null;
	incomeId: number | null;
}

export interface IDayOfWeek {
	day: number;
	weekday: string;
	isPast: boolean;
	isToday: boolean;
	isFuture: boolean;
}

export interface IBankRecord {
	date: string;
	account: string;
	description: string;
	checkNumber: string;
	category: string;
	memo: string;
	credit: number;
	debit: number;
	rawText: string;
}

export interface ICapitalOneRecord {
	transactionDate: string;
	postedDate: string;
	cardNumber: string;
	description: string;
	category: string;
	debit: number;
	credit: number;
	rawText: string;
}
