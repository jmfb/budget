interface AsyncResult<TResult> {
	index: number;
	result: TResult;
}

interface ExecutingItem<TResult> {
	index: number;
	promise: Promise<AsyncResult<TResult>>;
}

export async function parallelMap<T, TResult>(
	values: T[],
	action: (value: T) => Promise<TResult>,
	options: {
		maxDegreesOfParallelism: number;
	},
) {
	const { maxDegreesOfParallelism } = options;
	const executing: ExecutingItem<TResult>[] = [];
	const completed: AsyncResult<TResult>[] = [];

	// Helper lambda to combine the index with the async result
	const runAction = async (index: number, value: T) => ({
		index,
		result: await action(value),
	});

	// Queue each value and retain the original index in the source values
	for (let index = 0; index < values.length; ++index) {
		// If we are currently at our max degrees of parallelism, wait for one to complete
		if (executing.length === maxDegreesOfParallelism) {
			// Wait for the next exeucting item to finish
			const result = await Promise.race(
				executing.map((item) => item.promise),
			);

			// Find the executing item that just completed by index and remove it
			const resultIndex = executing.findIndex(
				(item) => item.index === result.index,
			);
			executing.splice(resultIndex, 1);

			// Add the result to the completed list
			completed.push(result);
		}

		// Start executing the next item
		executing.push({ index, promise: runAction(index, values[index]) });
	}

	// Wait for all executing items
	completed.push(
		...(await Promise.all(executing.map((item) => item.promise))),
	);

	// Return the results in the original value order
	return completed
		.sort((a, b) => a.index - b.index)
		.map((item) => item.result);
}
