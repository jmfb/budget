import { useRef, useEffect } from 'react';

export default function useDocumentKeyboardEvent(
	eventName: string,
	handler: (event: KeyboardEvent) => void
) {
	const handlerRef = useRef(handler);

	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		const callback = (event: KeyboardEvent) => handlerRef.current(event);
		document.addEventListener(eventName, callback, false);
		return () => document.removeEventListener(eventName, callback);
	}, [eventName]);
}
