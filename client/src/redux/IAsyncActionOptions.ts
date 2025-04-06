import { IState } from "./IState";
import { IDispatch } from "./IDispatch";

export interface IAsyncActionOptions {
	getState: () => IState;
	dispatch: IDispatch;
}
