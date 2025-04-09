import { useRef, useEffect } from "react";

type Action = () => void;

export function useInterval(callback: Action, timeout: number) {
	const callbackRef = useRef<Action>(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const intervalId = window.setInterval(
			() => callbackRef.current(),
			timeout,
		);
		return () => window.clearInterval(intervalId);
	}, [timeout]);
}
