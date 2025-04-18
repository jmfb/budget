import { ReactNode } from "react";
import { IconType } from "react-icons";
import { LoadingIcon } from "~/components";
import { clsx } from "clsx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "default" | "danger";

export interface IButtonProps {
	className?: string;
	icon?: IconType;
	variant?: ButtonVariant;
	onClick?(): void;
	children?: ReactNode;
	isDisabled?: boolean;
	isProcessing?: boolean;
	autoFocus?: boolean;
}

export function Button({
	className,
	icon: Icon,
	variant,
	onClick,
	children,
	isDisabled,
	isProcessing,
	autoFocus,
}: IButtonProps) {
	return (
		<button
			onClick={onClick}
			autoFocus={autoFocus}
			className={clsx(
				styles.button,
				styles[variant ?? "default"],
				className,
			)}
			disabled={isDisabled}
		>
			<div
				className={clsx(
					styles.children,
					isProcessing && styles.processing,
				)}
			>
				{Icon && <Icon className={styles.icon} />}
				{children}
			</div>
			{isProcessing && <LoadingIcon />}
		</button>
	);
}
