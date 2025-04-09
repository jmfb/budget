import { useRef, useEffect } from "react";

export interface Cancelable {
	cancel(): void;
}

export interface CancelablePromise<TResult> extends Cancelable {
	promise: Promise<TResult>;
}

export function makeCancelable<TResult>(
	promise: Promise<TResult>,
): CancelablePromise<TResult> {
	let hasCanceled = false;

	const wrappedPromise = promise.then(
		(result) => {
			if (hasCanceled) {
				throw { isCanceled: true };
			}
			return result;
		},
		(error) => {
			if (hasCanceled) {
				throw { isCanceled: true };
			}
			throw error;
		},
	);

	return {
		promise: wrappedPromise,
		cancel() {
			hasCanceled = true;
		},
	};
}

export function useCancelablePromises() {
	const cancelablePromises = useRef<Cancelable[]>([]);

	const cancel = () => {
		for (const cancelablePromise of cancelablePromises.current) {
			cancelablePromise.cancel();
		}
		cancelablePromises.current = [];
	};

	useEffect(() => cancel, []);

	return {
		wrap<TResult>(promise: Promise<TResult>) {
			const cancelablePromise = makeCancelable(promise);
			cancelablePromises.current.push(cancelablePromise);
			return cancelablePromise.promise;
		},
		cancel,
		isCanceled(error: unknown) {
			return (
				error != null &&
				typeof error === "object" &&
				"isCanceled" in error &&
				error.isCanceled === true
			);
		},
	};
}
