import React from 'react';
import { LoadingIcon } from './LoadingIcon';
import cx from 'classnames';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'default' | 'danger';

export interface IButtonProps {
	className?: string;
	variant: ButtonVariant;
	onClick?(): void;
	children?: React.ReactNode;
	isDisabled?: boolean;
	isProcessing?: boolean;
	autoFocus?: boolean;
}

export function Button({
	className,
	variant,
	onClick,
	children,
	isDisabled,
	isProcessing,
	autoFocus
}: IButtonProps) {
	return (
		<button
			{...{ onClick, autoFocus }}
			className={cx(
				styles.button,
				styles[variant ?? 'default'],
				className
			)}
			disabled={isDisabled}>
			<div className={cx({ [styles.processing]: isProcessing })}>
				{children}
			</div>
			{isProcessing && <LoadingIcon />}
		</button>
	);
}
