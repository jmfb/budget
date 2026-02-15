import { useEffect, useState } from "react";
import { ConfirmationModal, ConfirmationModalProps } from "./ConfirmationModal";

export type ConfirmationProps = Omit<
	ConfirmationModalProps,
	"onCancel" | "onConfirm"
> & {
	onConfirmed(): void;
	onCancel?(): void;
	dismiss?: boolean;
};

export function useConfirmation({
	onConfirmed,
	onCancel,
	dismiss,
	...modalProps
}: ConfirmationProps) {
	const [isConfirming, setIsConfirming] = useState(false);

	useEffect(() => {
		if (dismiss && isConfirming) {
			setIsConfirming(false);
		}
	}, [dismiss, isConfirming]);

	const handleShowPrompt = () => setIsConfirming(true);
	const handleCanceled = () => {
		setIsConfirming(false);
		onCancel?.();
	};
	const handleConfirmed = () => {
		if (dismiss === undefined) {
			setIsConfirming(false);
		}
		onConfirmed();
	};

	return {
		children: isConfirming ? (
			<ConfirmationModal
				{...modalProps}
				onCancel={handleCanceled}
				onConfirm={handleConfirmed}
			/>
		) : null,
		isConfirming,
		showPrompt: handleShowPrompt,
	};
}
