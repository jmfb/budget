import { useEffect } from "react";

export function useTriggerEffect(action: () => void, trigger: boolean) {
	useEffect(() => {
		if (trigger) {
			action();
		}
	}, [trigger]);
}
