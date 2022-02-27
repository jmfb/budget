import React from 'react';
import LoadingIcon from './LoadingIcon';
import cx from 'classnames';
import styles from './Button.css';

export interface IButtonProps {
	className?: string;
	onClick?(): void;
	children?: React.ReactNode;
	isDisabled?: boolean;
	isProcessing?: boolean;
	autoFocus?: boolean;
}

export default function Button({
	className,
	onClick,
	children,
	isDisabled,
	isProcessing,
	autoFocus
}: IButtonProps) {
	return (
		<button
			{...{onClick, autoFocus}}
			className={cx(styles.button, styles.primary, className)}
			disabled={isDisabled}>
			<div className={cx({ [styles.processing]: isProcessing })}>{children}</div>
			{isProcessing &&
				<LoadingIcon />
			}
		</button>
	);
}
