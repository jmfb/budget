import { useState } from "react";
import { useStore } from "react-redux";
import { useCancelablePromises } from "./useCancelablePromises";
import { IStore, IAsyncActionOptions } from "~/redux";

export type AsyncActionWithoutOptions<T, TRequest> = (
	request: TRequest,
) => Promise<T>;

export type AsyncActionWithOptions<T, TRequest> = (
	request: TRequest,
	options: IAsyncActionOptions,
) => Promise<T>;

export type AsyncAction<T, TRequest> =
	| AsyncActionWithOptions<T, TRequest>
	| AsyncActionWithoutOptions<T, TRequest>;

export function useAsyncState<T, TRequest>(action: AsyncAction<T, TRequest>) {
	const [data, setData] = useState<T | null>(null);
	const [currentData, setCurrentData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isUninitialized, setIsUninitialized] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [wasSuccessful, setWasSuccessful] = useState(false);

	const store = useStore() as IStore;
	const { getState, dispatch } = store;
	const actionOptions = { getState, dispatch };

	const cancelablePromises = useCancelablePromises();

	return {
		data,
		currentData,
		error,
		hasError: !!error,
		wasSuccessful,
		isUninitialized,
		isLoading,
		isFetching,
		setData,
		async invoke(request: TRequest) {
			try {
				cancelablePromises.cancel();

				setCurrentData(null);
				setError(null);
				setIsLoading(isUninitialized);
				setIsFetching(true);
				setWasSuccessful(false);

				const nextPromise = action(request, actionOptions);
				const nextData = await cancelablePromises.wrap(nextPromise);

				setData(nextData);
				setCurrentData(nextData);
				setIsUninitialized(false);
				setIsLoading(false);
				setIsFetching(false);
				setWasSuccessful(true);
			} catch (currentError) {
				if (cancelablePromises.isCanceled(currentError)) {
					return;
				}

				setError(currentError as Error);
				setIsLoading(false);
				setIsFetching(false);
			}
		},
		clear() {
			setData(null);
			setCurrentData(null);
			setError(null);
			setIsUninitialized(true);
			setIsLoading(false);
			setIsFetching(false);
			setWasSuccessful(false);
		},
	};
}
