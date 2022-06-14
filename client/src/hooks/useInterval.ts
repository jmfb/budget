import { useRef, useEffect } from 'react';

type Action = () => void;

export default function useInterval(callback: Action, timeout: number) {
	const callbackRef = useRef<Action>();

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const intervalId = window.setInterval(
			() => callbackRef.current(),
			timeout
		);
		return () => window.clearInterval(intervalId);
	}, [timeout]);
}
