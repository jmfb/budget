export interface IErrorReport {
	action: string;
	context: string;
	message: string;
}

export interface IIndexModel {
	bundleVersion: string;
	expensesVersion: number;
	incomesVersion: number;
	pendingItemsVersion: number;
	weekVersions: Record<string, number>;
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

export interface IGetIncomesResponse {
	version: number;
	incomes: IIncome[];
}

export interface IExpense {
	name: string;
	amount: number;
	category: string;
	monthsInterval: number;
	isDistributed: boolean;
}

export interface IGetExpensesResponse {
	version: number;
	expenses: IExpense[];
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

export interface IGetTransactionsResponse {
	version: number;
	weekOf: string;
	transactions: ITransaction[];
}

export interface IPendingItem {
	id: number;
	name: string;
	amount: number;
}

export interface IGetPendingItemsResponse {
	version: number;
	pendingItems: IPendingItem[];
}

export type IExpenseTotals = Record<string, number>;

export interface IBudgetResponse {
	weeklyTransactions: ITransaction[];
	yearlyExpenseTotals: IExpenseTotals;
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
	account: string;
	description: string;
	checkNumber: string;
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
