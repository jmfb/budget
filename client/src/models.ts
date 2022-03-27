export interface IErrorReport {
	action: string;
	context: string;
	message: string;
}

export interface IIndexModel {
	bundleVersion: string;
}

export interface ISignedInModel {
	accessToken: string;
	email: string;
}

export interface IHeartbeatModel {
	bundleVersion: string;
}

export interface IIncome {
	name: string;
	amount: number;
	weeksInterval: number;
}

export interface IExpense {
	name: string;
	amount: number;
	category: string;
	monthsInterval: number;
	isDistributed: boolean;
}

export enum TransactionSource {
	Bank = 0,
	CapitalOne = 1
}

export interface ITransaction {
	date: string;
	id: number;
	source: TransactionSource;
	rawText: string;
	amount: number;
	originalCategory: string;
	description: string;
	category: string;
	note: string;
	expenseName: string;
	incomeName: string;
}

export interface IPendingItem {
	id: number;
	name: string;
	amount: number;
}

export type IExpenseTotals = Record<string, number>;

export interface IBudgetResponse {
	incomes: IIncome[];
	expenses: IExpense[];
	weeklyTransactions: ITransaction[];
	yearlyExpenseTotals: IExpenseTotals;
	pendingItems: IPendingItem[];
}

export interface IWeeklyTransactionsResponse {
	weeklyTransactions: ITransaction[];
	yearlyExpenseTotals: IExpenseTotals;
}

export interface IWeeklyTransactions {
	weekOf: string;
	isLoading: boolean;
	transactions: ITransaction[];
	yearlyExpenseTotals: IExpenseTotals;
}

export type IWeeklyTransactionsByWeekOf = Record<string, IWeeklyTransactions>;

export interface IDayOfWeek {
	day: number;
	weekday: string;
	isPast: boolean;
	isToday: boolean;
	isFuture: boolean;
}

export interface IBankRecord {
	date: string;
	referenceNumber: string;
	type: string;
	description: string;
	debit: number;
	credit: number;
	checkNumber: string;
	balance: number;
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
