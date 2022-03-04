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

export interface IBudgetResponse {
	incomes: IIncome[];
	expenses: IExpense[];
	weeklyTransactions: ITransaction[];
}

export interface IWeeklyTransactions {
	weekOf: string;
	isLoading: boolean;
	transactions: ITransaction[];
}

export type IWeeklyTransactionsByWeekOf = Record<string, IWeeklyTransactions>;
