import { IErrorState } from './error.slice';
import { IAuthState } from './auth.slice';
import { IDiagnosticsState } from './diagnostics.slice';
import { IBudgetState } from './budget.slice';
import { IExpensesState } from './expenses.slice';
import { IIncomesState } from './incomes.slice';
import { IPendingItemsState } from './pendingItems.slice';

export default interface IState {
	error: IErrorState;
	auth: IAuthState;
	diagnostics: IDiagnosticsState;
	budget: IBudgetState;
	expenses: IExpensesState;
	incomes: IIncomesState;
	pendingItems: IPendingItemsState;
}
